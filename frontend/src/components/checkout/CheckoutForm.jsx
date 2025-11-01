import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { createOrder } from "../../services/api";
import { toast } from "react-hot-toast";

const CheckoutForm = () => {
  const navigate = useNavigate();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    building: "",
    roomNumber: "",
    landmark: "",
    paymentMethod: "Cash",
    specialInstructions: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          menuItem: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount: getTotalPrice(),
        paymentMethod: formData.paymentMethod,
        deliveryLocation: {
          building: formData.building,
          roomNumber: formData.roomNumber,
          landmark: formData.landmark,
        },
        specialInstructions: formData.specialInstructions,
      };

      const response = await createOrder(orderData);

      if (response.success) {
        await clearCart();
        toast.success("Order placed successfully!");
        navigate("/profile?tab=orders");
      } else {
        throw new Error(response.message || "Failed to place order");
      }
    } catch (error) {
      toast.error(error.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-semibold mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate("/menu")}
          className="bg-black text-white px-6 py-2 rounded-md hover:bg-gray-800"
        >
          Browse Menu
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto p-6"
    >
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="mb-8 bg-white p-4 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Order Summary</h3>
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between mb-2">
            <span>
              {item.quantity}x {item.name}
            </span>
            <span>₹{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="border-t mt-4 pt-4">
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>₹{getTotalPrice().toFixed(2)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Building/Block Name*
          </label>
          <input
            type="text"
            name="building"
            value={formData.building}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-black focus:border-black"
            placeholder="Enter building name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Number*
          </label>
          <input
            type="text"
            name="roomNumber"
            value={formData.roomNumber}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-black focus:border-black"
            placeholder="Enter room number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Landmark/Additional Details
          </label>
          <input
            type="text"
            name="landmark"
            value={formData.landmark}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-black focus:border-black"
            placeholder="Enter any landmark or additional details"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Method*
          </label>
          <select
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring-black focus:border-black"
          >
            <option value="Cash">Cash on Delivery</option>
            <option value="Online">Online Payment</option>
            <option value="Card">Card on Delivery</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Instructions
          </label>
          <textarea
            name="specialInstructions"
            value={formData.specialInstructions}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring-black focus:border-black"
            placeholder="Any special instructions for your order?"
            rows="3"
          />
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            "Place Order"
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;
