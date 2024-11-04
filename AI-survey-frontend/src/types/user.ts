export interface User {
    id: string;
    username: string;
    email: string;
    avatar?: string;
    createdAt: string;
  }
  
  export interface AuthResponse {
    user: User;
    token: string;
  }
  
  export interface LoginForm {
    email: string;
    password: string;
  }
  
  export interface RegisterForm {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  export interface UserSurveyStats {
    totalSurveys: number;
    totalResponses: number;
  }