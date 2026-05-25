const { validationResult } = require('express-validator');
const { sequelize } = require('../config/database');
const { Order, OrderItem, Payment, MenuItem, Restaurant } = require('../models/associations');
const crypto = require('crypto');

const DELIVERY_FEE = 150;
const TAX_RATE = 0.08;
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';
const PAYSTACK_CALLBACK_URL = process.env.PAYSTACK_CALLBACK_URL || 'cravyapp://paystack-callback';

const buildOrderPayload = async ({ user, body, transaction }) => {
  const { restaurantId, items, paymentMethod, deliveryAddress, deliveryInstructions, contactPhone } = body;

  const restaurant = await Restaurant.findByPk(restaurantId, { transaction });
  if (!restaurant || !restaurant.isActive) {
    throw new Error('Restaurant not found');
  }

  const menuItemIds = items.map((item) => item.menuItemId);
  const menuItems = await MenuItem.findAll({
    where: { id: menuItemIds, restaurantId, isAvailable: true },
    transaction
  });

  if (menuItems.length !== menuItemIds.length) {
    throw new Error('One or more menu items are invalid or unavailable');
  }

  const menuItemMap = new Map(menuItems.map((item) => [item.id, item]));
  const normalizedItems = items.map((item) => {
    const menuItem = menuItemMap.get(item.menuItemId);
    const unitPrice = Number(menuItem.price);
    const quantity = Number(item.quantity);

    return {
      menuItemId: menuItem.id,
      name: menuItem.name,
      quantity,
      unitPrice,
      totalPrice: unitPrice * quantity
    };
  });

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const deliveryFee = DELIVERY_FEE;
  const tax = Number((subtotal * TAX_RATE).toFixed(2));
  const total = Number((subtotal + deliveryFee + tax).toFixed(2));

  return {
    restaurant,
    normalizedItems,
    paymentMethod,
    deliveryAddress,
    deliveryInstructions,
    contactPhone,
    subtotal,
    deliveryFee,
    tax,
    total
  };
};

const fetchOrderWithDetails = (orderId) => Order.findByPk(orderId, {
  include: [
    { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
    { model: OrderItem, as: 'items' },
    { model: Payment, as: 'payment' }
  ]
});

const initializePaystackTransaction = async ({ email, amount, reference, metadata }) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
    },
    body: JSON.stringify({
      email,
      amount,
      reference,
      callback_url: PAYSTACK_CALLBACK_URL,
      metadata
    })
  });

  return response.json();
};

