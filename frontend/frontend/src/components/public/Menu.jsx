import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/layout";

const Menu = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/v1/category/getCategories");
        const data = await response.json();
        setCategories(data.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = "http://localhost:3000/api/v1/item/getItems";
        if (category) {
          url = `http://localhost:3000/api/v1/item/getItems/category/${category}`;
        }

        const response = await fetch(url);
        const data = await response.json();
        let items = data.data || [];

        if (sortOption === "low-to-high") {
          items.sort((a, b) => a.price - b.price);
        } else if (sortOption === "high-to-low") {
          items.sort((a, b) => b.price - a.price);
        } else if (sortOption === "above-500") {
          items = items.filter((item) => item.price > 500);
        } else if (sortOption === "below-500") {
          items = items.filter((item) => item.price <= 500);
        } else if (sortOption === "between-1000-2000") {
          items = items.filter((item) => item.price >= 1000 && item.price <= 2000);
        }

        setProducts(items);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category, sortOption]);

  return (
    <>
      <Layout />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="flex p-4 mt-[-40px] h-full">
          {/* Left Sidebar */}
          <div className="w-1/4 mt-10 p-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
              <h2 className="font-bold text-xl mb-4 text-orange-600">
                Product Categories
              </h2>
              <select
                className="border border-gray-300 p-3 w-full mb-4 text-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" className="text-black">
                  All Categories
                </option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id} className="text-black">
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Container */}
          <div className="w-3/4 p-4 mt-10 flex flex-col relative">
            {/* Sorting */}
            <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 mb-6">
              <h2 className="font-bold text-xl mb-4 text-orange-600">
                Sort Products
              </h2>
              <select
                className="border border-gray-300 p-3 w-full text-gray-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="" className="text-black">
                  Default Sorting
                </option>
                <option value="low-to-high" className="text-black">
                  Price: Low to High
                </option>
                <option value="high-to-low" className="text-black">
                  Price: High to Low
                </option>
                <option value="above-500" className="text-black">
                  Price: Above $500
                </option>
                <option value="below-500" className="text-black">
                  Price: Below $500
                </option>
                <option value="between-1000-2000" className="text-black">
                  Price: $1000 - $2000
                </option>
              </select>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
              </div>
            )}

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-4 cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
                    onClick={() => navigate(`/item/details/${product._id}`)}
                  >
                    <div className="relative overflow-hidden rounded-lg mb-4">
                      <img
                        src={`http://localhost:3000/uploads/${product.image}`}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-md hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                        New
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xl text-orange-600">
                        ${product.price}
                      </span>
                      <button className="bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-orange-600 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                ))
              ) : !loading ? (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-500 text-lg mb-4">No products found</div>
                  <p className="text-gray-400">Try adjusting your filters or browse our full collection</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Menu;
