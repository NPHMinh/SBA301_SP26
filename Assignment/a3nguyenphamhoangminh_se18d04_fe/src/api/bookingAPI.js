import api from './axiosConfig';

export const getAllBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const updateBookingStatus = (id, status) =>
  api.put(`/bookings/${id}/status`, { bookingStatus: status });
export const getMyBookingHistory = () => api.get('/bookings/my-history');
