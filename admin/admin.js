const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:5000/api`;
const CURRENCY = 'KES';
const USE_DEV_LOGIN = localStorage.getItem('adminToken') === 'dev-admin-token';

const PREVIEW_DATA = {
    dashboard: {
        success: true,
        data: {
            stats: {
                totalRestaurants: 24,
                totalEvents: 12,
                totalDeals: 18,
                totalUsers: 156,
                totalReviews: 89,
                totalReservations: 45,
                totalOrders: 73,
                todayEvents: 2
            },
            financial: {
                totalRevenue: 428650,
                paidRevenue: 389420,
                pendingRevenue: 39230,
                paidOrders: 61,
                totalReservedGuests: 118,
                topPerformingRestaurants: [
                    { restaurantName: 'Pizza Palace', totalRevenue: 121400, paidOrders: 18, reservationCount: 11, reservedGuests: 26 },
                    { restaurantName: 'Burger Hub', totalRevenue: 98450, paidOrders: 14, reservationCount: 8, reservedGuests: 19 },
                    { restaurantName: 'Sushi World', totalRevenue: 87300, paidOrders: 12, reservationCount: 7, reservedGuests: 16 },
                    { restaurantName: 'Spice Garden', totalRevenue: 69300, paidOrders: 10, reservationCount: 6, reservedGuests: 14 },
                    { restaurantName: 'Cafe Delight', totalRevenue: 52100, paidOrders: 7, reservationCount: 5, reservedGuests: 12 }
                ]
            },
            recentRestaurants: [
                { name: 'Pizza Palace', category: 'Italian', city: 'Nairobi', isActive: true },
                { name: 'Burger Hub', category: 'Fast Food', city: 'Mombasa', isActive: true },
                { name: 'Sushi World', category: 'Japanese', city: 'Nairobi', isActive: false },
                { name: 'Spice Garden', category: 'Indian', city: 'Kisumu', isActive: true }
            ],
            recentEvents: [
                { title: 'Food Festival', date: '2026-05-15', location: 'Nairobi', isActive: true },
                { title: 'Wine Tasting', date: '2026-05-20', location: 'Mombasa', isActive: true },
                { title: 'Cooking Class', date: '2026-05-25', location: 'Nairobi', isActive: false }
            ]
        }
    },
    restaurants: {
        success: true,
        data: {
            restaurants: [
                { id: '1', name: 'Pizza Palace', category: 'Italian', city: 'Nairobi', neighborhood: 'Westlands', priceRange: '$$', description: 'Best pizza in town', phone: '+254700000001', isActive: true },
                { id: '2', name: 'Burger Hub', category: 'Fast Food', city: 'Mombasa', neighborhood: 'Nyali', priceRange: '$', description: 'Delicious burgers', phone: '+254700000002', isActive: true }
            ],
            pagination: { total: 2, page: 1, limit: 20, totalPages: 1 }
        }
    },
    events: {
        success: true,
        data: {
            events: [
                { id: '1', title: 'Food Festival', date: '2026-05-15', time: '18:00', location: 'Nairobi', description: 'Annual food festival', price: '2000', restaurant: { name: 'Pizza Palace' }, isActive: true },
                { id: '2', title: 'Wine Tasting', date: '2026-05-20', time: '19:00', location: 'Mombasa', description: 'Wine tasting event', price: '3000', restaurant: null, isActive: true }
            ],
            pagination: { total: 2, page: 1, limit: 20, totalPages: 1 }
        }
    },
    deals: {
        success: true,
        data: {
            deals: [
                { id: '1', title: 'Happy Hour', restaurant: { name: 'Pizza Palace' }, discount: '20% off', validFrom: '2026-05-01', validUntil: '2026-05-31', isActive: true }
            ],
            pagination: { total: 1, page: 1, limit: 20, totalPages: 1 }
        }
    },
    users: {
        success: true,
        data: {
            users: [
                { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: '2026-01-15' },
                { id: '2', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: '2026-01-01' }
            ],
            pagination: { total: 2, page: 1, limit: 20, totalPages: 1 }
        }
    },
    reviews: {
        success: true,
        data: {
            reviews: [
                { id: '1', user: { name: 'John Doe' }, restaurant: { name: 'Pizza Palace' }, rating: 5, comment: 'Amazing food and great service!', createdAt: '2026-05-01' }
            ],
            pagination: { total: 1, page: 1, limit: 20, totalPages: 1 }
        }
    },
    reservations: {
        success: true,
        data: {
            reservations: [
                { id: '1', user: { name: 'John Doe' }, restaurant: { name: 'Pizza Palace' }, date: '2026-05-10', time: '19:00', partySize: 4, status: 'confirmed' }
            ],
            pagination: { total: 1, page: 1, limit: 20, totalPages: 1 }
        }
    },
    menuItems: {
        success: true,
        data: {
            menuItems: [
                { id: '1', name: 'Margherita Pizza', restaurant: { name: 'Pizza Palace' }, price: 1200, category: 'Pizza', description: 'Classic tomato and mozzarella', isAvailable: true }
            ],
            pagination: { total: 1, page: 1, limit: 50, totalPages: 1 }
        }
    }
};

function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

function formatCurrency(value) {
    const amount = Number(value || 0);
    return `${CURRENCY} ${amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function formatDate(value) {
    if (!value) return '-';
    return new Date(value).toLocaleDateString();
}

function formatDateTime(date, time) {
    if (!date && !time) return '-';
    return [date ? formatDate(date) : '', time || ''].filter(Boolean).join(' ');
}

function formatCompactCurrency(value) {
    const amount = Number(value || 0);
    if (amount >= 1000000) {
        return `${CURRENCY} ${(amount / 1000000).toFixed(2)}M`;
    }
    if (amount >= 1000) {
        return `${CURRENCY} ${Math.round(amount / 1000)}k`;
    }
    return formatCurrency(amount);
}

function getInitials(value) {
    return (value || 'AD')
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || '')
        .join('') || 'AD';
}