const verifyPaystackTransaction = async (reference) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${reference}`, {
    headers: {
      'Authorization': `Bearer ${PAYSTACK_SECRET_KEY}`
    }
  });

  return response.json();
};

exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      restaurant,
      normalizedItems,
      paymentMethod,
      deliveryAddress,
      deliveryInstructions,
      contactPhone,
      subtotal,
      deliveryFee,
      tax,
      total
    } = await buildOrderPayload({ user: req.user, body: req.body, transaction });

    const paymentStatus = 'pending';
    const orderStatus = paymentMethod === 'cash' ? 'confirmed' : 'pending';

    const order = await Order.create({
      userId: req.user.id,
      restaurantId,
      status: orderStatus,
      paymentStatus,
      paymentMethod,
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress,
      deliveryInstructions: deliveryInstructions || null,
      contactPhone: contactPhone || req.user.phone || null,
      placedAt: new Date()
    }, { transaction });

    await OrderItem.bulkCreate(
      normalizedItems.map((item) => ({
        orderId: order.id,
        ...item
      })),
      { transaction }
    );

    const paymentReference = `cravyapp_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const payment = await Payment.create({
      orderId: order.id,
      amount: total,
      method: paymentMethod,
      status: paymentStatus,
      gateway: paymentMethod === 'cash' ? 'manual' : 'paystack',
      providerReference: paymentMethod === 'cash' ? null : paymentReference,
      paidAt: paymentMethod === 'cash' ? null : null
    }, { transaction });

    let paystackData = null;
    if (paymentMethod !== 'cash') {
      if (!PAYSTACK_SECRET_KEY) {
        throw new Error('PAYSTACK_SECRET_KEY is not configured');
      }

      paystackData = await initializePaystackTransaction({
        email: req.user.email,
        amount: Math.round(total * 100),
        reference: paymentReference,
        metadata: {
          orderId: order.id,
          userId: req.user.id,
          restaurantId: restaurant.id
        }
      });

      if (!paystackData.status || !paystackData.data?.authorization_url) {
        throw new Error(paystackData.message || 'Failed to initialize Paystack transaction');
      }

      await payment.update({
        accessCode: paystackData.data.access_code,
        authorizationUrl: paystackData.data.authorization_url,
        gatewayResponse: paystackData.message || null
      }, { transaction });
    }

    await transaction.commit();

    const createdOrder = await fetchOrderWithDetails(order.id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order: createdOrder,
        checkout: paystackData ? {
          authorizationUrl: paystackData.data.authorization_url,
          accessCode: paystackData.data.access_code,
          reference: paystackData.data.reference
        } : null
      }
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.verifyOrderPayment = async (req, res) => {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).json({
        success: false,
        message: 'PAYSTACK_SECRET_KEY is not configured'
      });
    }

    const order = await Order.findByPk(req.params.id, {
      include: [{ model: Payment, as: 'payment' }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to verify this order'
      });
    }

    const reference = req.body.reference || order.payment?.providerReference;
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: 'Payment reference is required'
      });
    }

    const verification = await verifyPaystackTransaction(reference);
    if (!verification.status || !verification.data) {
      return res.status(400).json({
        success: false,
        message: verification.message || 'Unable to verify transaction'
      });
    }

    const paymentStatus = verification.data.status === 'success' ? 'paid' : 'failed';
    const orderStatus = verification.data.status === 'success' ? 'confirmed' : 'cancelled';

    await order.update({
      paymentStatus,
      status: orderStatus
    });

    await order.payment?.update({
      status: paymentStatus,
      paidAt: paymentStatus === 'paid' ? new Date(verification.data.paid_at || Date.now()) : null,
      gatewayResponse: verification.data.gateway_response || verification.message || null,
      providerReference: verification.data.reference || reference
    });

    const updatedOrder = await fetchOrderWithDetails(order.id);

    res.json({
      success: true,
      message: paymentStatus === 'paid' ? 'Payment verified successfully' : 'Payment verification completed',
      data: { order: updatedOrder, verification: verification.data }
    });
  } catch (error) {
    console.error('Verify order payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.handlePaystackWebhook = async (req, res) => {
  try {
    if (!PAYSTACK_SECRET_KEY) {
      return res.status(500).send('PAYSTACK_SECRET_KEY is not configured');
    }

    const signature = req.headers['x-paystack-signature'];
    const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.from(JSON.stringify(req.body));
    const expectedSignature = crypto
      .createHmac('sha512', PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest('hex');

    if (signature !== expectedSignature) {
      return res.status(401).send('Invalid signature');
    }

    const event = JSON.parse(rawBody.toString());
    if (event.event !== 'charge.success') {
      return res.status(200).send('Ignored');
    }

    const reference = event.data?.reference;
    if (!reference) {
      return res.status(200).send('No reference');
    }

    const payment = await Payment.findOne({
      where: { providerReference: reference },
      include: [{ model: Order, as: 'order' }]
    });

    if (!payment || !payment.order) {
      return res.status(200).send('Payment not found');
    }

    await payment.update({
      status: 'paid',
      paidAt: new Date(event.data.paid_at || Date.now()),
      gatewayResponse: event.data.gateway_response || 'Payment confirmed by webhook'
    });

    await payment.order.update({
      paymentStatus: 'paid',
      status: payment.order.status === 'pending' ? 'confirmed' : payment.order.status
    });

    return res.status(200).send('OK');
  } catch (error) {
    console.error('Paystack webhook error:', error);
    return res.status(500).send('Server error');
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
        { model: OrderItem, as: 'items' },
        { model: Payment, as: 'payment' }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: { orders }
    });
  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: Restaurant, as: 'restaurant', attributes: ['id', 'name'] },
        { model: OrderItem, as: 'items' },
        { model: Payment, as: 'payment' }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (order.userId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: { order }
    });
  } catch (error) {
    console.error('Get order by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
