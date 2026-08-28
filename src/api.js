import axios from 'axios';

// Normalise whatever REACT_APP_API_URL is given so it always ends with exactly "/api".
// Accepts:  https://host  |  https://host/  |  https://host/api  |  https://host/api/
function resolveApiBase(raw) {
  const fallback = 'https://akagerainc-9vkh.onrender.com/api';
  let url = (raw || fallback).trim().replace(/\/+$/, '');
  if (!/\/api$/i.test(url)) url += '/api';
  return url;
}

const API_BASE_URL = resolveApiBase(process.env.REACT_APP_API_URL);
export const API_ORIGIN = API_BASE_URL.replace(/\/api$/i, '');

const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const cfg = error.config || {};
    const status = error.response?.status;

    if (status === 401 && !cfg.url?.includes('/auth/')) {
      // token invalid/expired — drop it but do not hard-redirect (public pages still work)
      localStorage.removeItem('access_token');
    }

    // Retry transient backend hiccups (503/502/504 or network error) for idempotent GETs.
    const method = (cfg.method || 'get').toLowerCase();
    const retriable = (!status || [502, 503, 504].includes(status)) && method === 'get';
    cfg._retry = cfg._retry || 0;
    if (retriable && cfg._retry < 3) {
      cfg._retry += 1;
      await sleep(500 * cfg._retry);
      return api(cfg);
    }

    return Promise.reject(error);
  }
);

/** Resolve a stored media path to an absolute URL. */
export const mediaUrl = (path) => {
  if (!path) return null;
  if (/^(https?:|data:)/.test(path)) return path;
  return `${API_ORIGIN}/${String(path).replace(/^\/+/, '')}`;
};

export const errText = (e) => {
  const d = e?.response?.data?.detail;
  if (Array.isArray(d)) return d.map((x) => x.msg || x).join(', ');
  if (typeof d === 'string') return d;
  return e?.response?.data?.message || e?.message || 'Something went wrong. Please try again.';
};

// ---------------- auth ----------------
export const authAPI = {
  register: (b) => api.post('/auth/register', b),
  login: (b) => api.post('/auth/login', b),
  google: (b) => api.post('/auth/google', b),
  me: () => api.get('/auth/me'),
  updateProfile: (b) => api.patch('/auth/profile', b),
  changePassword: (b) => api.post('/auth/change-password', b),
  deleteAccount: () => api.delete('/auth/account'),
  otpRequest: (email, purpose = 'login') => api.post('/auth/otp/request', { email, purpose }),
  otpVerify: (b) => api.post('/auth/otp/verify', b),
  passwordReset: (b) => api.post('/auth/password/reset', b),
};

// ---------------- public content ----------------
export const contentAPI = {
  settings: () => api.get('/settings'),
  navigation: () => api.get('/navigation'),
  categories: (kind) => api.get('/categories', { params: { kind } }),
  images: (pageType) => api.get('/images', { params: { page_type: pageType } }),
  search: (q) => api.get('/search', { params: { q } }),
  testimonials: () => api.get('/testimonials'),
  faqs: (category) => api.get('/faqs', { params: { category } }),
  industries: () => api.get('/industries'),
  industry: (slug) => api.get(`/industries/${slug}`),
  // legacy shape used by some older components
  getSiteContent: () => api.get('/settings'),
};

export const productAPI = {
  list: (params) => api.get('/products', { params }),
  get: (slug) => api.get(`/products/${slug}`),
};

export const downloadAPI = {
  list: (platform) => api.get('/downloads', { params: { platform } }),
  forProduct: (slug) => api.get(`/downloads/${slug}`),
};

export const serviceAPI = {
  getAll: () => api.get('/services'),
  list: (params) => api.get('/services', { params }),
  get: (slug) => api.get(`/services/${slug}`),
  getById: (id) => api.get(`/services/${id}`),
  pricing: () => api.get('/pricing'),
};

export const blogAPI = {
  list: (params) => api.get('/blog', { params }),
  get: (slug) => api.get(`/blog/${slug}`),
};

export const caseStudyAPI = {
  list: (params) => api.get('/case-studies', { params }),
  get: (slug) => api.get(`/case-studies/${slug}`),
};

