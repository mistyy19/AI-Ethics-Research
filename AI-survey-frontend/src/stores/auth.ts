import { defineStore } from 'pinia';
import type { User, LoginForm, RegisterForm, AuthResponse } from '@/types/user';
import { ref, computed } from 'vue';
import axios from 'axios';

// 创建 axios 实例
export const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json'
  }
});

// 从 localStorage 恢复状态的函数，确保正确的 token 格式
const getStoredAuth = () => {
  try {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    return {
      token: token ? (token.startsWith('Bearer ') ? token : `Bearer ${token}`) : null,
      user: storedUser ? JSON.parse(storedUser) : null
    };
  } catch (err) {
    console.error('Failed to parse stored auth:', err);
    return { token: null, user: null };
  }
};

// 设置 axios 默认 token
const storedAuth = getStoredAuth();
if (storedAuth.token) {
  api.defaults.headers.common['Authorization'] = storedAuth.token;
}

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      const bearerToken = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
      config.headers.Authorization = bearerToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
    try {
      // 确保 token 格式正确
      const bearerToken = newToken.startsWith('Bearer ') ? newToken : `Bearer ${newToken}`;
      token.value = bearerToken;
      user.value = newUser;
      localStorage.setItem('token', bearerToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      api.defaults.headers.common['Authorization'] = bearerToken;
      error.value = null;
    } catch (err) {
      console.error('Failed to update auth:', err);
      logout();
    }
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
      return response.data;
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
      return response.data;
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
    error.value = null;
    redirectPath.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  const checkAuth = async () => {
    try {
      const currentToken = localStorage.getItem('token');
      if (!currentToken) {
        logout();
        return false;
      }

      const bearerToken = currentToken.startsWith('Bearer ') ? currentToken : `Bearer ${currentToken}`;
      api.defaults.headers.common['Authorization'] = bearerToken;
      
      const response = await api.get<User>('/api/auth/me');
      user.value = response.data;
      token.value = bearerToken;
      localStorage.setItem('token', bearerToken);
      localStorage.setItem('user', JSON.stringify(response.data));
      
      return true;
    } catch (err) {
      console.error('Auth check failed:', err);
      logout();
      return false;
    }
  };

  // 添加响应拦截器处理认证错误
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        logout();
        if (typeof window !== 'undefined') {
          window.location.href = '/';  // 强制页面刷新
        }
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
    checkAuth,
    api  // 导出 api 实例
  };
});