function setText(id, value) {
    const element = document.getElementById(id);
    if (element) {
        element.textContent = value;
    }
}

async function apiCall(endpoint, options = {}) {
    if (USE_DEV_LOGIN) {
        const method = options.method || 'GET';
        if (method !== 'GET') {
            return { success: true, data: {} };
        }

        if (endpoint.includes('/dashboard')) return PREVIEW_DATA.dashboard;
        if (endpoint.includes('/restaurants') && !endpoint.includes('/menu')) return PREVIEW_DATA.restaurants;
        if (endpoint.includes('/events')) return PREVIEW_DATA.events;
        if (endpoint.includes('/deals')) return PREVIEW_DATA.deals;
        if (endpoint.includes('/users')) return PREVIEW_DATA.users;
        if (endpoint.includes('/reviews')) return PREVIEW_DATA.reviews;
        if (endpoint.includes('/reservations')) return PREVIEW_DATA.reservations;
        if (endpoint.includes('/menu-items')) return PREVIEW_DATA.menuItems;
        return { success: true, data: {} };
    }

    const token = checkAuth();
    if (!token) return null;

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers
        }
    });

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        window.location.href = 'login.html';
        return null;
    }

    return response.json();
}

async function loadDashboard() {
    const data = await apiCall('/admin/dashboard');
    if (!data || !data.success) return;

    const stats = data.data.stats || {};
    const financial = data.data.financial || {};
    const avgOrderValue = financial.paidOrders ? (Number(financial.paidRevenue || 0) / Number(financial.paidOrders || 1)) : 0;
    const reservationFill = stats.totalReservations ? Math.min(100, Math.round((Number(financial.totalReservedGuests || 0) / (Number(stats.totalReservations || 1) * 4)) * 100)) : 0;

    setText('stat-restaurants', stats.totalRestaurants ?? 0);
    setText('stat-events', stats.totalEvents ?? 0);
    setText('stat-deals', stats.totalDeals ?? 0);
    setText('stat-users', stats.totalUsers ?? 0);
    setText('stat-reviews', stats.totalReviews ?? 0);
    setText('stat-reservations', stats.totalReservations ?? 0);
    setText('stat-projected-revenue', formatCompactCurrency(financial.totalRevenue));
    setText('stat-upcoming-revenue', formatCurrency(financial.paidRevenue));
    setText('stat-ticketed-events', financial.paidOrders ?? 0);
    setText('stat-reserved-guests', financial.totalReservedGuests ?? 0);
    const pulseListings = document.getElementById('pulse-listings');
    const pulseEngagement = document.getElementById('pulse-engagement');
    const pulseGuests = document.getElementById('pulse-guests');
    if (pulseListings) pulseListings.textContent = (stats.totalRestaurants ?? 0) + (stats.totalEvents ?? 0) + (stats.totalDeals ?? 0);
    if (pulseEngagement) pulseEngagement.textContent = (stats.totalUsers ?? 0) + (stats.totalReviews ?? 0);
    if (pulseGuests) pulseGuests.textContent = `${stats.totalReservations ?? 0} / ${financial.totalReservedGuests ?? 0}`;
    const pendingRevenue = document.getElementById('quick-pending-revenue');
    const averageOrder = document.getElementById('quick-average-order');
    const reservationFillElement = document.getElementById('quick-reservation-fill');
    if (pendingRevenue) pendingRevenue.textContent = formatCompactCurrency(financial.pendingRevenue);
    if (averageOrder) averageOrder.textContent = formatCurrency(avgOrderValue);
    if (reservationFillElement) reservationFillElement.textContent = `${reservationFill}%`;

    const recentRestaurants = document.getElementById('recent-restaurants');
    recentRestaurants.innerHTML = (data.data.recentRestaurants || []).map((restaurant) => `
        <tr>
            <td>${restaurant.name}</td>
            <td>${restaurant.category || '-'}</td>
            <td>${restaurant.city || '-'}</td>
            <td><span class="badge ${restaurant.isActive ? 'badge-success' : 'badge-danger'}">${restaurant.isActive ? 'Active' : 'Inactive'}</span></td>
        </tr>
    `).join('') || '<tr><td colspan="4" class="loading">No restaurants found.</td></tr>';

    const financialPerformance = document.getElementById('financial-performance');
    financialPerformance.innerHTML = (financial.topPerformingRestaurants || []).map((restaurant) => `
        <tr>
            <td>${restaurant.restaurantName}</td>
            <td>${formatCurrency(restaurant.totalRevenue)}</td>
            <td>${restaurant.paidOrders}</td>
            <td>${restaurant.reservationCount}</td>
            <td>${restaurant.reservedGuests}</td>
        </tr>
    `).join('') || '<tr><td colspan="5" class="loading">No financial activity available yet.</td></tr>';

    const recentEvents = document.getElementById('recent-events');
    recentEvents.innerHTML = (data.data.recentEvents || []).map((event) => `
        <tr>
            <td>${event.title || event.name}</td>
            <td>${formatDate(event.date)}</td>
            <td>${event.location || '-'}</td>
            <td><span class="badge ${event.isActive ? 'badge-success' : 'badge-danger'}">${event.isActive ? 'Active' : 'Inactive'}</span></td>
        </tr>
    `).join('') || '<tr><td colspan="4" class="loading">No events found.</td></tr>';
}

