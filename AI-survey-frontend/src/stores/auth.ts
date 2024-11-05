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

// 添加请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 从 localStorage 恢复状态的函数
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

const storedAuth = getStoredAuth();
if (storedAuth.token) {
  api.defaults.headers.common['Authorization'] = storedAuth.token;
}

export const useAuthStore = defineStore('auth', () => {
  const initialAuth = getStoredAuth();
  const token = ref<string | null>(initialAuth.token);
  const user = ref<User | null>(initialAuth.user);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const redirectPath = ref<string | null>(null);
  const isAuthenticating = ref(false);

  const isAuthenticated = computed(() => !!user.value && !!token.value);

  const updateAuth = (newToken: string, newUser: User) => {
    try {
      const bearerToken = newToken.startsWith('Bearer ') ? newToken : `Bearer ${newToken}`;
      token.value = bearerToken;
      user.value = newUser;
      localStorage.setItem('token', bearerToken);
      localStorage.setItem('user', JSON.stringify(newUser));
      api.defaults.headers.common['Authorization'] = bearerToken;
      error.value = null;
    } catch (err) {
      console.error('Failed to update auth:', err);
      handleAuthError();
    }
  };

  const handleAuthError = () => {
    token.value = null;
    user.value = null;
    error.value = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete api.defaults.headers.common['Authorization'];
  };

  const login = async (form: LoginForm) => {
    if (isAuthenticating.value) return false;
    
    try {
      isAuthenticating.value = true;
      loading.value = true;
      error.value = null;
      
      const response = await api.post<AuthResponse>('/api/auth/login', form);
      if (response.data?.token && response.data?.user) {
        updateAuth(response.data.token, response.data.user);
        await checkAuth(); // 登录后立即检查认证状态
        return true;
      }
      error.value = 'Invalid response from server';
      return false;
    } catch (err: any) {
      error.value = err.response?.data?.message || 
                   (err.response?.status === 401 ? 'Invalid email or password' : 'Login failed');
      return false;
    } finally {
      loading.value = false;
      isAuthenticating.value = false;
    }
  };

  const register = async (form: RegisterForm) => {
    if (isAuthenticating.value) return false;
    
    try {
      isAuthenticating.value = true;
      loading.value = true;
      error.value = null;
      
      const response = await api.post<AuthResponse>('/api/auth/register', form);
      if (response.data?.token && response.data?.user) {
        updateAuth(response.data.token, response.data.user);
        await checkAuth(); // 注册后立即检查认证状态
        return true;
      }
      error.value = 'Invalid response from server';
      return false;
    } catch (err: any) {
      error.value = err.response?.data?.message || 'Registration failed';
      return false;
    } finally {
      loading.value = false;
      isAuthenticating.value = false;
    }
  };

  const logout = () => {
    handleAuthError();
    redirectPath.value = null;
  };

  const checkAuth = async () => {
    if (!token.value || isAuthenticating.value) {
      return false;
    }

    try {
      isAuthenticating.value = true;
      const response = await api.get<User>('/api/auth/me');
      
      if (response.data) {
        user.value = response.data;
        // 确保 token 和用户信息都保存在本地
        localStorage.setItem('user', JSON.stringify(response.data));
        if (token.value) {
          localStorage.setItem('token', token.value);
          api.defaults.headers.common['Authorization'] = token.value;
        }
        return true;
      }
      
      handleAuthError();
      return false;
    } catch (err) {
      console.error('Auth check failed:', err);
      handleAuthError();
      return false;
    } finally {
      isAuthenticating.value = false;
    }
  };

  // 响应拦截器
  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response?.status === 401 || error.response?.status === 403) {
        const isModalOpen = localStorage.getItem('isModalOpen');
        console.log("401/403 error detected. isModalOpen:", isModalOpen);
        
        if (!isAuthenticating.value && isModalOpen !== 'true') {
          console.log("Triggering logout and redirecting to home");
          handleAuthError();
          const isAuthEndpoint = error.config.url.includes('/api/auth/');
          if (!isAuthEndpoint && typeof window !== 'undefined') {
            localStorage.setItem('redirectPath', window.location.pathname);
            window.location.href = '/';
          }
        } else {
          console.log("Modal is open or authentication in progress, not redirecting.");
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
    login,
    register,
    logout,
    checkAuth,
    api
  };
});