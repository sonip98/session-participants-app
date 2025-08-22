import { boot } from 'quasar/wrappers';
import axios from 'axios';

// Configure Axios instance
const api = axios.create({
  baseURL: process.env.API_URL || 'http://localhost:5000/api',
});

export default boot(({ app }) => {
  // Make available globally as this.$axios and this.$api
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

// Named export for direct imports
export { axios, api };
