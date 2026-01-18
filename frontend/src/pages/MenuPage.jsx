import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MenuCard from "../components/MenuCard";
import { getMenuItems, getMenuCategories } from "../services/api";
import { useCart } from "../context/CartContext";

const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([
    "Signature Wraps & Bites",
    "Wholesome Bowls & Greens",
    "The Brew Bar",
    "Sweet Indulgences",
    "Waffles",
    "Snacks",
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [priceFilter, setPriceFilter] = useState("all");
  const [dietaryFilter, setDietaryFilter] = useState("all");
  const { addToCart } = useCart();

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      console.log("Fetching menu data...");
      const [itemsData, categoriesData] = await Promise.all([
        getMenuItems(),
        getMenuCategories(),
      ]);
      console.log("Received menu items:", itemsData);
      console.log("Received categories:", categoriesData);

      if (Array.isArray(itemsData)) {
        setMenuItems(itemsData);
      } else {
        console.error("Invalid menu items data structure:", itemsData);
        setError("Menu data format is invalid");
      }

      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else {
        console.error("Invalid categories data structure:", categoriesData);
      }
    } catch (err) {
      console.error("Error fetching menu data:", err);
      setError("Failed to load menu items. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPrice =
      priceFilter === "all" ||
      (priceFilter === "under-100" && item.price < 100) ||
      (priceFilter === "100-200" && item.price >= 100 && item.price <= 200) ||
      (priceFilter === "over-200" && item.price > 200);
    const matchesDietary =
      dietaryFilter === "all" ||
      (dietaryFilter === "veg" && item.isVegetarian) ||
      (dietaryFilter === "non-veg" && !item.isVegetarian);

    return matchesCategory && matchesSearch && matchesPrice && matchesDietary;
  });

  const handleAddToCart = (item) => {
    addToCart(item);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">Oops!</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Menu</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our delicious selection of campus favorites, made fresh and
          delivered fast.
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search menu..."
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <select
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* Price Filter */}
          <select
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="all">All Prices</option>
            <option value="under-100">Under ₹100</option>
            <option value="100-200">₹100 - ₹200</option>
            <option value="over-200">Over ₹200</option>
          </select>

          {/* Dietary Filter */}
          <select
            className="px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
            value={dietaryFilter}
            onChange={(e) => setDietaryFilter(e.target.value)}
          >
            <option value="all">All Types</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
          </select>
        </div>
      </div>

      {/* Menu Grid */}
      <AnimatePresence mode="wait">
        {filteredItems.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredItems.map((item) => (
              <MenuCard
                key={item._id}
                item={item}
                onAddToCart={handleAddToCart}
              />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No items found matching your criteria.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MenuPage;
