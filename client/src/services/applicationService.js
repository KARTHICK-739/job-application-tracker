import api from './api.js';

export const getApplications = async (params = {}) => {
  const { data } = await api.get('/applications', { params });
  return data;
};

export const getApplication = async (id) => {
  const { data } = await api.get(`/applications/${id}`);
  return data;
};

export const createApplication = async (payload) => {
  const { data } = await api.post('/applications', payload);
  return data;
};

export const updateApplication = async (id, payload) => {
  const { data } = await api.put(`/applications/${id}`, payload);
  return data;
};

export const deleteApplication = async (id) => {
  const { data } = await api.delete(`/applications/${id}`);
  return data;
};

export const getApplicationStats = async () => {
  const { data } = await api.get('/applications/stats');
  return data;
};

