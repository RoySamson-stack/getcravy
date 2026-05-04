// HARDCODED DATA FOR DESIGN PREVIEW - No backend needed
const USE_HARDCODED_DATA = true;

// Sample data
const HARDCODED_DATA = {
    dashboard: {
        success: true,
        data: {
            stats: {
                totalRestaurants: 24,
                totalEvents: 12,
                totalDeals: 18,
                totalUsers: 156,
                totalReviews: 89,
                totalReservations: 45
            },
            recentRestaurants: [
                { name: 'Pizza Palace', category: 'Italian', city: 'Nairobi', isActive: true },
                { name: 'Burger Hub', category: 'Fast Food', city: 'Mombasa', isActive: true },
                { name: 'Sushi World', category: 'Japanese', city: 'Nairobi', isActive: false },
                { name: 'Spice Garden', category: 'Indian', city: 'Kisumu', isActive: true }
            ],
            recentEvents: [
                { name: 'Food Festival', date: '2026-05-15', location: 'Nairobi', isActive: true },
                { name: 'Wine Tasting', date: '2026-05-20', location: 'Mombasa', isActive: true },
                { name: 'Cooking Class', date: '2026-05-25', location: 'Nairobi', isActive: false }
            ]
        }
    },
    restaurants: {
        success: true,
        data: {
            restaurants: [
                { id: '1', name: 'Pizza Palace', category: 'Italian', city: 'Nairobi', neighborhood: 'Westlands', priceRange: '$$', description: 'Best pizza in town', phone: '+254700000001', latitude: -1.2921, longitude: 36.8219, isActive: true },
                { id: '2', name: 'Burger Hub', category: 'Fast Food', city: 'Mombasa', neighborhood: 'Nyali', priceRange: '$', description: 'Delicious burgers', phone: '+254700000002', latitude: -4.0435, longitude: 39.6682, isActive: true },
                { id: '3', name: 'Sushi World', category: 'Japanese', city: 'Nairobi', neighborhood: 'Kilimani', priceRange: '$$$', description: 'Authentic sushi', phone: '+254700000003', latitude: -1.2983, longitude: 36.8167, isActive: false },
                { id: '4', name: 'Spice Garden', category: 'Indian', city: 'Kisumu', neighborhood: 'Milimani', priceRange: '$$', description: 'Traditional Indian cuisine', phone: '+254700000004', latitude: -0.0917, longitude: 34.7680, isActive: true },
                { id: '5', name: 'Café Delight', category: 'Café', city: 'Nairobi', neighborhood: 'CBD', priceRange: '$', description: 'Coffee and pastries', phone: '+254700000005', latitude: -1.2833, longitude: 36.8167, isActive: true }
            ],
            pagination: { page: 1, totalPages: 1, totalItems: 5, limit: 20 }
        }
    },
    events: {
        success: true,
        data: {
            events: [
                { id: '1', name: 'Food Festival', date: '2026-05-15', time: '18:00', location: 'Nairobi', description: 'Annual food festival', price: 'KES 2000', restaurant: { name: 'Pizza Palace' }, isActive: true },
                { id: '2', name: 'Wine Tasting', date: '2026-05-20', time: '19:00', location: 'Mombasa', description: 'Wine tasting event', price: 'KES 3000', restaurant: null, isActive: true },
                { id: '3', name: 'Cooking Class', date: '2026-05-25', time: '10:00', location: 'Nairobi', description: 'Learn to cook', price: 'KES 1500', restaurant: { name: 'Sushi World' }, isActive: false }
            ],
            pagination: { page: 1, totalPages: 1, totalItems: 3, limit: 20 }
        }
    },
    deals: {
        success: true,
        data: {
            deals: [
                { id: '1', name: 'Happy Hour', restaurant: { name: 'Pizza Palace' }, discountPercent: 20, validFrom: '2026-05-01', validUntil: '2026-05-31', isActive: true },
                { id: '2', name: 'Lunch Special', restaurant: { name: 'Burger Hub' }, discountPercent: 15, validFrom: '2026-05-01', validUntil: '2026-05-15', isActive: true },
                { id: '3', name: 'Date Night', restaurant: { name: 'Sushi World' }, discountPercent: 25, validFrom: '2026-05-10', validUntil: '2026-05-20', isActive: false }
            ],
            pagination: { page: 1, totalPages: 1, totalItems: 3, limit: 20 }
        }
    },
    users: {
        success: true,
        data: {
            users: [
                { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user', createdAt: '2026-01-15' },
                { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2026-02-20' },
                { id: '3', name: 'Restaurant Owner', email: 'owner@example.com', role: 'restaurant_owner', createdAt: '2026-03-10' },
                { id: '4', name: 'Admin User', email: 'admin@example.com', role: 'admin', createdAt: '2026-01-01' }
            ],
            pagination: { page: 1, totalPages: 1, totalItems: 4, limit: 20 }
        }
    },
    reviews: {
        success: true,
        data: {
            reviews: [
                { id: '1', user: { name: 'John Doe' }, restaurant: { name: 'Pizza Palace' }, rating: 5, comment: 'Amazing food and great service!', createdAt: '2026-05-01' },
                { id: '2', user: { name: 'Jane Smith' }, restaurant: { name: 'Burger Hub' }, rating: 4, comment: 'Good burgers, quick service.', createdAt: '2026-05-02' },
                { id: '3', user: { name: 'Bob Wilson' }, restaurant: { name: 'Sushi World' }, rating: 3, comment: 'Average experience, expected more.', createdAt: '2026-05-03' }
            ],
            pagination: { page: 1, totalPages: 1, totalItems: 3, limit: 20 }
        }
    },
    reservations: {
        success: true,
        data: {
            reservations: [
                { id: '1', user: { name: 'John Doe' }, restaurant: { name: 'Pizza Palace' }, reservationDate: '2026-05-10', reservationTime: '19:00', guests: 4, status: 'confirmed' },
                { id: '2', user: { name: 'Jane Smith' }, restaurant: { name: 'Burger Hub' }, reservationDate: '2026-05-11', reservationTime: '20:00', guests: 2, status: 'pending' },
                { id: '3', user: { name: 'Bob Wilson' }, restaurant: { name: 'Sushi World' }, reservationDate: '2026-05-12', reservationTime: '18:30', guests: 3, status: 'cancelled' }
            ],
            pagination: { page: 1, totalPages: 1, totalItems: 3, limit: 20 }
        }
    },
    menuItems: {
        success: true,
        data: {
            menuItems: [
                { id: '1', name: 'Margherita Pizza', restaurant: { name: 'Pizza Palace' }, price: 1200, category: 'Pizza', description: 'Classic tomato and mozzarella', isActive: true },
                { id: '2', name: 'Classic Burger', restaurant: { name: 'Burger Hub' }, price: 800, category: 'Burgers', description: 'Beef burger with fries', isActive: true },
                { id: '3', name: 'Salmon Sushi', restaurant: { name: 'Sushi World' }, price: 1500, category: 'Sushi', description: 'Fresh salmon sushi roll', isActive: true },
                { id: '4', name: 'Chicken Curry', restaurant: { name: 'Spice Garden' }, price: 1000, category: 'Main Course', description: 'Spicy chicken curry', isActive: true }
            ],
            pagination: { page: 1, totalPages: 1, totalItems: 4, limit: 50 }
        }
    }
};

// Auth check - simplified for design preview
function checkAuth() {
    if (USE_HARDCODED_DATA) return 'hardcoded-token';
    const token = localStorage.getItem('adminToken');
    if (!token && !window.location.pathname.includes('login.html')) {
        window.location.href = 'login.html';
        return null;
    }
    return token;
}

async function apiCall(endpoint, options = {}) {
    if (USE_HARDCODED_DATA) {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const method = options.method || 'GET';
        
        // For POST, PUT, DELETE - return success for design preview
        if (method !== 'GET') {
            alert('Design Preview Mode: Changes are not saved (no backend connected)');
            return { success: true, data: {} };
        }
        
        // Map endpoint to hardcoded data for GET requests
        if (endpoint.includes('/dashboard')) return HARDCODED_DATA.dashboard;
        if (endpoint.includes('/restaurants') && !endpoint.includes('/menu')) return HARDCODED_DATA.restaurants;
        if (endpoint.includes('/events')) return HARDCODED_DATA.events;
        if (endpoint.includes('/deals')) return HARDCODED_DATA.deals;
        if (endpoint.includes('/users')) return HARDCODED_DATA.users;
        if (endpoint.includes('/reviews')) return HARDCODED_DATA.reviews;
        if (endpoint.includes('/reservations')) return HARDCODED_DATA.reservations;
        if (endpoint.includes('/menu-items')) return HARDCODED_DATA.menuItems;
        
        return { success: true, data: {} };
    }

    const token = checkAuth();
    if (!token) return;

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

// Dashboard
async function loadDashboard() {
    const data = await apiCall('/admin/dashboard');
    if (!data || !data.success) return;

    const stats = data.data.stats;
    document.getElementById('stat-restaurants').textContent = stats.totalRestaurants;
    document.getElementById('stat-events').textContent = stats.totalEvents;
    document.getElementById('stat-deals').textContent = stats.totalDeals;
    document.getElementById('stat-users').textContent = stats.totalUsers;
    document.getElementById('stat-reviews').textContent = stats.totalReviews;
    document.getElementById('stat-reservations').textContent = stats.totalReservations;

    // Recent restaurants
    const recentRest = document.getElementById('recent-restaurants');
    recentRest.innerHTML = data.data.recentRestaurants.map(r => `
        <tr>
            <td>${r.name}</td>
            <td>${r.category}</td>
            <td>${r.city}</td>
            <td><span class="badge ${r.isActive ? 'badge-success' : 'badge-danger'}">${r.isActive ? 'Active' : 'Inactive'}</span></td>
        </tr>
    `).join('');

    // Recent events
    const recentEv = document.getElementById('recent-events');
    recentEv.innerHTML = data.data.recentEvents.map(e => `
        <tr>
            <td>${e.name}</td>
            <td>${e.date}</td>
            <td>${e.location}</td>
            <td><span class="badge ${e.isActive ? 'badge-success' : 'badge-danger'}">${e.isActive ? 'Active' : 'Inactive'}</span></td>
        </tr>
    `).join('');
}

// Restaurants
async function loadRestaurants(page = 1) {
    const data = await apiCall(`/admin/restaurants?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('restaurants-tbody');
    tbody.innerHTML = data.data.restaurants.map(r => `
        <tr>
            <td>${r.name}</td>
            <td>${r.category}</td>
            <td>${r.city}</td>
            <td>${r.priceRange}</td>
            <td><span class="badge ${r.isActive ? 'badge-success' : 'badge-danger'}">${r.isActive ? 'Active' : 'Inactive'}</span></td>
            <td class="actions">
                <button class="btn-edit" onclick="editRestaurant('${r.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteRestaurant('${r.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    updatePagination('restaurants-pagination', data.data.pagination, loadRestaurants);
}

function openRestaurantModal(restaurant = null) {
    const modal = document.getElementById('modal');
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
            <input type="text" id="rest-city" value="${restaurant?.city || ''}" required>
        </div>
        <div class="form-group">
            <label>Neighborhood</label>
            <input type="text" id="rest-neighborhood" value="${restaurant?.neighborhood || ''}">
        </div>
        <div class="form-group">
            <label>Price Range</label>
            <select id="rest-price">
                <option value="$" ${restaurant?.priceRange === '$' ? 'selected' : ''}>$</option>
                <option value="$$" ${restaurant?.priceRange === '$$' ? 'selected' : ''}>$$</option>
                <option value="$$$" ${restaurant?.priceRange === '$$$' ? 'selected' : ''}>$$$</option>
                <option value="$$$$" ${restaurant?.priceRange === '$$$$' ? 'selected' : ''}>$$$$</option>
            </select>
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
            <label>Latitude</label>
            <input type="number" step="any" id="rest-lat" value="${restaurant?.latitude || ''}">
        </div>
        <div class="form-group">
            <label>Longitude</label>
            <input type="number" step="any" id="rest-lng" value="${restaurant?.longitude || ''}">
        </div>
        <div class="form-group">
            <label>Active</label>
            <select id="rest-active">
                <option value="true" ${restaurant?.isActive !== false ? 'selected' : ''}>Yes</option>
                <option value="false" ${restaurant?.isActive === false ? 'selected' : ''}>No</option>
            </select>
        </div>
    `;
    modal.classList.add('active');
}

async function saveRestaurant() {
    const id = document.getElementById('restaurant-id').value;
    const data = {
        name: document.getElementById('rest-name').value,
        category: document.getElementById('rest-category').value,
        city: document.getElementById('rest-city').value,
        neighborhood: document.getElementById('rest-neighborhood').value,
        priceRange: document.getElementById('rest-price').value,
        description: document.getElementById('rest-description').value,
        phone: document.getElementById('rest-phone').value,
        latitude: document.getElementById('rest-lat').value,
        longitude: document.getElementById('rest-lng').value,
        isActive: document.getElementById('rest-active').value === 'true'
    };

    const endpoint = id ? `/admin/restaurants/${id}` : '/admin/restaurants';
    const method = id ? 'PUT' : 'POST';
    const result = await apiCall(endpoint, { method, body: JSON.stringify(data) });

    if (result?.success) {
        closeModal();
        loadRestaurants();
    }
}

async function editRestaurant(id) {
    const data = await apiCall(`/admin/restaurants`);
    const restaurant = data.data.restaurants.find(r => r.id === id);
    if (restaurant) openRestaurantModal(restaurant);
}

async function deleteRestaurant(id) {
    if (!confirm('Are you sure you want to delete this restaurant?')) return;
    const result = await apiCall(`/admin/restaurants/${id}`, { method: 'DELETE' });
    if (result?.success) loadRestaurants();
}

// Events
async function loadEvents(page = 1) {
    const data = await apiCall(`/admin/events?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('events-tbody');
    tbody.innerHTML = data.data.events.map(e => `
        <tr>
            <td>${e.name}</td>
            <td>${e.date}</td>
            <td>${e.location}</td>
            <td>${e.restaurant?.name || 'N/A'}</td>
            <td><span class="badge ${e.isActive ? 'badge-success' : 'badge-danger'}">${e.isActive ? 'Active' : 'Inactive'}</span></td>
            <td class="actions">
                <button class="btn-edit" onclick="editEvent('${e.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteEvent('${e.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    updatePagination('events-pagination', data.data.pagination, loadEvents);
}

function openEventModal(event = null) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = event ? 'Edit Event' : 'Add Event';
    document.getElementById('form-content').innerHTML = `
        <input type="hidden" id="event-id" value="${event?.id || ''}">
        <div class="form-group">
            <label>Name</label>
            <input type="text" id="event-name" value="${event?.name || ''}" required>
        </div>
        <div class="form-group">
            <label>Date</label>
            <input type="date" id="event-date" value="${event?.date || ''}" required>
        </div>
        <div class="form-group">
            <label>Time</label>
            <input type="time" id="event-time" value="${event?.time || ''}">
        </div>
        <div class="form-group">
            <label>Location</label>
            <input type="text" id="event-location" value="${event?.location || ''}">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea id="event-description" rows="3">${event?.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Price</label>
            <input type="text" id="event-price" value="${event?.price || ''}">
        </div>
        <div class="form-group">
            <label>Restaurant ID (optional)</label>
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
    modal.classList.add('active');
}

async function saveEvent() {
    const id = document.getElementById('event-id').value;
    const data = {
        name: document.getElementById('event-name').value,
        date: document.getElementById('event-date').value,
        time: document.getElementById('event-time').value,
        location: document.getElementById('event-location').value,
        description: document.getElementById('event-description').value,
        price: document.getElementById('event-price').value,
        restaurantId: document.getElementById('event-restaurantId').value || null,
        isActive: document.getElementById('event-active').value === 'true'
    };

    const endpoint = id ? `/admin/events/${id}` : '/admin/events';
    const method = id ? 'PUT' : 'POST';
    const result = await apiCall(endpoint, { method, body: JSON.stringify(data) });

    if (result?.success) {
        closeModal();
        loadEvents();
    }
}

async function editEvent(id) {
    const data = await apiCall(`/admin/events`);
    const event = data.data.events.find(e => e.id === id);
    if (event) openEventModal(event);
}

async function deleteEvent(id) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    const result = await apiCall(`/admin/events/${id}`, { method: 'DELETE' });
    if (result?.success) loadEvents();
}

// Deals
async function loadDeals(page = 1) {
    const data = await apiCall(`/admin/deals?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('deals-tbody');
    tbody.innerHTML = data.data.deals.map(d => `
        <tr>
            <td>${d.name}</td>
            <td>${d.restaurant?.name || 'N/A'}</td>
            <td>${d.discountPercent}%</td>
            <td>${d.validFrom} - ${d.validUntil}</td>
            <td><span class="badge ${d.isActive ? 'badge-success' : 'badge-danger'}">${d.isActive ? 'Active' : 'Inactive'}</span></td>
            <td class="actions">
                <button class="btn-edit" onclick="editDeal('${d.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteDeal('${d.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    updatePagination('deals-pagination', data.data.pagination, loadDeals);
}

function openDealModal(deal = null) {
    const modal = document.getElementById('modal');
    document.getElementById('modal-title').textContent = deal ? 'Edit Deal' : 'Add Deal';
    document.getElementById('form-content').innerHTML = `
        <input type="hidden" id="deal-id" value="${deal?.id || ''}">
        <div class="form-group">
            <label>Name</label>
            <input type="text" id="deal-name" value="${deal?.name || ''}" required>
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
            <label>Discount %</label>
            <input type="number" id="deal-discount" value="${deal?.discountPercent || ''}" required>
        </div>
        <div class="form-group">
            <label>Valid From</label>
            <input type="date" id="deal-from" value="${deal?.validFrom || ''}" required>
        </div>
        <div class="form-group">
            <label>Valid Until</label>
            <input type="date" id="deal-until" value="${deal?.validUntil || ''}" required>
        </div>
        <div class="form-group">
            <label>Active</label>
            <select id="deal-active">
                <option value="true" ${deal?.isActive !== false ? 'selected' : ''}>Yes</option>
                <option value="false" ${deal?.isActive === false ? 'selected' : ''}>No</option>
            </select>
        </div>
    `;
    modal.classList.add('active');
}

async function saveDeal() {
    const id = document.getElementById('deal-id').value;
    const data = {
        name: document.getElementById('deal-name').value,
        restaurantId: document.getElementById('deal-restaurantId').value,
        description: document.getElementById('deal-description').value,
        discountPercent: document.getElementById('deal-discount').value,
        validFrom: document.getElementById('deal-from').value,
        validUntil: document.getElementById('deal-until').value,
        isActive: document.getElementById('deal-active').value === 'true'
    };

    const endpoint = id ? `/admin/deals/${id}` : '/admin/deals';
    const method = id ? 'PUT' : 'POST';
    const result = await apiCall(endpoint, { method, body: JSON.stringify(data) });

    if (result?.success) {
        closeModal();
        loadDeals();
    }
}

async function editDeal(id) {
    const data = await apiCall(`/admin/deals`);
    const deal = data.data.deals.find(d => d.id === id);
    if (deal) openDealModal(deal);
}

async function deleteDeal(id) {
    if (!confirm('Are you sure you want to delete this deal?')) return;
    const result = await apiCall(`/admin/deals/${id}`, { method: 'DELETE' });
    if (result?.success) loadDeals();
}

// Users
async function loadUsers(page = 1) {
    const data = await apiCall(`/admin/users?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('users-tbody');
    tbody.innerHTML = data.data.users.map(u => `
        <tr>
            <td>${u.name}</td>
            <td>${u.email}</td>
            <td><span class="badge badge-info">${u.role}</span></td>
            <td>${new Date(u.createdAt).toLocaleDateString()}</td>
            <td class="actions">
                <button class="btn-edit" onclick="editUser('${u.id}', '${u.role}')">Edit Role</button>
                ${u.role !== 'admin' ? `<button class="btn-delete" onclick="deleteUser('${u.id}')">Delete</button>` : ''}
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

// Reviews
async function loadReviews(page = 1) {
    const data = await apiCall(`/admin/reviews?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('reviews-tbody');
    tbody.innerHTML = data.data.reviews.map(r => `
        <tr>
            <td>${r.user?.name || 'Unknown'}</td>
            <td>${r.restaurant?.name || 'N/A'}</td>
            <td>⭐ ${r.rating}</td>
            <td>${r.comment?.substring(0, 50)}${r.comment?.length > 50 ? '...' : ''}</td>
            <td>${new Date(r.createdAt).toLocaleDateString()}</td>
            <td class="actions">
                <button class="btn-delete" onclick="deleteReview('${r.id}')">Delete</button>
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

// Reservations
async function loadReservations(page = 1) {
    const data = await apiCall(`/admin/reservations?page=${page}&limit=20`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('reservations-tbody');
    tbody.innerHTML = data.data.reservations.map(r => `
        <tr>
            <td>${r.user?.name || 'Unknown'}</td>
            <td>${r.restaurant?.name || 'N/A'}</td>
            <td>${r.reservationDate} ${r.reservationTime}</td>
            <td>${r.guests} guests</td>
            <td><span class="badge ${r.status === 'confirmed' ? 'badge-success' : r.status === 'pending' ? 'badge-warning' : 'badge-danger'}">${r.status}</span></td>
        </tr>
    `).join('');

    updatePagination('reservations-pagination', data.data.pagination, loadReservations);
}

// Menu Items
async function loadMenuItems(page = 1) {
    const data = await apiCall(`/admin/menu-items?page=${page}&limit=50`);
    if (!data || !data.success) return;

    const tbody = document.getElementById('menu-tbody');
    tbody.innerHTML = data.data.menuItems.map(m => `
        <tr>
            <td>${m.name}</td>
            <td>${m.restaurant?.name || 'N/A'}</td>
            <td>KES ${m.price}</td>
            <td>${m.category}</td>
            <td><span class="badge ${m.isActive ? 'badge-success' : 'badge-danger'}">${m.isActive ? 'Active' : 'Inactive'}</span></td>
            <td class="actions">
                <button class="btn-edit" onclick="editMenuItem('${m.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteMenuItem('${m.id}')">Delete</button>
            </td>
        </tr>
    `).join('');

    updatePagination('menu-pagination', data.data.pagination, loadMenuItems);
}

function openMenuItemModal(item = null) {
    const modal = document.getElementById('modal');
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
            <label>Price (KES)</label>
            <input type="number" step="0.01" id="menu-price" value="${item?.price || ''}" required>
        </div>
        <div class="form-group">
            <label>Category</label>
            <input type="text" id="menu-category" value="${item?.category || ''}">
        </div>
        <div class="form-group">
            <label>Active</label>
            <select id="menu-active">
                <option value="true" ${item?.isActive !== false ? 'selected' : ''}>Yes</option>
                <option value="false" ${item?.isActive === false ? 'selected' : ''}>No</option>
            </select>
        </div>
    `;
    modal.classList.add('active');
}

async function saveMenuItem() {
    const id = document.getElementById('menu-id').value;
    const data = {
        name: document.getElementById('menu-name').value,
        restaurantId: document.getElementById('menu-restaurantId').value,
        description: document.getElementById('menu-description').value,
        price: document.getElementById('menu-price').value,
        category: document.getElementById('menu-category').value,
        isActive: document.getElementById('menu-active').value === 'true'
    };

    const endpoint = id ? `/admin/menu-items/${id}` : '/admin/menu-items';
    const method = id ? 'PUT' : 'POST';
    const result = await apiCall(endpoint, { method, body: JSON.stringify(data) });

    if (result?.success) {
        closeModal();
        loadMenuItems();
    }
}

async function editMenuItem(id) {
    const data = await apiCall(`/admin/menu-items`);
    const item = data.data.menuItems.find(m => m.id === id);
    if (item) openMenuItemModal(item);
}

async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this menu item?')) return;
    const result = await apiCall(`/admin/menu-items/${id}`, { method: 'DELETE' });
    if (result?.success) loadMenuItems();
}

// Pagination - Fixed to avoid function stringification
function updatePagination(containerId, pagination, loadFn) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    container.innerHTML = '';
    
    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = 'Previous';
    prevBtn.disabled = pagination.page <= 1;
    if (!prevBtn.disabled) {
        prevBtn.addEventListener('click', () => loadFn(pagination.page - 1));
    }
    container.appendChild(prevBtn);
    
    // Current page
    const currBtn = document.createElement('button');
    currBtn.textContent = pagination.page;
    currBtn.className = 'active';
    currBtn.disabled = true;
    container.appendChild(currBtn);
    
    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Next';
    nextBtn.disabled = pagination.page >= pagination.totalPages;
    if (!nextBtn.disabled) {
        nextBtn.addEventListener('click', () => loadFn(pagination.page + 1));
    }
    container.appendChild(nextBtn);
}

// Modal
function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Logout
function logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = 'login.html';
}

// Navigation
function setActiveNav(page) {
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
        a.classList.toggle('active', a.dataset.page === page);
    });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('adminUser') || '{}');
    const userInfo = document.getElementById('user-info');
    if (userInfo) {
        userInfo.textContent = user.email || 'Admin';
    }
});
