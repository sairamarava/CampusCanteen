import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { cartItems, getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed w-full bg-light shadow-lg z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">Campus</span>
              <span className="text-2xl font-bold text-accent">Bites</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="text-gray-600 hover:text-black transition-colors"
            >
              Menu
            </Link>
            <Link
              to="/about"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/cart"
              className="text-gray-600 hover:text-primary transition-colors"
            >
              <div className="relative">
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
                      className="absolute -top-2 -right-2 bg-accent text-light rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
                    >
                      {totalItems}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </Link>
            <Link
              to="/profile"
              className="text-gray-600 hover:text-primary transition-colors"
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="text-gray-600 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
                className="text-gray-600 hover:text-primary transition-colors px-3 py-2 rounded-md"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Navigation Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-primary focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-light"
        >
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/menu"
              className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
            >
              Menu
            </Link>
            <Link
              to="/about"
              className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              to="/cart"
              className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
            >
              <div className="flex items-center justify-between">
                <span>Cart</span>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-2 bg-accent text-light rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </div>
            </Link>
            <Link
              to="/profile"
              className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
            >
              Profile
            </Link>
            {isAuthenticated && user?.role === "admin" && (
              <Link
                to="/admin/dashboard"
                className="block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
            )}
            {isAuthenticated && (
              <button
                onClick={async () => {
                  await logout();
                  navigate("/login");
                }}
                className="w-full text-left block px-3 py-2 text-gray-600 hover:text-primary transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;
