import axios from 'axios';
import { Trash, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import Footer from '../common/customer/Footer';
import Layout from '../common/customer/layout';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get userId from local storage
    const userId = localStorage.getItem("userId");
    const navigate = useNavigate();  // Initialize useNavigate

    useEffect(() => {
        if (userId) {
            // Fetch cart data from API
            axios.get(`http://localhost:3000/api/v1/cart/${userId}`)
                .then(response => {
                    // Accessing items array and setting the state
                    setCartItems(response.data.items); // Assuming response.data.items contains the list of items
                    setLoading(false);
                })
                .catch(err => {
                    setError("Error fetching cart data.");
                    setLoading(false);
                });
        } else {
            setError("No user ID found.");
            setLoading(false);
        }
    }, [userId]);

    const handleProceedToCheckout = async () => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
        navigate("/checkout");

        const userId = localStorage.getItem("userId"); // Retrieve userId

        if (!userId) {
            console.error("Error: No user ID found in local storage.");
            return;
        }

        try {
            await axios.delete(`http://localhost:3000/api/v1/cart/clear/${userId}`);
            setCartItems([]); // Clear the cart state
        } catch (error) {
            console.error("Error clearing cart:", error);
        }
    };

    const handleQuantityChange = async (id, type) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.itemId._id === id
                    ? { ...item, quantity: type === "increase" ? item.quantity + 1 : Math.max(1, item.quantity - 1) }
                    : item
            );
            // Make the API call to update the cart on the server
            const itemToUpdate = updatedItems.find(item => item.itemId._id === id);

            axios.put(`http://localhost:3000/api/v1/cart/update`, {
                customerId: userId,
                itemId: id,
                quantity: itemToUpdate.quantity
            })
                .then(response => {
                    console.log("Cart updated successfully", response.data);
                })
                .catch(error => {
                    console.error("Error updating cart:", error);
                });

            return updatedItems;
        });
    };

    const handleRemoveItem = async (itemId) => {
        const customerId = localStorage.getItem("userId");

        if (!customerId) {
            setError("No user ID found.");
            return;
        }

        try {
            // Make the DELETE request to remove the item from the cart
            const response = await axios.delete(`http://localhost:3000/api/v1/cart/remove/${itemId}`, {
                params: { customerId },
            });

            // Log the response to verify success
            console.log(response.data); // Log response
            toast.success("Item removed from cart successfully.");

            // Update cartItems state by removing the deleted item
            setCartItems((prevItems) => prevItems.filter(item => item.itemId._id !== itemId));

        } catch (error) {
            console.error("Error removing item from cart:", error.response ? error.response.data : error.message);
            setError("Error removing item from cart.");
        }
    };

    // Calculate total prices
    const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? 5.00 : 0; // Set a delivery charge of $5 if subtotal is > $0
    const totalPrice = (subtotal + deliveryCharge).toFixed(2);

    return (
        <>
            <Layout />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
                <div className="max-w-6xl mx-auto p-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <ShoppingCart className="text-orange-600" size={32} />
                            <h2 className="text-3xl font-bold text-gray-800">Shopping Cart</h2>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
                            </div>
                        ) : error ? (
                            <div className="text-center py-12">
                                <p className="text-red-500 text-lg">{error}</p>
                            </div>
                        ) : cartItems.length > 0 ? (
                            <>
                                {/* Cart Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border-collapse">
                                        {/* Table Header */}
                                        <thead>
                                            <tr className="bg-orange-50 border-b-2 border-orange-200">
                                                <th className="p-4 text-left text-gray-800 font-semibold text-lg">Product</th>
                                                <th className="p-4 text-center text-gray-800 font-semibold text-lg">Image</th>
                                                <th className="p-4 text-center text-gray-800 font-semibold text-lg">Price</th>
                                                <th className="p-4 text-center text-gray-800 font-semibold text-lg">Quantity</th>
                                                <th className="p-4 text-center text-gray-800 font-semibold text-lg">Subtotal</th>
                                                <th className="p-4 text-center text-gray-800 font-semibold text-lg">Action</th>
                                            </tr>
                                        </thead>
                                        {/* Table Body */}
                                        <tbody>
                                            {cartItems.map((item) => (
                                                <tr key={`${item.itemId._id}-${item._id}`} className="border-b border-gray-100 hover:bg-orange-50/50 transition-colors">
                                                    <td className="p-4">
                                                        <div className="font-medium text-lg text-gray-800">{item.itemId.name}</div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="relative">
                                                            <img
                                                                src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined}
                                                                alt={item.itemId.name}
                                                                className="w-20 h-20 object-cover rounded-lg mx-auto shadow-md hover:scale-110 transition-transform duration-300"
                                                            />
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="font-bold text-xl text-orange-600">${item.itemId.price}</div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="flex items-center justify-center">
                                                            <button
                                                                className="bg-orange-500 text-white px-3 py-2 rounded-l-lg hover:bg-orange-600 transition-colors duration-300 font-bold"
                                                                onClick={() => handleQuantityChange(item.itemId._id, "decrease")}
                                                                disabled={item.quantity <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-16 py-2 text-center border-t text-black border-b border-orange-500 flex items-center justify-center font-semibold text-lg">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                className="bg-orange-500 text-white px-3 py-2 rounded-r-lg hover:bg-orange-600 transition-colors duration-300 font-bold"
                                                                onClick={() => handleQuantityChange(item.itemId._id, "increase")}
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <div className="font-bold text-xl text-orange-600">
                                                            ${(Number(item.itemId.price) * item.quantity).toFixed(2)}
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-center">
                                                        <button
                                                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-2 mx-auto"
                                                            onClick={() => handleRemoveItem(item.itemId._id)}
                                                            title="Remove from Cart"
                                                        >
                                                            <Trash size={18} />
                                                            <span className="text-sm font-medium">Remove</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                {/* Cart Total Section */}
                                <div className="mt-8 flex justify-end">
                                    <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-lg w-full sm:w-1/3 border border-orange-200">
                                        <h3 className="text-2xl font-bold mb-6 text-gray-800">Cart Summary</h3>
                                        <div className="space-y-4">
                                            <div className="flex justify-between border-b border-gray-200 pb-3">
                                                <span className="text-gray-600 text-lg">Subtotal:</span>
                                                <span className="font-bold text-lg">${subtotal.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between border-b border-gray-200 pb-3">
                                                <span className="text-gray-600 text-lg">Delivery Charge:</span>
                                                <span className="font-bold text-lg">${deliveryCharge.toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between pt-3 text-xl font-bold text-orange-600">
                                                <span>Total:</span>
                                                <span>${totalPrice}</span>
                                            </div>
                                        </div>

                                        {/* Checkout Button */}
                                        <button 
                                            className="w-full mt-6 bg-orange-500 text-white px-6 py-4 rounded-lg shadow-md hover:bg-orange-600 transition-colors duration-300 font-semibold text-lg" 
                                            onClick={handleProceedToCheckout}
                                        >
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-12">
                                <ShoppingCart className="text-gray-400 mx-auto mb-4" size={64} />
                                <h3 className="text-2xl font-semibold text-gray-600 mb-2">Your Cart is Empty</h3>
                                <p className="text-gray-500 mb-6">Start adding your favorite shoes to your cart!</p>
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
                <ToastContainer 
                    position="top-right" 
                    autoClose={3000} 
                    hideProgressBar 
                    theme="light"
                    toastClassName="rounded-lg shadow-lg"
                />
            </div>
            <Footer />
        </>
    );
};

export default Cart;
