/**
 * api.js - Centralized API client for the Healthy Lunchbox backend.
 *
 * Uses JWT tokens stored in localStorage.
 * Automatically refreshes access token on 401 responses.
 */

const BASE_URL = 'http://localhost:3000/api';

// ── Token helpers ─────────────────────────────────────────────────────────────

export const getAccessToken  = () => localStorage.getItem('access_token');

export const saveTokens = ({ access_token }) => {
  if (access_token) localStorage.setItem('access_token', access_token);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
};

export const saveUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const getSavedUser = () => {
  try { return JSON.parse(localStorage.getItem('user')); }
  catch { return null; }
};

// ── Core fetch wrapper ────────────────────────────────────────────────────────

async function apiFetch(path, options = {}) {
  const token = getAccessToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (res.status === 401) {
    clearTokens();
  }

  return res;
}

// ── Auth API ──────────────────────────────────────────────────────────────────

export const authAPI = {
  register: async (data) => {
    const res = await apiFetch('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    saveTokens({ access_token: json.access_token });
    saveUser(json.user);
    return json;
  },

  login: async (email, password) => {
    const res = await apiFetch('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    saveTokens({ access_token: json.access_token });
    saveUser(json.user);
    return json;
  },

  logout: async () => {
    clearTokens();
  },

  me: async () => {
    const res = await apiFetch('/auth/me');
    if (!res.ok) throw await res.json();
    const user = await res.json();
    saveUser(user);
    return user;
  },

  updateProfile: async (data) => {
    const res = await apiFetch('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    const user = await res.json();
    saveUser(user);
    return user;
  },

  changePassword: async (oldPassword, newPassword) => {
    const res = await apiFetch('/auth/change-password/', {
      method: 'POST',
      body: JSON.stringify({ old_password: oldPassword, new_password: newPassword }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  verifyOtp: async (userId, otpCode) => {
    const res = await apiFetch('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ userId, otpCode }),
    });
    const json = await res.json();
    if (!res.ok) throw json;
    saveTokens({ access_token: json.access_token });
    saveUser(json.user);
    return json;
  },

  getSmtpConfig: async () => {
    const res = await apiFetch('/auth/smtp-config');
    if (!res.ok) throw await res.json();
    return res.json();
  },

  updateSmtpConfig: async (data) => {
    const res = await apiFetch('/auth/smtp-config', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },

  update2FA: async (enabled) => {
    const res = await apiFetch('/auth/2fa', {
      method: 'PATCH',
      body: JSON.stringify({ enabled }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── Shops API ─────────────────────────────────────────────────────────────────

export const shopsAPI = {
  list:     async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await apiFetch(`/shops${q ? `?${q}` : ''}`);
    return res.json();
  },
  get:      async (id)    => (await apiFetch(`/shops/${id}`)).json(),
  getMyShop: async () => {
    // Legacy endpoint, might still be used during initial load
    const res = await apiFetch('/shops/my-shop');
    if (!res.ok) throw await res.json();
    return res.json();
  },
  updateOperations: async (shopId, data) => {
    const res = await apiFetch(`/shops/${shopId}/operations`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  menuItems:async (id)    => (await apiFetch(`/menus?shopId=${id}`)).json(),
  create:   async (data)  => {
    const res = await apiFetch('/shops', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  update:   async (id, data) => {
    const res = await apiFetch(`/shops/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  delete:   async (id) => {
    const res = await apiFetch(`/shops/${id}`, { method: 'DELETE' });
    if (!res.ok) throw await res.json();
  },
  getPerformance: async (shopId, range = 'today') => {
    const res = await apiFetch(`/shops/${shopId}/performance?range=${range}`);
    if (!res.ok) throw await res.json();
    return res.json();
  }
};

// ── Menu API ──────────────────────────────────────────────────────────────────

export const menuAPI = {
  items: async (params = {}) => {
    const q = new URLSearchParams(params).toString();
    const res = await apiFetch(`/menus${q ? `?${q}` : ''}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results || []);
  },
  categories: async () => {
    const res = await apiFetch('/categories');
    return res.json();
  },
  createItem: async (data) => {
    const res = await apiFetch('/menus', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  updateItem: async (id, data) => {
    const res = await apiFetch(`/menus/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  updateItemPromo: async (id, data) => {
    const res = await apiFetch(`/menus/${id}/promo`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  deleteItem: async (id) => {
    const res = await apiFetch(`/menus/${id}`, { method: 'DELETE' });
    if (!res.ok) throw await res.json();
  },
  createCategory: async (data) => {
    const res = await apiFetch('/categories', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  updateCategory: async (id, data) => {
    const res = await apiFetch(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  updateStock: async (id, data) => {
    const res = await apiFetch(`/menus/${id}/stock`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── Bookings API ──────────────────────────────────────────────────────────────

export const bookingsAPI = {
  list: async () => {
    const res = await apiFetch('/orders/my-orders');
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results || []);
  },
  activeQueue: async (shopId) => {
    const res = await apiFetch(`/orders/shop/${shopId}/active`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results || []);
  },
  riderDeliveries: async () => {
    const res = await apiFetch('/orders/rider/my-deliveries');
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results || []);
  },
  riderIncentives: async () => {
    const res = await apiFetch('/orders/rider/incentives');
    return res.json();
  },
  create: async (data) => {
    const res = await apiFetch('/orders', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  updateStatus: async (id, newStatus) => {
    const res = await apiFetch(`/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── Coupons API ─────────────────────────────────────────────────────────────

export const couponsAPI = {
  validate: async (code) => {
    const res = await apiFetch('/coupons/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── Support API ──────────────────────────────────────────────────────────────

export const supportAPI = {
  myTickets: async () => {
    const res = await apiFetch('/support/tickets/my-tickets');
    if (!res.ok) throw await res.json();
    return res.json();
  },
  createTicket: async (data) => {
    const res = await apiFetch('/support/tickets', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  replyTicket: async (id, text) => {
    const res = await apiFetch(`/support/tickets/${id}/reply`, { method: 'POST', body: JSON.stringify({ text }) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── Addresses API ─────────────────────────────────────────────────────────────

export const addressAPI = {
  list: async () => {
    const res = await apiFetch('/addresses');
    return res.json();
  },
  create: async (data) => {
    const res = await apiFetch('/addresses', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  setAsDefault: async (id) => {
    const res = await apiFetch(`/addresses/${id}/default`, { method: 'PUT' });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  delete: async (id) => {
    const res = await apiFetch(`/addresses/${id}`, { method: 'DELETE' });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── Tickets API ───────────────────────────────────────────────────────────────

export const ticketsAPI = {
  list: async () => {
    const res = await apiFetch('/tickets');
    return res.json();
  },
  create: async (data) => {
    const res = await apiFetch('/tickets', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── Wallet API ───────────────────────────────────────────────────────────────

export const walletAPI = {
  getBalance: async () => {
    const res = await apiFetch('/wallet/balance');
    if (!res.ok) throw await res.json();
    return res.json();
  },
  getTransactions: async () => {
    const res = await apiFetch('/wallet/transactions');
    if (!res.ok) throw await res.json();
    return res.json();
  },
  addFunds: async (amount) => {
    const res = await apiFetch('/wallet/add', { method: 'POST', body: JSON.stringify({ amount }) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  deductFunds: async (amount) => {
    const res = await apiFetch('/wallet/deduct', { method: 'POST', body: JSON.stringify({ amount }) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
};

// ── Admin API ─────────────────────────────────────────────────────────────────

export const adminAPI = {
  getDashboard: async () => (await apiFetch('/admin/dashboard')).json(),
  getAuditLogs: async (page = 1, limit = 20) => (await apiFetch(`/admin/audit-logs?page=${page}&limit=${limit}`)).json(),
  getCustomers: async (page = 1, limit = 20) => (await apiFetch(`/admin/customers?page=${page}&limit=${limit}`)).json(),
  banCustomer: async (id) => {
    const res = await apiFetch(`/admin/customers/${id}/ban`, { method: 'PUT' });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  unbanCustomer: async (id) => {
    const res = await apiFetch(`/admin/customers/${id}/unban`, { method: 'PUT' });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  getOrders: async (page = 1, limit = 20) => (await apiFetch(`/admin/orders?page=${page}&limit=${limit}`)).json(),
  getRiders: async (page = 1, limit = 20) => (await apiFetch(`/admin/riders?page=${page}&limit=${limit}`)).json(),
  toggleRiderStatus: async (id) => {
    const res = await apiFetch(`/admin/riders/${id}/toggle-status`, { method: 'PUT' });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  getSupportTickets: async (page = 1, limit = 20) => (await apiFetch(`/admin/support?page=${page}&limit=${limit}`)).json(),
  updateTicket: async (id, data) => {
    const res = await apiFetch(`/admin/support/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  getPayouts: async (page = 1, limit = 20) => (await apiFetch(`/admin/payouts?page=${page}&limit=${limit}`)).json(),
  getSystemConfig: async () => (await apiFetch('/admin/system-config')).json(),
  updateSystemConfig: async (key, value) => {
    const res = await apiFetch('/admin/system-config', { method: 'PUT', body: JSON.stringify({ key, value }) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  getSubAdmins: async () => (await apiFetch('/admin/subadmins')).json(),
  createSubAdmin: async (data) => {
    const res = await apiFetch('/admin/subadmins', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  updateSubAdmin: async (id, data) => {
    const res = await apiFetch(`/admin/subadmins/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  updateIpAllowlist: async (targetUserId, ips) => {
    const res = await apiFetch('/admin/ip-allowlist', {
      method: 'PUT',
      body: JSON.stringify({ targetUserId, ips }),
    });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  getPermissions: async () => (await apiFetch('/admin/permissions')).json(),
  getPromotions: async () => (await apiFetch('/admin/promotions')).json(),
  createPromotion: async (data) => {
    const res = await apiFetch('/admin/promotions', { method: 'POST', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  updatePromotion: async (id, data) => {
    const res = await apiFetch(`/admin/promotions/${id}`, { method: 'PUT', body: JSON.stringify(data) });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  deletePromotion: async (id) => {
    const res = await apiFetch(`/admin/promotions/${id}`, { method: 'DELETE' });
    if (!res.ok) throw await res.json();
    return res.json();
  },
  getMapData: async () => {
    // Mock endpoint for Task 2
    return {
      alerts: [
        { id: 1, lat: 51.505, lng: -0.09, message: 'Rider Delayed', severity: 'high' },
        { id: 2, lat: 51.51, lng: -0.1, message: 'High Traffic Area', severity: 'medium' }
      ],
      bookings: [
        { id: 'ORD-001', lat: 51.515, lng: -0.09, status: 'On Way' },
        { id: 'ORD-002', lat: 51.52, lng: -0.11, status: 'Cooking' }
      ]
    };
  }
};

// ── Finance API ───────────────────────────────────────────────────────────────

export const financeAPI = {
  getReconciliation: async () => (await apiFetch('/finance/reconciliation')).json(),
};
