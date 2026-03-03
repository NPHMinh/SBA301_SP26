import { createContext, useContext, useState, useCallback } from 'react';
import { login as loginAPI } from '../api/authAPI';

const AuthContext = createContext(null);

/** Decode JWT payload without verification (client-side only) */
const decodeJwt = (token) => {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
  } catch {
    return {};
  }
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [customerId, setCustomerId] = useState(() =>
    localStorage.getItem('customerId')
  );
  const [userEmail, setUserEmail] = useState(() =>
    localStorage.getItem('userEmail')
  );

  const login = useCallback(async (email, password) => {
    const res = await loginAPI(email, password);
    const { token, role } = res.data;
    // Backend may return customerId directly, or it may be in the JWT payload
    const customerIdFromResponse = res.data.customerId;
    const decoded = decodeJwt(token);
    const resolvedCustomerId =
      customerIdFromResponse ??
      decoded.customerId ??
      decoded.id ??
      null;
    const resolvedEmail = decoded.sub ?? email;

    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
    localStorage.setItem('userEmail', resolvedEmail);
    if (resolvedCustomerId) localStorage.setItem('customerId', resolvedCustomerId);

    setToken(token);
    setRole(role);
    setCustomerId(resolvedCustomerId);
    setUserEmail(resolvedEmail);
    return role;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('customerId');
    localStorage.removeItem('userEmail');
    setToken(null);
    setRole(null);
    setCustomerId(null);
    setUserEmail(null);
  }, []);

  const isStaff = role === 'ROLE_STAFF';
  const isCustomer = role === 'ROLE_CUSTOMER';
  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        role,
        customerId,
        userEmail,
        login,
        logout,
        isStaff,
        isCustomer,
        isLoggedIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
