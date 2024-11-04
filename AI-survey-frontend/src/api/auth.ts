import api from './axios';
import type { LoginForm, RegisterForm, User, AuthResponse } from '@/types/user';

export const authApi = {
  // login
  login: (data: LoginForm) => 
    api.post<AuthResponse>('/auth/login', data),

  // register
  register: (data: RegisterForm) => 
    api.post<AuthResponse>('/auth/register', data),

  // 获取当前用户信息
  getCurrentUser: () => 
    api.get<User>('/auth/user'),

  // 获取用户统计信息
  getUserStats: () => 
    api.get('/auth/stats'),

  // 获取用户创建的问卷
  getUserSurveys: () => 
    api.get('/auth/surveys'),

  // 更新用户信息
  updateProfile: (data: Partial<User>) => 
    api.put('/auth/profile', data)
};