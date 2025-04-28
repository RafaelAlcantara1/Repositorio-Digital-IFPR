// src/services/api.js
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://suaapi.onrender.com/api'
});
