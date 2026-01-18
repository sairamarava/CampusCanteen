import { motion } from "framer-motion";
import { useState } from "react";

const MenuSection = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Signature Wraps & Bites", "Wholesome Bowls & Greens", "The Brew Bar", "Sweet Indulgences", "Waffles", "Snacks"];

  const menuItems = [
    {
      id: 1,
      name: "Classic Grilled Sandwich",
      price: 35,
      category: "Signature Wraps & Bites",
      image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=800",
      description: "Perfectly grilled sandwich with fresh vegetables and cheese",
    },
    {
      id: 2,
      name: "Artisanal Masala Chai",
      price: 20,
      category: "The Brew Bar",
      image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=800",
      description: "Traditional Indian chai brewed with aromatic spices",
    },
  ];

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-black mb-4">Our Menu</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of delicious meals prepared with fresh
            ingredients
          </p>
        </motion.div>

        <div className="flex justify-center space-x-4 mb-8">
          {categories.map((category) => (
            <motion.button
              key={category}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full ${
                selectedCategory === category
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              } transition-colors`}
            >
              {category}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden"
            >
              <div className="relative h-48">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-semibold text-black">
                    {item.name}
                  </h3>
                  <span className="text-lg font-bold text-black">
                    ${item.price}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-900 transition-colors"
                >
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
