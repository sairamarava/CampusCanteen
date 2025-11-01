import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../context/CartContext";
import { useState } from "react";

const Cart = () => {
  const { cartItems, loading, removeFromCart, updateQuantity, getTotalPrice } =
    useCart();
  const [error, setError] = useState(false);

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error loading cart items. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-center">Your cart is empty</p>
      ) : (
        <>
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {cartItems
                .filter((item) => item && item._id)
                .map((item) => (
                  <motion.div
                    key={item.cartItemId || item._id}
                    layout="position"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between bg-white p-4 rounded-lg shadow overflow-hidden"
                  >
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.imageUrl || item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        <p className="text-gray-600">₹{item.price}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            const newQuantity = Math.max(
                              1,
                              parseInt(item.quantity) - 1
                            );
                            updateQuantity(item._id, newQuantity);
                          }}
                          disabled={parseInt(item.quantity) <= 1}
                          className={`p-1 rounded-full transition-colors ${
                            parseInt(item.quantity) <= 1
                              ? "text-gray-300 cursor-not-allowed"
                              : "hover:bg-gray-100 active:bg-gray-200"
                          }`}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M20 12H4"
                            />
                          </svg>
                        </motion.button>
                        <span className="w-8 text-center font-medium">
                          {parseInt(item.quantity) || 0}
                        </span>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={() => {
                            const newQuantity = parseInt(item.quantity) + 1;
                            updateQuantity(item._id, newQuantity);
                          }}
                          className="p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                        </motion.button>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={async () => {
                          try {
                            await removeFromCart(item._id);
                          } catch (error) {
                            // Error is already handled in CartContext
                          }
                        }}
                        className="text-red-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors"
                        title="Remove from cart"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
            </AnimatePresence>
          </div>
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <div className="flex justify-between mb-4">
              <span className="font-semibold">Total:</span>
              <span className="font-bold">₹{getTotalPrice()}</span>
            </div>
            <button
              onClick={() => (window.location.href = "/checkout")}
              className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
