import axios from "axios";
import { ShoppingCart, Trash, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';

const API_BASE_URL = "http://localhost:3000/api/v1/wishlist";

const Wishlist = () => {
    const [wishlistItems, setWishlistItems] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const [customerId, setCustomerId] = useState(null);  // Store userId from localStorage

    // Fetch userId from localStorage on component mount
    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
            setCustomerId(storedUserId);
            fetchWishlist(storedUserId);  // Fetch wishlist for this user
        }
    }, []);

    // Fetch Wishlist Items from API
    const fetchWishlist = async (id) => {
        try {
            const response = await axios.get(`${API_BASE_URL}/customer/${id}`);
            setWishlistItems(response.data.wishlist.map(item => ({
                ...item,
                itemId: { ...item.itemId, price: Number(item.itemId.price) }
            })));
        } catch (error) {
            console.error("Error fetching wishlist:", error);
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/remove/${itemId}`, { params: { customerId } });
            console.log(response.data); // Log the response to check success message

            // Directly update the wishlistItems state by removing the deleted item
            setWishlistItems((prevItems) => prevItems.filter(item => item._id !== itemId));
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };


    // Handle Move Item to Cart
    const handleMoveToCart = async (item) => {
        try {
            // Simulate adding item to cart
            setCartItems(prevItems => [...prevItems, { ...item, quantity: 1 }]);
            // Remove item from wishlist after moving it to cart
            await handleRemoveItem(item._id);
        } catch (error) {
            console.error("Error moving to cart:", error);
        }
    };

    return (
        <>
            <Layout />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <Heart className="text-orange-600" size={32} />
                            <h2 className="text-3xl font-bold text-gray-800">My Wishlist</h2>
                        </div>

                        {wishlistItems.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-orange-50 border-b-2 border-orange-200">
                                            <th className="p-4 text-left text-gray-800 font-semibold text-lg">Product</th>
                                            <th className="p-4 text-center text-gray-800 font-semibold text-lg">Image</th>
                                            <th className="p-4 text-center text-gray-800 font-semibold text-lg">Price</th>
                                            <th className="p-4 text-center text-gray-800 font-semibold text-lg">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {wishlistItems.map((item) => (
                                            <tr key={item._id} className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors">
                                                <td className="p-4 text-gray-800">
                                                    <div className="font-medium text-lg">{item.itemId.name}</div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="relative">
                                                        <img 
                                                            src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined} 
                                                            className="w-20 h-20 object-cover rounded-lg mx-auto shadow-md hover:scale-110 transition-transform duration-300" 
                                                            alt={item.itemId.name}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="font-bold text-xl text-orange-600">
                                                        ${item.itemId.price.toFixed(2)}
                                                    </div>
                                                </td>
                                                <td className="p-4 text-center">
                                                    <div className="flex items-center justify-center gap-3">
                                                        <button
                                                            className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300 flex items-center gap-2"
                                                            onClick={() => handleMoveToCart(item)}
                                                            title="Move to Cart"
                                                        >
                                                            <ShoppingCart size={18} />
                                                            <span className="text-sm font-medium">Add to Cart</span>
                                                        </button>
                                                        <button
                                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-2"
                                                            onClick={() => handleRemoveItem(item._id)}
                                                            title="Remove from Wishlist"
                                                        >
                                                            <Trash size={18} />
                                                            <span className="text-sm font-medium">Remove</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Heart className="text-gray-400 mx-auto mb-4" size={64} />
                                <h3 className="text-2xl font-semibold text-gray-600 mb-2">Your Wishlist is Empty</h3>
                                <p className="text-gray-500 mb-6">Start adding your favorite shoes to your wishlist!</p>
                                <button 
                                    className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300 font-medium"
                                    onClick={() => window.location.href = '/menu'}
                                >
                                    Start Shopping
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Wishlist;
