import api from './axiosConfig';

export const getAllCustomers = () => api.get('/customers');
export const getCustomerById = (id) => api.get(`/customers/${id}`);
export const createCustomer = (data) => api.post('/customers', data);
export const updateCustomer = (id, data) => api.put(`/customers/${id}`, data);
export const deleteCustomer = (id) => api.delete(`/customers/${id}`);

/**
 * Fetch the logged-in customer's own profile.
 * Backend: GET /api/customers/me (ROLE_CUSTOMER)
 */
export const getMyProfile = () => api.get('/customers/me');

/**
 * Update the logged-in customer's own profile.
 * Backend: PUT /api/customers/me (ROLE_CUSTOMER)
 */
export const updateMyProfile = (data) => api.put('/customers/me', data);