async function loadRestaurants(page = 1) {
    const data = await apiCall(`/admin/restaurants?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('restaurants-tbody');
    tbody.innerHTML = data.data.restaurants.map((restaurant) => `
        <tr>
            <td>${restaurant.name}</td>
            <td>${restaurant.category || '-'}</td>
            <td>${restaurant.city || '-'}</td>
            <td>${restaurant.priceRange || '-'}</td>
            <td><span class="badge ${restaurant.isActive ? 'badge-success' : 'badge-danger'}">${restaurant.isActive ? 'Active' : 'Inactive'}</span></td>
            <td class="actions">
                <button class="btn-edit" onclick="editRestaurant('${restaurant.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteRestaurant('${restaurant.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    updatePagination('restaurants-pagination', data.data.pagination, loadRestaurants);
}

function openRestaurantModal(restaurant = null) {
    document.getElementById('modal-title').textContent = restaurant ? 'Edit Restaurant' : 'Add Restaurant';
    document.getElementById('form-content').innerHTML = `
        <input type="hidden" id="restaurant-id" value="${restaurant?.id || ''}">
        <div class="form-group">
            <label>Name</label>
            <input type="text" id="rest-name" value="${restaurant?.name || ''}" required>
        </div>
        <div class="form-group">
            <label>Category</label>
            <input type="text" id="rest-category" value="${restaurant?.category || ''}" required>
        </div>
        <div class="form-group">
            <label>City</label>
            <input type="text" id="rest-city" value="${restaurant?.city || ''}">
        </div>
        <div class="form-group">
            <label>Neighborhood</label>
            <input type="text" id="rest-neighborhood" value="${restaurant?.neighborhood || ''}">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="rest-description" rows="3">${restaurant?.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Phone</label>
            <input type="text" id="rest-phone" value="${restaurant?.phone || ''}">
        </div>
        <div class="form-group">
            <label>Price Range</label>
            <select id="rest-price">
                <option value="">Select</option>
                <option value="$" ${restaurant?.priceRange === '$' ? 'selected' : ''}>$</option>
                <option value="$$" ${restaurant?.priceRange === '$$' ? 'selected' : ''}>$$</option>
                <option value="$$$" ${restaurant?.priceRange === '$$$' ? 'selected' : ''}>$$$</option>
                <option value="$$$$" ${restaurant?.priceRange === '$$$$' ? 'selected' : ''}>$$$$</option>
            </select>
        </div>
        <div class="form-group">
            <label>Active</label>
            <select id="rest-active">
                <option value="true" ${restaurant?.isActive !== false ? 'selected' : ''}>Yes</option>
                <option value="false" ${restaurant?.isActive === false ? 'selected' : ''}>No</option>
            </select>
        </div>
    `;
    document.getElementById('modal').classList.add('active');
}

async function saveRestaurant() {
    const id = document.getElementById('restaurant-id').value;
    const payload = {
        name: document.getElementById('rest-name').value,
        category: document.getElementById('rest-category').value,
        city: document.getElementById('rest-city').value || null,
        neighborhood: document.getElementById('rest-neighborhood').value || null,
        description: document.getElementById('rest-description').value || null,
        phone: document.getElementById('rest-phone').value || null,
        priceRange: document.getElementById('rest-price').value || null,
        isActive: document.getElementById('rest-active').value === 'true'
    };

    const result = await apiCall(id ? `/admin/restaurants/${id}` : '/admin/restaurants', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
    });

    if (result?.success) {
        closeModal();
        loadRestaurants();
    }
}

