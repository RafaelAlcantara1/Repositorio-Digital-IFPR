import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://repositorio-digital-ifpr.onrender.com';

export const api = axios.create({
  baseURL: API_URL
});
