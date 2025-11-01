import { createContext, useContext, useState, useEffect } from "react";
import {
  getCart,
  addToCart as addToCartAPI,
  removeFromCart as removeFromCartAPI,
  updateCartItemQuantity,
  clearCart as clearCartAPI,
} from "../services/api";
import { useAuth } from "./AuthContext";
import { toast } from "react-hot-toast";

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Fetch cart items when user logs in
  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  const fetchCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = await getCart();
      // Filter out any invalid items and ensure all required fields exist
      const validItems = (data.items || [])
        .filter(
          (item) =>
            item && item._id && item.name && typeof item.price !== "undefined"
        )
        .map((item) => ({
          ...item,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
          cartItemId: item.cartItemId || `${item._id}_${Date.now()}`,
        }));

      setCartItems(validItems);
    } catch (error) {
      console.error("Error fetching cart:", error);
      toast.error("Failed to fetch cart items");
      setCartItems([]); // Reset to empty cart on error
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item) => {
    if (!user) {
      toast.error("Please log in to add items to cart");
      return;
    }

    if (!item || !item._id || !item.name || !item.price) {
      toast.error("Invalid item data");
      return;
    }

    setLoading(true);
    try {
      // Add full item details to the cart
      const itemToAdd = {
        _id: item._id,
        name: item.name,
        price: parseFloat(item.price),
        imageUrl: item.imageUrl || item.image,
        quantity: 1,
        cartItemId: `${item._id}_${Date.now()}`, // Unique ID for React keys
      };

      const existingItem = cartItems.find(
        (cartItem) => cartItem && cartItem._id === item._id
      );

      if (existingItem) {
        // If item exists, update quantity
        const updatedItems = cartItems.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: (parseInt(cartItem.quantity) || 0) + 1 }
            : cartItem
        );
        setCartItems(updatedItems);
      } else {
        // If item doesn't exist, add it
        setCartItems([...cartItems, itemToAdd]);
      }

      // Sync with backend
      const response = await addToCartAPI(item);
      if (response && response.items) {
        // Update cart with server response
        setCartItems(
          response.items.map((item) => ({
            ...item,
            cartItemId: item.cartItemId || `${item._id}_${Date.now()}`,
          }))
        );
      }
      toast.success(`${item.name} added to cart!`);
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
      // Refresh cart from server on error
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    if (!user || !itemId) return;

    setLoading(true);
    try {
      // Store current items for potential rollback
      const previousItems = [...cartItems];

      // Optimistically update UI
      setCartItems((currentItems) =>
        currentItems.filter((item) => item && item._id !== itemId)
      );

      // Sync with backend
      const response = await removeFromCartAPI(itemId);

      if (response && response.items) {
        // Process and validate the server response items
        const validItems = response.items
          .filter((item) => item && item._id)
          .map((item) => ({
            ...item,
            quantity: parseInt(item.quantity) || 1,
            price: parseFloat(item.price) || 0,
            cartItemId: item.cartItemId || `${item._id}_${Date.now()}`,
          }));
        setCartItems(validItems);
      }

      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing from cart:", error);
      toast.error("Failed to remove item from cart");
      setCartItems(previousItems); // Revert to previous state on error
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    if (!user) return;
    if (quantity < 1) return;

    setLoading(true);
    try {
      // Optimistically update UI first
      setCartItems((currentItems) =>
        currentItems.map((item) =>
          item._id === itemId ? { ...item, quantity: parseInt(quantity) } : item
        )
      );

      // Then sync with backend
      const response = await updateCartItemQuantity(itemId, quantity);

      if (response && response.items) {
        setCartItems(response.items);
      }
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
      // Revert optimistic update on error
      await fetchCart();
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await clearCartAPI();
      setCartItems([]);
      toast.success("Cart cleared");
    } catch (error) {
      console.error("Error clearing cart:", error);
      toast.error("Failed to clear cart");
    } finally {
      setLoading(false);
    }
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    if (!cartItems || cartItems.length === 0) return "0.00";

    return cartItems
      .filter((item) => item && item._id && item.price && item.quantity)
      .reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + price * quantity;
      }, 0)
      .toFixed(2);
  };

  const value = {
    cartItems,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;
