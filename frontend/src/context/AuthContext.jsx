import { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, login, logout, register } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const data = await getCurrentUser();
      if (data && data.user) {
        setUser(data.user);
        setError(null);
      } else {
        // Invalid response
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    } catch (error) {
      console.error("Auth check error:", error);
      // Only clear auth state for auth-related errors
      if (error.response?.status === 401 || error.response?.status === 403) {
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
      setError(error.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  // Allow components to update the user in context (e.g., after profile edit)
  const updateUser = (newUser) => {
    setUser(newUser);
    try {
      if (newUser) {
        localStorage.setItem("user", JSON.stringify(newUser));
      } else {
        localStorage.removeItem("user");
      }
    } catch (e) {
      // ignore localStorage errors
    }
  };

  const loginUser = async (email, password) => {
    setError(null);
    try {
      const data = await login(email, password);
      setUser(data.user);
      if (data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const registerUser = async (userData) => {
    setError(null);
    try {
      const data = await register(userData);
      setUser(data.user);
      navigate("/");
      return data;
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      await logout();
      setUser(null);
      setError(null);
      navigate("/login");
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    clearError,
    updateUser,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    isAdmin: user?.role === "admin",
    isAuthenticated: !!user,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
