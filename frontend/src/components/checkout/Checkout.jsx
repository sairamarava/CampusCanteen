import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { createOrder } from "../../services/api";

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, getTotalPrice, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [lastOrderTime, setLastOrderTime] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [orderDetails, setOrderDetails] = useState(null);
  const [formData, setFormData] = useState({
    rollNumber: user?.rollNumber || "",
    name: user?.name || "",
    paymentMethod: "CASH",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateOrder = () => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    // Validate cart items
    const validItems = cartItems.filter(
      (item) => item && item._id && item.quantity > 0
    );
    if (validItems.length === 0) {
      toast.error("No valid items in cart");
      return false;
    }

    // Validate student details
    if (!formData.rollNumber.trim() || !formData.name.trim()) {
      toast.error("Please enter your roll number and name");
      return false;
    }

    // Validate total amount
    const totalAmount = getTotalPrice();
    if (totalAmount <= 0) {
      toast.error("Invalid order total");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateOrder()) {
      return;
    }

    // Show confirmation dialog
    if (!window.confirm("Are you sure you want to place this order?")) {
      return;
    }

    // Rate limiting - prevent rapid order submissions
    const now = Date.now();
    if (now - lastOrderTime < 10000) {
      // 10 seconds cooldown
      toast.error("Please wait a moment before placing another order");
      return;
    }
    setLastOrderTime(now);

    try {
      setLoading(true);
      // Validate cart items again before creating order
      const validItems = cartItems.filter(
        (item) => item && item._id && item.quantity > 0
      );

      const orderData = {
        items: validItems.map((item) => ({
          menuItem: item._id,
          quantity: parseInt(item.quantity) || 1,
          price: parseFloat(item.price) || 0,
          name: item.name,
        })),
        totalAmount: getTotalPrice(),
        studentDetails: {
          rollNumber: formData.rollNumber,
          name: formData.name,
        },
        paymentMethod: formData.paymentMethod,
      };

      // Create the order
      const response = await createOrder(orderData);

      console.log("Order response:", response); // Debug log

      // Clear the cart only if order creation was successful
      if (response && response.order) {
        await clearCart();

        // Calculate estimated time (15 minutes from now as default)
        const estimatedTime = response.order.estimatedDeliveryTime 
          ? new Date(response.order.estimatedDeliveryTime).toLocaleTimeString()
          : new Date(Date.now() + 15 * 60000).toLocaleTimeString();

        // Store order details and show modal
        setOrderDetails({
          orderNumber: response.order.orderNumber || "N/A",
          estimatedTime: estimatedTime,
        });
        setShowSuccessModal(true);

        // Log order creation for analytics
        console.log("Order placed:", {
          orderId: response.order._id,
          orderNumber: response.order.orderNumber,
          items: response.order.items?.length || 0,
          total: response.order.totalAmount,
        });
      } else {
        console.error("Order creation failed:", response);
        toast.error("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Order placement error:", error);
      toast.error("Failed to place order. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Validate if cart has valid items
  const validCartItems = cartItems.filter(
    (item) => item && item._id && item.quantity > 0
  );

  return (
    <>
      {/* Success Modal - Render at top level so it shows even when cart is empty */}
      {showSuccessModal && orderDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Order Placed Successfully!
            </h2>
            <div className="text-gray-600 mb-6">
              <p className="text-lg font-semibold text-primary">
                Order #{orderDetails.orderNumber}
              </p>
            </div>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                navigate("/");
              }}
              className="w-full bg-primary text-white font-semibold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {validCartItems.length === 0 ? (
        <div className="max-w-2xl mx-auto py-8 px-4 text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h1>
          <p className="text-gray-600 mb-8">
            Add some items to your cart to proceed with checkout.
          </p>
          <button
            onClick={() => navigate("/menu")}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Browse Menu
          </button>
        </div>
      ) : (
        <div className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-semibold text-gray-900 mb-8">Checkout</h1>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Order Summary
        </h2>
        <div className="space-y-4">
          {validCartItems.map((item) => (
            <div
              key={item.cartItemId || `${item._id}_${item.quantity}`}
              className="flex justify-between items-center"
            >
              <div>
                <p className="text-gray-800">{item.name}</p>
                <p className="text-sm text-gray-500">
                  Quantity: {parseInt(item.quantity) || 0}
                </p>
              </div>
              <p className="text-gray-800">
                ₹{(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
              </p>
            </div>
          ))}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-semibold">
              <p>Total</p>
              <p>₹{getTotalPrice()}</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Student Details
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Roll Number
            </label>
            <input
              type="text"
              name="rollNumber"
              value={formData.rollNumber}
              onChange={handleChange}
              required
              placeholder="Enter your roll number"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Method
            </label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
            >
              <option value="CASH">Cash on Delivery</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || cartItems.length === 0}
          className="mt-6 w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
        >
          {loading ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
      )}
    </>
  );
};

export default Checkout;
