import axios from "axios";

const API_URL =
  process.env.NODE_ENV === "production"
    ? "https://your-backend-app-name.onrender.com/api" // Update this after Render deployment
    : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
      // Set a default timeout
      config.timeout = 10000; // 10 seconds
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling auth errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";

    // Handle auth errors only for specific cases
    if (
      error.response?.status === 401 &&
      !error.config.url.includes("/auth/me")
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    // Handle server errors
    if (error.response?.status === 500) {
      console.error("Server Error:", error);
    }

    return Promise.reject(message);
  }
);

// Auth Services
export const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    if (response && response.token) {
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
    return response;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  if (response.success && response.user) {
    const token = response.token;
    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(response.user));
    }
  }
  return response;
};

export const logout = async () => {
  await api.post("/auth/logout");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getCurrentUser = async () => {
  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!token || !storedUser) {
    throw new Error("No user found");
  }

  try {
    const response = await api.get("/auth/me");
    if (response.user) {
      localStorage.setItem("user", JSON.stringify(response.user));
      return response;
    }
    throw new Error("Invalid user data");
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    throw error;
  }
};

// Menu Services
export const getMenuItems = (params) => api.get("/menu", { params });
export const getMenuCategories = () => api.get("/menu/categories");
export const getMenuItem = (id) => api.get(`/menu/${id}`);
export const rateMenuItem = (id, rating) =>
  api.post(`/menu/${id}/rate`, rating);

// Cart Services
export const getCart = () => api.get("/cart");
export const addToCart = (item, quantity = 1) =>
  api.post("/cart/add", { itemId: item._id, quantity, item });
export const removeFromCart = (itemId) => api.delete(`/cart/${itemId}`);
export const updateCartItemQuantity = (itemId, quantity) =>
  api.put(`/cart/${itemId}`, { quantity });
export const clearCart = () => api.delete("/cart");

// Order Services
export const createOrder = (orderData) => api.post("/orders", orderData);
export const getUserOrders = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }
  return api.get("/orders/my-orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
export const getOrderDetails = (id) => api.get(`/orders/${id}`);
export const cancelOrder = (id) => api.post(`/orders/${id}/cancel`);

// User Services
export const updateProfile = async (userData) => {
  const response = await api.put("/user/profile", userData);
  return response;
};

export const changePassword = async (passwords) => {
  const response = await api.put("/user/change-password", passwords);
  return response;
};

export const getFavorites = async () => {
  const response = await api.get("/user/favorites");
  return response.favoriteItems;
};

export const addToFavorites = async (menuItemId) => {
  const response = await api.post(`/user/favorites/${menuItemId}`);
  return response.favoriteItems;
};

export const removeFromFavorites = async (menuItemId) => {
  const response = await api.delete(`/user/favorites/${menuItemId}`);
  return response.favoriteItems;
};

// Admin Services
export const getAdminStats = () => api.get("/admin/stats");
export const getAllOrders = (params) => api.get("/admin/orders", { params });
export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status });
export const getDailyOrdersArchive = (date) =>
  api.get(`/admin/orders`, {
    params: { date },
  });
export const generateDailyReport = (date) =>
  api.get(`/admin/orders/report/${date}`, {
    responseType: "blob",
    headers: {
      Accept: "application/pdf",
    },
  });
export const addMenuItem = (menuData) => api.post("/admin/menu", menuData);
export const updateMenuItem = (id, menuData) =>
  api.put(`/admin/menu/${id}`, menuData);
export const deleteMenuItem = (id) => api.delete(`/admin/menu/${id}`);

// Notification Services
export const getUnreadNotifications = () => api.get("/notifications/unread");
export const markNotificationAsRead = (id) =>
  api.put(`/notifications/${id}/read`);
export const markAllNotificationsAsRead = () =>
  api.put("/notifications/mark-all-read");
export const deleteNotification = (id) => api.delete(`/notifications/${id}`);