async function editRestaurant(id) {
    const data = await apiCall('/admin/restaurants?page=1&limit=100');
    const restaurant = data?.data?.restaurants?.find((item) => item.id === id);
    if (restaurant) openRestaurantModal(restaurant);
}

async function deleteRestaurant(id) {
    if (!confirm('Are you sure you want to delete this restaurant?')) return;
    const result = await apiCall(`/admin/restaurants/${id}`, { method: 'DELETE' });
    if (result?.success) loadRestaurants();
}

async function loadEvents(page = 1) {
    const data = await apiCall(`/admin/events?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('events-tbody');
    tbody.innerHTML = data.data.events.map((event) => `
        <tr>
            <td>${event.title || event.name}</td>
            <td>${formatDate(event.date)}</td>
            <td>${event.location || '-'}</td>
            <td>${event.restaurant?.name || 'N/A'}</td>
            <td><span class="badge ${event.isActive ? 'badge-success' : 'badge-danger'}">${event.isActive ? 'Active' : 'Inactive'}</span></td>
            <td class="actions">
                <button class="btn-edit" onclick="editEvent('${event.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteEvent('${event.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    updatePagination('events-pagination', data.data.pagination, loadEvents);
}

function openEventModal(event = null) {
    document.getElementById('modal-title').textContent = event ? 'Edit Event' : 'Add Event';
    document.getElementById('form-content').innerHTML = `
        <input type="hidden" id="event-id" value="${event?.id || ''}">
        <div class="form-group">
            <label>Title</label>
            <input type="text" id="event-title" value="${event?.title || event?.name || ''}" required>
        </div>
        <div class="form-group">
            <label>Date</label>
            <input type="date" id="event-date" value="${event?.date || ''}" required>
        </div>
        <div class="form-group">
            <label>Time</label>
            <input type="time" id="event-time" value="${event?.time || ''}" required>
        </div>
        <div class="form-group">
            <label>Location</label>
            <input type="text" id="event-location" value="${event?.location || ''}" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="event-description" rows="3">${event?.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Price (${CURRENCY})</label>
            <input type="number" step="0.01" id="event-price" value="${event?.price || ''}">
        </div>
        <div class="form-group">
            <label>Restaurant ID</label>
            <input type="text" id="event-restaurantId" value="${event?.restaurantId || ''}">
        </div>
        <div class="form-group">
            <label>Active</label>
            <select id="event-active">
                <option value="true" ${event?.isActive !== false ? 'selected' : ''}>Yes</option>
                <option value="false" ${event?.isActive === false ? 'selected' : ''}>No</option>
            </select>
        </div>
    `;
    document.getElementById('modal').classList.add('active');
}

async function saveEvent() {
    const id = document.getElementById('event-id').value;
    const payload = {
        title: document.getElementById('event-title').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        location: document.getElementById('event-location').value,
        description: document.getElementById('event-description').value,
        price: document.getElementById('event-price').value || null,
        restaurantId: document.getElementById('event-restaurantId').value || null,
        isActive: document.getElementById('event-active').value === 'true'
    };

    const result = await apiCall(id ? `/admin/events/${id}` : '/admin/events', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
    });

    if (result?.success) {
        closeModal();
        loadEvents();
    }
}

