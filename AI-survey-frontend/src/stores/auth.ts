import { defineStore } from 'pinia';
import type { User, LoginForm, RegisterForm, AuthResponse } from '@/types/user';
import { ref, computed } from 'vue';
import axios from 'axios';

// 创建 axios 实例
const api = axios.create({
  baseURL: 'http://localhost:8080',  // 确保与后端端口匹配
  headers: {
    'Content-Type': 'application/json'
  }
});

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  const login = async (form: LoginForm) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.post<AuthResponse>('/api/auth/login', form);
      user.value = response.data.user;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
      console.error('Login error:', err);
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const register = async (form: RegisterForm) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.post<AuthResponse>('/api/auth/register', form);
      user.value = response.data.user;
      token.value = response.data.token;
      localStorage.setItem('token', response.data.token);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      console.error('Registration error:', err);
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('token');
  };

  const checkAuth = async () => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      try {
        const response = await api.get<User>('/api/auth/me');
        user.value = response.data;
        token.value = savedToken;
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
        user.value = null;
        token.value = null;
      }
    }
  };

  // 初始化检查认证状态
  checkAuth();

  return {
    user,
    loading,
    error,
    isAuthenticated,
    login,
    register,
    logout,
    checkAuth
  };
});