import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
});

// ── Medicines ──────────────────────────────────────────────
export const getMedicines     = ()        => api.get('/medicines');
export const addMedicine      = (data)    => api.post('/medicines', data);
export const updateMedicine   = (id, data)=> api.put(`/medicines/${id}`, data);
export const deleteMedicine   = (id)      => api.delete(`/medicines/${id}`);

// ── Reminders ──────────────────────────────────────────────
export const getReminders     = ()        => api.get('/reminders');
export const addReminder      = (data)    => api.post('/reminders', data);
export const updateReminder   = (id, data)=> api.put(`/reminders/${id}`, data);
export const deleteReminder   = (id)      => api.delete(`/reminders/${id}`);

// ── Logs ───────────────────────────────────────────────────
export const getLogs          = (params)  => api.get('/logs', { params });
export const getDashboard     = ()        => api.get('/dashboard');
export const acknowledge      = (id, data)=> api.post(`/acknowledge/${id}`, data);
export const logMissed        = (data)    => api.post('/logs/missed', data);
