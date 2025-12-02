import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const controls = useAnimation();
  const [ref, inView] = useInView();

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const featuredItems = [
    {
      id: 1,
      name: "Chicken Wings",
      description: "Spicy chicken wings with blue cheese dipping sauce",
      price: "$9.99",
      prepTime: "12 min",
      image:
        "https://images.unsplash.com/photo-1608039755401-742074f0548d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      featured: true,
    },
    {
      id: 2,
      name: "Pizza Margherita",
      description: "Fresh tomato sauce, mozzarella, and basil",
      price: "$12.99",
      prepTime: "15 min",
      image:
        "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      featured: true,
    },
    {
      id: 3,
      name: "Caesar Salad",
      description: "Crisp romaine lettuce with caesar dressing and croutons",
      price: "$8.99",
      prepTime: "8 min",
      image:
        "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60",
      featured: true,
    },
  ];

  return (
    <div className="bg-light">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center text-center bg-primary">
        <div className="relative z-10 px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold text-light mb-8">
              Delicious Campus
              <br />
              Meals, <span className="text-accent">Delivered Fast</span>
            </h1>
            <p className="text-xl sm:text-2xl text-gray-200 mb-12 max-w-2xl mx-auto">
              Skip the cafeteria lines. Order your favorite
              <br />
              meals and pick them up when they're ready.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/menu")}
              className="bg-light text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              Browse Menu
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <motion.section
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="py-24 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-light rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Quick Ordering
              </h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                Place your order in seconds and skip the waiting lines
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-light rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Fresh & Tasty
              </h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                Every meal is prepared fresh when you order
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="text-center">
              <div className="bg-light rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Secure Payments
              </h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                Safe and secure payment processing for peace of mind
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Featured Items Section */}
      <motion.section
        variants={containerVariants}
        initial="hidden"
        animate={controls}
        className="py-24 bg-light"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Featured Items
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Check out our most popular dishes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredItems.map((item, index) => (
              <motion.div
                key={item.id}
                variants={itemVariants}
                className="bg-light rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-48 object-cover"
                  />
                  {item.featured && (
                    <span className="absolute top-4 left-4 bg-accent text-light px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 mb-4 text-sm">
                    {item.description}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-primary">
                      {item.price}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {item.prepTime}
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-light py-3 rounded-lg font-medium hover:bg-dark transition-colors inline-flex items-center justify-center gap-2"
                    onClick={() => navigate("/menu")}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    Add
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/menu")}
              className="bg-primary text-light px-8 py-3 rounded-lg font-semibold hover:bg-dark transition-colors"
            >
              View Full Menu
            </motion.button>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default HomePage;