export const careersAPI = {
  list: () => api.get('/careers'),
  get: (slug) => api.get(`/careers/${slug}`),
  apply: (slug, formData) => api.post(`/careers/${slug}/apply`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const internshipAPI = {
  list: () => api.get('/internships'),
  get: (slug) => api.get(`/internships/${slug}`),
  apply: (slug, formData) => api.post(`/internships/${slug}/apply`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

export const docsAPI = {
  list: (section) => api.get('/documentation', { params: { section } }),
  get: (slug) => api.get(`/documentation/${slug}`),
};

// ---------------- commerce / account ----------------
export const orderAPI = {
  start: (b) => api.post('/orders', b),
  mine: () => api.get('/orders/me'),
  get: (ref) => api.get(`/orders/${ref}`),
};

export const invoiceAPI = {
  mine: () => api.get('/invoices/me'),
  pdfUrl: (ref) => `${API_BASE_URL}/invoices/${ref}/pdf`,
};

export const dashboardAPI = {
  overview: () => api.get('/dashboard/overview'),
  downloads: () => api.get('/dashboard/downloads'),
};

export const subscriptionAPI = {
  mine: () => api.get('/subscriptions/me'),
  cancel: (id) => api.post(`/subscriptions/${id}/cancel`),
};

export const notificationAPI = {
  mine: () => api.get('/notifications/me'),
  read: (id) => api.post(`/notifications/${id}/read`),
};

export const supportAPI = {
  create: (b) => api.post('/support/tickets', b),
  mine: () => api.get('/support/tickets/me'),
  get: (ref) => api.get(`/support/tickets/${ref}`),
  reply: (ref, body) => api.post(`/support/tickets/${ref}/messages`, { body }),
};

export const contactAPI = {
  submit: (b) => api.post('/contact', b),
};

// ---------------- payments (existing endpoints) ----------------
export const paymentAPI = {
  paypalCreate: (userId, body, orderRef) =>
    api.post('/payments/paypal/create-order', body, { params: { user_id: userId, order_ref: orderRef } }),
  paypalCapture: (paypalOrderId, userId) =>
    api.post('/payments/paypal/capture-order', null, { params: { paypal_order_id: paypalOrderId, user_id: userId } }),
  momoInitiate: (body) => api.post('/payments/initiate-momo', body),
  momoStatus: (reqRef) => api.post('/payments/status', null, { params: { req_ref: reqRef } }),
  activateFree: (serviceId, userId) =>
    api.post(`/services/${serviceId}/activate-free`, null, { params: { user_id: userId } }),
  userPayments: (userId) => api.get(`/payments/user/${userId}`),
};

export const licenseAPI = {
  getUserLicenses: (userId) => api.get(`/licenses/user/${userId}`),
  verify: (key) => api.get(`/licenses/verify/${key}`),
};

// ---------------- business portal ----------------
export const businessAPI = {
  getCategories: () => api.get('/business/categories'),
  login: (b) => api.post('/business/login', b),
  userTokens: (userId) => fetch(`${API_BASE_URL}/business/tokens/user/${userId}`).then((r) => r.json()),
};

// ---------------- admin ----------------
const adminClient = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });
adminClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const adminAPI = {
  login: (b) => adminClient.post('/admin/login', b),
  stats: () => adminClient.get('/admin/stats'),
  list: (name, params) => adminClient.get(`/admin/resources/${name}`, { params }),
  create: (name, b) => adminClient.post(`/admin/resources/${name}`, b),
  update: (name, id, b) => adminClient.patch(`/admin/resources/${name}/${id}`, b),
  remove: (name, id) => adminClient.delete(`/admin/resources/${name}/${id}`),
  serviceFields: (id) => adminClient.get(`/admin/services/${id}/fields`),
  orders: (status) => adminClient.get('/admin/orders', { params: { status } }),
  setOrderStatus: (id, status) => adminClient.patch(`/admin/orders/${id}/status`, { status }),
  setUserRole: (id, b) => adminClient.patch(`/admin/users/${id}/role`, b),
  setLicenseStatus: (id, status) => adminClient.patch(`/admin/licenses/${id}/status`, { status }),
  issueLicense: (b) => adminClient.post('/admin/licenses', b),
  content: () => adminClient.get('/admin/content'),
  getContent: (key) => adminClient.get(`/admin/content/${key}`),
  putContent: (key, value) => adminClient.put(`/admin/content/${key}`, { value }),
  images: (pageType) => adminClient.get('/admin/images', { params: { page_type: pageType } }),
  uploadImage: (formData) => adminClient.post('/admin/images', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateImage: (id, b) => adminClient.patch(`/admin/images/${id}`, b),
  deleteImage: (id) => adminClient.delete(`/admin/images/${id}`),
  reorderImages: (ids) => adminClient.post('/admin/images/reorder', { image_ids: ids }),
  upload: (formData) => adminClient.post('/admin/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  uploadInstaller: (formData) => adminClient.post('/admin/downloads/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  navReorder: (ids) => adminClient.post('/admin/navigation/reorder', { ids }),
  audit: () => adminClient.get('/admin/audit'),
  messages: () => adminClient.get('/admin/messages'),
  ticket: (ref) => adminClient.get(`/admin/tickets/${ref}`),
  ticketReply: (ref, body, status) => adminClient.post(`/admin/tickets/${ref}/reply`, { body, status }),
  seed: () => adminClient.post('/admin/seed'),
};

export default api;
