import { motion } from "framer-motion";

const CartPage = () => {
  const cartItems = [
    {
      id: 1,
      name: "Classic Burger",
      price: 5.99,
      quantity: 2,
      image: "/images/burger.jpg",
    },
    // Add more items as needed
  ];

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = 1.5;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-black mb-8"
        >
          Your Cart
        </motion.h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-white rounded-lg shadow-sm p-4 flex items-center"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="ml-4 flex-grow">
                      <h3 className="text-lg font-semibold text-black">
                        {item.name}
                      </h3>
                      <p className="text-gray-600">${item.price.toFixed(2)}</p>
                      <div className="flex items-center mt-2">
                        <button className="bg-gray-100 text-black px-3 py-1 rounded-l-lg">
                          -
                        </button>
                        <span className="bg-gray-100 px-4 py-1">
                          {item.quantity}
                        </span>
                        <button className="bg-gray-100 text-black px-3 py-1 rounded-r-lg">
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-black">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <button className="text-red-500 hover:text-red-600 mt-2">
                        Remove
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-white rounded-lg">
                <p className="text-gray-600">Your cart is empty</p>
                <button className="mt-4 bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-900">
                  Browse Menu
                </button>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-black mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-black font-semibold">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-900"
            >
              Proceed to Checkout
            </motion.button>
            <div className="mt-4 text-center text-sm text-gray-500">
              Need help? Contact our support
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
