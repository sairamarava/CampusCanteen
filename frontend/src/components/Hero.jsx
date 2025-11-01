import { motion } from "framer-motion";

const Hero = () => {
  return (
    <div className="relative h-screen flex items-center justify-center bg-black">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/images/hero-bg.jpg"
          alt="Food background"
          className="w-full h-full object-cover opacity-50"
        />
      </div>

      <div className="relative z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <h1 className="text-4xl md:text-6xl font-bold text-white">
            Delicious Food,
            <br />
            <span className="text-gray-300">Delivered Fast</span>
          </h1>

          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Order from your favorite campus spots and get your food delivered
            within minutes
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Order Now
          </motion.button>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-10 left-0 right-0 flex justify-center"
      >
        <div className="grid grid-cols-3 gap-8 bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold">10+</h3>
            <p className="text-gray-300">Food Spots</p>
          </div>
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold">15 min</h3>
            <p className="text-gray-300">Delivery Time</p>
          </div>
          <div className="text-center text-white">
            <h3 className="text-2xl font-bold">4.8★</h3>
            <p className="text-gray-300">Rating</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