async function editEvent(id) {
    const data = await apiCall('/admin/events?page=1&limit=100');
    const event = data?.data?.events?.find((item) => item.id === id);
    if (event) openEventModal(event);
}

async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const result = await apiCall(`/admin/events/${id}`, { method: 'DELETE' });
    if (result?.success) loadEvents();
}

async function loadDeals(page = 1) {
    const data = await apiCall(`/admin/deals?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('deals-tbody');
    tbody.innerHTML = data.data.deals.map((deal) => `
        <tr>
            <td>${deal.title || deal.name}</td>
            <td>${deal.restaurant?.name || 'N/A'}</td>
            <td>${deal.discount || '-'}</td>
            <td>${formatDate(deal.validFrom)} - ${formatDate(deal.validUntil)}</td>
            <td><span class="badge ${deal.isActive ? 'badge-success' : 'badge-danger'}">${deal.isActive ? 'Active' : 'Inactive'}</span></td>
            <td class="actions">
                <button class="btn-edit" onclick="editDeal('${deal.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteDeal('${deal.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    updatePagination('deals-pagination', data.data.pagination, loadDeals);
}

function openDealModal(deal = null) {
    document.getElementById('modal-title').textContent = deal ? 'Edit Deal' : 'Add Deal';
    document.getElementById('form-content').innerHTML = `
        <input type="hidden" id="deal-id" value="${deal?.id || ''}">
        <div class="form-group">
            <label>Title</label>
            <input type="text" id="deal-title" value="${deal?.title || deal?.name || ''}" required>
        </div>
        <div class="form-group">
            <label>Restaurant ID</label>
            <input type="text" id="deal-restaurantId" value="${deal?.restaurantId || ''}" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="deal-description" rows="3">${deal?.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Discount Label</label>
            <input type="text" id="deal-discount" value="${deal?.discount || ''}" required>
        </div>
        <div class="form-group">
            <label>Valid From</label>
            <input type="date" id="deal-from" value="${deal?.validFrom || ''}">
        </div>
        <div class="form-group">
            <label>Valid Until</label>
            <input type="date" id="deal-until" value="${deal?.validUntil || ''}">
        </div>
        <div class="form-group">
            <label>Active</label>
            <select id="deal-active">
                <option value="true" ${deal?.isActive !== false ? 'selected' : ''}>Yes</option>
                <option value="false" ${deal?.isActive === false ? 'selected' : ''}>No</option>
            </select>
        </div>
    `;
    document.getElementById('modal').classList.add('active');
}

async function saveDeal() {
    const id = document.getElementById('deal-id').value;
    const payload = {
        title: document.getElementById('deal-title').value,
        restaurantId: document.getElementById('deal-restaurantId').value,
        description: document.getElementById('deal-description').value || null,
        discount: document.getElementById('deal-discount').value,
        validFrom: document.getElementById('deal-from').value || null,
        validUntil: document.getElementById('deal-until').value || null,
        isActive: document.getElementById('deal-active').value === 'true'
    };

    const result = await apiCall(id ? `/admin/deals/${id}` : '/admin/deals', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
    });

    if (result?.success) {
        closeModal();
        loadDeals();
    }
}

async function editDeal(id) {
    const data = await apiCall('/admin/deals?page=1&limit=100');
    const deal = data?.data?.deals?.find((item) => item.id === id);
    if (deal) openDealModal(deal);
}

