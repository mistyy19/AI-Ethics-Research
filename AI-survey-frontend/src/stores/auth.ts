import { defineStore } from 'pinia';
import type { User, LoginForm, RegisterForm, AuthResponse } from '@/types/user';
import { ref, computed } from 'vue';
import axios from 'axios';

// 创建 axios 实例
export const api = axios.create({
  baseURL: 'http://localhost:8080'
});

// 从 localStorage 恢复状态的函数
const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  return {
    token,
    user: storedUser ? JSON.parse(storedUser) : null
  };
};

// 设置 axios 默认 token
const storedAuth = getStoredAuth();
if (storedAuth.token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${storedAuth.token}`;
}

export const useAuthStore = defineStore('auth', () => {
  // 初始化时从 localStorage 加载状态
  const initialAuth = getStoredAuth();
  const token = ref<string | null>(initialAuth.token);
  const user = ref<User | null>(initialAuth.user);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const redirectPath = ref<string | null>(null);

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  // 更新认证信息的函数
  const updateAuth = (newToken: string, newUser: User) => {
    token.value = newToken;
    user.value = newUser;
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
  };

  const setRedirectPath = (path: string | null) => {
    redirectPath.value = path;
  };

  const login = async (form: LoginForm) => {
    try {
      loading.value = true;
      error.value = null;
      const response = await api.post<AuthResponse>('/api/auth/login', form);
      updateAuth(response.data.token, response.data.user);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Login failed';
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
      updateAuth(response.data.token, response.data.user);
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    token.value = null;
    user.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  const checkAuth = async () => {
    const currentToken = localStorage.getItem('token');
    if (!currentToken) {
      logout();
      return;
    }

    try {
      // 确保设置了 token
      api.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
      const response = await api.get<User>('/api/auth/me');
      user.value = response.data;
      token.value = currentToken;
      localStorage.setItem('user', JSON.stringify(response.data));
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
    }
  };

  // 添加响应拦截器处理认证错误
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401) {
        logout();
      }
      return Promise.reject(error);
    }
  );

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    redirectPath,
    setRedirectPath,
    login,
    register,
    logout,
    checkAuth
  };
});