// utils/cookies.ts - COMPLETELY REPLACE
import Cookies from 'js-cookie';

export const cookieManager = {
  setToken(token: string) {

    Cookies.remove('token', { path: '/' });
    Cookies.remove('token', { path: '' });
    
    const options = {
      expires: 7,
      path: '/',
      secure: import.meta.env.NODE_ENV === 'production',
      sameSite: 'lax' as const
    };

    Cookies.set('token', token, options);
    
    document.cookie = `token=${token}; expires=${new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()}; path=/`;

    const verified = this.verifyTokenStorage(token);
    if (!verified) {
      console.error('🚨 TOKEN STORAGE VERIFICATION FAILED');
    }
  },

  getToken() {
    // Try multiple methods
    const methods = {
      jsCookie: Cookies.get('token'),
      directCookie: document.cookie.match(/token=([^;]+)/)?.[1],
      directCookiePath: document.cookie.match(/token=([^;]+);?/)?.[1]
    };

    const token = methods.jsCookie || methods.directCookie || methods.directCookiePath;

    return token;
  },

  removeToken() {
    
    // Remove from all possible locations
    Cookies.remove('token', { path: '/' });
    Cookies.remove('token', { path: '' });
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
  },

  verifyTokenStorage(expectedToken: string) {
    const stored = this.getToken();
    const isStored = stored === expectedToken;
    
    return isStored;
  },

  debugAllCookies() {
    return document.cookie;
  }
};