async function deleteDeal(id) {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    const result = await apiCall(`/admin/deals/${id}`, { method: 'DELETE' });
    if (result?.success) loadDeals();
}

async function loadUsers(page = 1) {
    const data = await apiCall(`/admin/users?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = data.data.users.map((user) => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td><span class="badge badge-info">${user.role}</span></td>
            <td>${formatDate(user.createdAt)}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editUser('${user.id}', '${user.role}')">Edit Role</button>
                ${user.role !== 'admin' ? `<button class="btn-delete" onclick="deleteUser('${user.id}')">Delete</button>` : ''}
            </td>
        </tr>
    `).join('');

    updatePagination('users-pagination', data.data.pagination, loadUsers);
}

async function editUser(id, currentRole) {
    const newRole = prompt('Enter new role (user, restaurant_owner, admin):', currentRole);
    if (newRole && ['user', 'restaurant_owner', 'admin'].includes(newRole)) {
        const result = await apiCall(`/admin/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ role: newRole })
        });
        if (result?.success) loadUsers();
    }
}

async function deleteUser(id) {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const result = await apiCall(`/admin/users/${id}`, { method: 'DELETE' });
    if (result?.success) loadUsers();
}

async function loadReviews(page = 1) {
    const data = await apiCall(`/admin/reviews?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('reviews-tbody');
    tbody.innerHTML = data.data.reviews.map((review) => `
        <tr>
            <td>${review.user?.name || 'Unknown'}</td>
            <td>${review.restaurant?.name || 'N/A'}</td>
            <td>⭐ ${review.rating}</td>
            <td>${review.comment?.substring(0, 50) || ''}${review.comment?.length > 50 ? '...' : ''}</td>
            <td>${formatDate(review.createdAt)}</td>
            <td class="actions">
                <button class="btn-delete" onclick="deleteReview('${review.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    updatePagination('reviews-pagination', data.data.pagination, loadReviews);
}

async function deleteReview(id) {
    if (!confirm('Are you sure you want to delete this review?')) return;
    const result = await apiCall(`/admin/reviews/${id}`, { method: 'DELETE' });
    if (result?.success) loadReviews();
}

async function loadReservations(page = 1) {
    const data = await apiCall(`/admin/reservations?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('reservations-tbody');
    tbody.innerHTML = data.data.reservations.map((reservation) => `
        <tr>
            <td>${reservation.user?.name || 'Unknown'}</td>
            <td>${reservation.restaurant?.name || 'N/A'}</td>
            <td>${formatDateTime(reservation.date, reservation.time)}</td>
            <td>${reservation.partySize || 0} guests</td>
            <td><span class="badge ${reservation.status === 'confirmed' ? 'badge-success' : reservation.status === 'pending' ? 'badge-warning' : 'badge-danger'}">${reservation.status}</span></td>
        </tr>
    `).join('');

    updatePagination('reservations-pagination', data.data.pagination, loadReservations);
}

async function loadMenuItems(page = 1) {
    const data = await apiCall(`/admin/menu-items?page=${page}&limit=50`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('menu-tbody');
    tbody.innerHTML = data.data.menuItems.map((item) => `
        <tr>
            <td>${item.name}</td>
            <td>${item.restaurant?.name || 'N/A'}</td>
            <td>${formatCurrency(item.price)}</td>
            <td>${item.category || '-'}</td>
            <td><span class="badge ${item.isAvailable ? 'badge-success' : 'badge-danger'}">${item.isAvailable ? 'Active' : 'Inactive'}</span></td>
            <td class="actions">
                <button class="btn-edit" onclick="editMenuItem('${item.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteMenuItem('${item.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    updatePagination('menu-pagination', data.data.pagination, loadMenuItems);
}

function openMenuItemModal(item = null) {
    document.getElementById('modal-title').textContent = item ? 'Edit Menu Item' : 'Add Menu Item';
    document.getElementById('form-content').innerHTML = `
        <input type="hidden" id="menu-id" value="${item?.id || ''}">
        <div class="form-group">
            <label>Name</label>
            <input type="text" id="menu-name" value="${item?.name || ''}" required>
        </div>
        <div class="form-group">
            <label>Restaurant ID</label>
            <input type="text" id="menu-restaurantId" value="${item?.restaurantId || ''}" required>
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="menu-description" rows="3">${item?.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Price (${CURRENCY})</label>
            <input type="number" step="0.01" id="menu-price" value="${item?.price || ''}" required>
        </div>
        <div class="form-group">
            <label>Category</label>
            <input type="text" id="menu-category" value="${item?.category || ''}">
        </div>
        <div class="form-group">
            <label>Active</label>
            <select id="menu-active">
                <option value="true" ${item?.isAvailable !== false ? 'selected' : ''}>Yes</option>
                <option value="false" ${item?.isAvailable === false ? 'selected' : ''}>No</option>
            </select>
        </div>
    `;
    document.getElementById('modal').classList.add('active');
}

async function saveMenuItem() {
    const id = document.getElementById('menu-id').value;
    const payload = {
        name: document.getElementById('menu-name').value,
        restaurantId: document.getElementById('menu-restaurantId').value,
        description: document.getElementById('menu-description').value || null,
        price: document.getElementById('menu-price').value,
        category: document.getElementById('menu-category').value,
        isAvailable: document.getElementById('menu-active').value === 'true'
    };

    const result = await apiCall(id ? `/admin/menu-items/${id}` : '/admin/menu-items', {
        method: id ? 'PUT' : 'POST',
        body: JSON.stringify(payload)
    });

    if (result?.success) {
        closeModal();
        loadMenuItems();
    }
}

async function editMenuItem(id) {
    const data = await apiCall('/admin/menu-items?page=1&limit=100');
    const item = data?.data?.menuItems?.find((menuItem) => menuItem.id === id);
    if (item) openMenuItemModal(item);
}

async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    const result = await apiCall(`/admin/menu-items/${id}`, { method: 'DELETE' });
    if (result?.success) loadMenuItems();
}

function updatePagination(containerId, pagination, loadFn) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = '';

    const totalPages = pagination.totalPages || pagination.pages || 1;

    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = pagination.page <= 1;
    if (!prevBtn.disabled) {
        prevBtn.addEventListener('click', () => loadFn(pagination.page - 1));
    }
    container.appendChild(prevBtn);

    const currBtn = document.createElement('button');
    currBtn.textContent = pagination.page;
    currBtn.className = 'active';
    currBtn.disabled = true;
    container.appendChild(currBtn);

    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = pagination.page >= totalPages;
    if (!nextBtn.disabled) {
        nextBtn.addEventListener('click', () => loadFn(pagination.page + 1));
    }
    container.appendChild(nextBtn);
}

function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

function setActiveNav(page) {
    document.querySelectorAll('.sidebar-nav a').forEach((link) => {
        link.classList.toggle('active', link.dataset.page === page);
    });

    const activeLink = document.querySelector(`.sidebar-nav a[data-page="${page}"]`);
    const title = activeLink?.dataset.title || page.charAt(0).toUpperCase() + page.slice(1);
    const subtitle = activeLink?.dataset.subtitle || '';
    const pageTitle = document.getElementById('page-title');
    const pageSubtitle = document.getElementById('page-subtitle');

    if (pageTitle) pageTitle.textContent = title;
    if (pageSubtitle) pageSubtitle.textContent = subtitle;
}

document.addEventListener('DOMContentLoaded', () => {
    localStorage.removeItem('adminPreviewMode');
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const userInfo = document.getElementById('user-info');
    const userAvatar = document.getElementById('user-avatar');
    const liveStatus = document.getElementById('live-status');
    const dashboardGreeting = document.getElementById('dashboard-greeting');
    const dashboardDate = document.getElementById('dashboard-date');
    if (userInfo) {
        userInfo.textContent = user.email || 'Admin';
    }
    if (userAvatar) {
        userAvatar.textContent = getInitials(user.name || user.email || 'Admin User');
    }
    if (liveStatus) {
        liveStatus.textContent = 'Live';
        liveStatus.classList.remove('preview');
    }
    if (dashboardGreeting) {
        const firstName = (user.name || 'Admin').split(' ')[0];
        dashboardGreeting.textContent = `Good afternoon, ${firstName} 👋`;
    }
    if (dashboardDate) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString('en-GB', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        dashboardDate.textContent = `${formattedDate} · Nairobi, KE`;
    }
    setActiveNav('dashboard');
});
