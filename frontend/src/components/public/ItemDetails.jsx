import axios from "axios";
import { useEffect, useState } from "react";
import { FaHeart } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/Layout";

const ItemDetails = () => {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(true);
    const [isWishlisted, setIsWishlisted] = useState(false);

    // Get customerId from localStorage
    const getCustomerId = () => localStorage.getItem("userId");

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/api/v1/item/getItem/${id}`);
                console.log("Fetched item data:", response.data.data);
                setItem(response.data.data);
            } catch (error) {
                console.error("Error fetching item:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchItemDetails();
    }, [id]);

    useEffect(() => {
        const customerId = getCustomerId();
        if (!customerId || !item) return;

        axios.get(`http://localhost:3000/api/v1/wishlist/check/${item._id}`, { params: { customerId } })
            .then((res) => {
                console.log("Wishlist status:", res.data.isWishlisted);
                setIsWishlisted(res.data.isWishlisted);
            })
            .catch((err) => console.error("Error checking wishlist:", err));
    }, [item]);

    const toggleWishlist = async () => {
        const customerId = getCustomerId();
        if (!customerId) {
            toast.error("Please log in to manage your wishlist.");
            return;
        }
        try {
            if (isWishlisted) {
                await axios.delete(`http://localhost:3000/api/v1/wishlist/remove/${item._id}`, { params: { customerId } });

            } else {
                await axios.post(`http://localhost:3000/api/v1/wishlist/add`, { customerId, itemId: item._id });

            }
            setIsWishlisted((prev) => !prev);
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            toast.error("Failed to update wishlist.");
        }
    };

    const addToCart = async () => {
        const customerId = getCustomerId();
        if (!customerId) {
            toast.error("Please log in to add items to your cart.");
            return;
        }
        try {
            await axios.post(`http://localhost:3000/api/v1/cart/add`, {
                customerId,
                itemId: item._id,
                quantity,
            });
            toast.success("Item added to cart successfully.");
        } catch (error) {
            console.error("Error adding to cart:", error);
            toast.error("Failed to add item to cart.");
        }
    };

    const handleQuantityChange = (type) => {
        setQuantity((prev) => (type === "increase" ? prev + 1 : Math.max(1, prev - 1)));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
                <div className="flex items-center space-x-2">
                    <svg className="animate-spin h-5 w-5 text-orange-600" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                    </svg>
                    <span className="text-gray-700">Loading product details...</span>
                </div>
            </div>
        );
    }
    
    if (!item) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-2">Product Not Found</h2>
                    <p className="text-gray-600">The product you're looking for doesn't exist.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Layout />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                            {/* Image Section */}
                            <div className="relative">
                                <img
                                    src={`http://localhost:3000/uploads/${item.image}`}
                                    className="w-full h-[400px] object-cover rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                                    alt={item.name} 
                                />
                                <button 
                                    className={`absolute top-4 right-4 bg-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ${
                                        isWishlisted ? "text-red-500" : "text-orange-500"
                                    }`} 
                                    onClick={toggleWishlist}
                                >
                                    <FaHeart size={24} />
                                </button>
                            </div>

                            {/* Details Section */}
                            <div className="flex flex-col justify-center space-y-6">
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-800 mb-4">{item.name}</h2>
                                    <span className="text-orange-600 font-bold text-3xl">
                                        ${parseFloat(item.price).toLocaleString()}
                                    </span>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-6">
                                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Product Description</h3>
                                    <p className="text-gray-700 leading-relaxed text-lg">{item.description}</p>
                                </div>

                                {/* Quantity and Add to Cart */}
                                <div className="space-y-6">
                                    <div className="flex items-center space-x-4">
                                        <span className="text-gray-700 font-medium">Quantity:</span>
                                        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                            <button
                                                className="bg-orange-500 text-white px-4 py-3 hover:bg-orange-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                                onClick={() => handleQuantityChange("decrease")}
                                                disabled={quantity <= 1}
                                            >
                                                -
                                            </button>
                                            <span className="w-16 h-12 flex items-center justify-center text-lg font-medium bg-orange-50 text-gray-800">
                                                {quantity}
                                            </span>
                                            <button
                                                className="bg-orange-500 text-white px-4 py-3 hover:bg-orange-600 transition-colors duration-300"
                                                onClick={() => handleQuantityChange("increase")}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        className="w-full bg-orange-500 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-orange-600 transition-colors duration-300 text-lg" 
                                        onClick={addToCart}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer 
                position="top-right" 
                autoClose={3000} 
                hideProgressBar 
                theme="light"
                toastClassName="rounded-lg shadow-lg"
            />
            <Footer />
        </>
    );
};

export default ItemDetails;
