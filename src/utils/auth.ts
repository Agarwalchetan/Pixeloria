import Cookies from 'js-cookie';

export const AUTH_TOKEN_KEY = 'adminToken';
export const AUTH_USER_KEY = 'adminUser';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export const authUtils = {
  // Get token from localStorage, sessionStorage, or cookies
  getToken(): string | null {
    return (
      localStorage.getItem(AUTH_TOKEN_KEY) ||
      sessionStorage.getItem(AUTH_TOKEN_KEY) ||
      Cookies.get(AUTH_TOKEN_KEY) ||
      null
    );
  },

  // Get user from localStorage or sessionStorage
  getUser(): User | null {
    try {
      const userStr = localStorage.getItem(AUTH_USER_KEY) || sessionStorage.getItem(AUTH_USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  // Set authentication data
  setAuth(token: string, user: User, rememberMe: boolean = false): void {
    const storage = rememberMe ? localStorage : sessionStorage;
    
    storage.setItem(AUTH_TOKEN_KEY, token);
    storage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    
    // Set cookie for long-term session if remember me is checked
    if (rememberMe) {
      Cookies.set(AUTH_TOKEN_KEY, token, { 
        expires: 7, // 7 days
        secure: true,
        sameSite: 'strict'
      });
    }
  },

  // Clear authentication data
  clearAuth(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_USER_KEY);
    sessionStorage.removeItem(AUTH_TOKEN_KEY);
    sessionStorage.removeItem(AUTH_USER_KEY);
    Cookies.remove(AUTH_TOKEN_KEY);
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  },

  // Check if user is admin
  isAdmin(): boolean {
    const user = this.getUser();
    return user?.role === 'admin';
  },

  // Verify token with backend
  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) return false;

      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update user data if token is valid
        const storage = localStorage.getItem(AUTH_TOKEN_KEY) ? localStorage : sessionStorage;
        storage.setItem(AUTH_USER_KEY, JSON.stringify(data.data.user));
        return true;
      } else {
        // Token is invalid, clear auth data
        this.clearAuth();
        return false;
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      this.clearAuth();
      return false;
    }
  }
};

export default authUtils;