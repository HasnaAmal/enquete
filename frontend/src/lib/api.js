import axios from 'axios';

const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
});

export const api = {
  getForms:       ()                  => client.get('/forms').then(r => r.data),
  getForm:        (id)                => client.get(`/forms/${id}`).then(r => r.data),
  createForm:     (data)              => client.post('/forms', data).then(r => r.data),
  updateForm:     (id, data)          => client.put(`/forms/${id}`, data).then(r => r.data),
  deleteForm:     (id)                => client.delete(`/forms/${id}`).then(r => r.data),
  saveQuestions:  (formId, questions) => client.post(`/forms/${formId}/questions`, { questions }).then(r => r.data),
  submitResponse: (formId, answers)   => client.post(`/forms/${formId}/responses`, { answers }).then(r => r.data),
  getResponses:   (formId)            => client.get(`/forms/${formId}/responses`).then(r => r.data),
};
