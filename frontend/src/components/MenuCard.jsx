import { motion } from "framer-motion";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { toast } from "react-hot-toast";

const MenuCard = ({ item }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const { isAuthenticated } = useAuth();
  const { addToCart, cartItems } = useCart();

  const isItemInCart = cartItems.some((cartItem) => cartItem._id === item._id);

  return (
    <motion.div
      className="bg-white rounded-lg shadow-md overflow-hidden"
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div
        className="relative overflow-hidden"
        style={{ paddingBottom: "75%" }}
      >
        <img
          src={item.imageUrl || item.image}
          alt={item.name}
          className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300"
          style={{
            transform: isHovered ? "scale(1.1)" : "scale(1)",
          }}
        />
        {item.isVegetarian && (
          <div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs">
            Veg
          </div>
        )}
        {(item.isSpicy || item.spicyLevel) && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs">
            {item.spicyLevel
              ? Array(item.spicyLevel).fill("🌶️").join("")
              : "🌶️"}
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {item.description}
        </p>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold">₹{item.price}</span>
            {item.originalPrice && item.originalPrice > item.price && (
              <span className="text-sm text-gray-400 line-through ml-2">
                ₹{item.originalPrice}
              </span>
            )}
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              !isAuthenticated
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : isItemInCart
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-black text-white hover:bg-gray-800"
            }`}
            onClick={async () => {
              if (!isAuthenticated) {
                toast.error("Please login to add items to cart");
                return;
              }

              if (!isAdding) {
                setIsAdding(true);
                try {
                  await addToCart(item);
                  toast.success(`${item.name} added to cart!`);
                } catch (error) {
                  toast.error("Failed to add item to cart");
                } finally {
                  setIsAdding(false);
                }
              }
            }}
            disabled={!isAuthenticated || isAdding}
            title={!isAuthenticated ? "Please login to add items to cart" : ""}
          >
            {isItemInCart ? (
              <span className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                In Cart
              </span>
            ) : (
              <span className="flex items-center">
                {isAdding ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    ></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-1"
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
                )}
                Add to Cart
              </span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default MenuCard;
