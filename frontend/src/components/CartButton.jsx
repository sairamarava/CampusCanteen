import { useCart } from "../context/CartContext";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CartModal from "./CartModal";

const CartButton = () => {
  const { cartItems, getTotalItems } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  const totalItems = getTotalItems();

  useEffect(() => {
    if (totalItems > 0) {
      setIsHighlighted(true);
      const timer = setTimeout(() => setIsHighlighted(false), 300);
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <>
      <motion.button
        onClick={() => setIsCartOpen(true)}
        className={`fixed bottom-4 right-4 z-40 flex items-center justify-center p-4 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors ${
          isHighlighted ? "ring-4 ring-green-400 ring-opacity-50" : ""
        }`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{
          scale: isHighlighted ? 1.2 : 1,
          transition: { duration: 0.2 },
        }}
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
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        <AnimatePresence>
          {totalItems > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold"
            >
              {totalItems}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default CartButton;
