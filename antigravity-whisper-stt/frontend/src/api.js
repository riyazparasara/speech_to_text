import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000',
});

export const uploadAudio = (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/upload', formData);
};

export const getJobs = () => {
    return api.get('/jobs');
};

export const getJob = (id) => {
    return api.get(`/jobs/${id}`);
};

export const deleteJob = (id) => {
    return api.delete(`/jobs/${id}`);
};

export const getDownloadUrl = (id, format) => {
    return `http://localhost:8000/download/${id}/${format}`;
};

export default api;
