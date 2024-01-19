import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosInstance = axios.create();
//const navigate = useNavigate();
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
      localStorage.removeItem('token');
      localStorage.removeItem('userName');
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;