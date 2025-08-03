import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { CreditCard, DollarSign, ShoppingBag, User, MapPin, Phone, Mail } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../common/customer/Footer";
import Layout from "../common/customer/layout";

const Checkout = () => {

    const userId = localStorage.getItem("userId");

    const navigate = useNavigate();
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
                <div className="text-center">
                    <ShoppingBag className="text-gray-400 mx-auto mb-4" size={64} />
                    <h2 className="text-2xl font-semibold text-gray-600 mb-2">Your Cart is Empty</h2>
                    <p className="text-gray-500 mb-6">Add some items to your cart before checkout.</p>
                    <button 
                        className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300"
                        onClick={() => navigate('/menu')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        );
    }

    const subtotal = cartItems.reduce((total, item) => total + Number(item.itemId.price) * item.quantity, 0);
    const deliveryCharge = subtotal > 0 ? 5.00 : 0;
    const totalPrice = (subtotal + deliveryCharge).toFixed(2);

    const [paymentMethod, setPaymentMethod] = useState("cod");
    const [billingDetails, setBillingDetails] = useState({
        fullName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        zipCode: "",
    });

    const [cardDetails, setCardDetails] = useState({
        cardNumber: "",
        cvv: "",
        zipCode: "",
    });

    const [showCardForm, setShowCardForm] = useState(false);

    const handleInputChange = (e) => {
        setBillingDetails({ ...billingDetails, [e.target.name]: e.target.value });
    };

    const handleCardInputChange = (e) => {
        setCardDetails({ ...cardDetails, [e.target.name]: e.target.value });
    };

    const handlePaymentChange = (method) => {
        setPaymentMethod(method);
        if (method === "stripe") {
            setShowCardForm(true);
        } else {
            setShowCardForm(false);
        }
    }

    const handleStripePayment = async () => {
        // Validate card details
        if (!cardDetails.cardNumber || !cardDetails.cvv || !cardDetails.zipCode) {
            toast.error('Please fill in all card details.');
            return;
        }

        if (cardDetails.cardNumber.length < 16) {
            toast.error('Please enter a valid card number.');
            return;
        }

        if (cardDetails.cvv.length < 3) {
            toast.error('Please enter a valid CVV.');
            return;
        }

        try {
            // Simulate payment processing
            toast.info('Processing payment...', { autoClose: 2000 });
            
            // Simulate API call delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // For demo purposes, simulate successful payment
            toast.success('Payment processed successfully!', { autoClose: 3000 });

            // Create order data
            const orderData = {
                userId,
                cartItems: cartItems.map(item => ({
                    itemId: item.itemId,
                    price: item.itemId.price,
                    quantity: item.quantity,
                })),
                billingDetails,
                paymentMethod: "stripe",
                subtotal,
                deliveryCharge,
                totalPrice,
                status: "paid",
                stripeSessionId: "demo_session_" + Date.now(),
            };

            // Create order in database
            const response = await fetch("http://localhost:3000/api/v1/order/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                localStorage.removeItem("cartItems");
                toast.success("🎉 Order placed successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                });

                setTimeout(() => {
                    navigate("/checkout/success");
                }, 3000);
            } else {
                toast.error("❌ Error creating order. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Payment error:", error);
            toast.error("❌ Payment failed. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    const handleOrderSubmit = async () => {
        if (totalPrice > 5000.0) {
            toast.error("Amount exceeds the limit of $5000. Please reduce the total price.");
            return;
        }

        if (paymentMethod === "stripe") {
            await handleStripePayment();
            return;
        }

        const orderData = {
            userId,
            cartItems: cartItems.map(item => ({
                itemId: item.itemId,
                price: item.itemId.price,
                quantity: item.quantity,
            })),
            billingDetails,
            paymentMethod,
            subtotal,
            deliveryCharge,
            totalPrice,
            status: "pending",
        };

        try {
            const response = await fetch("http://localhost:3000/api/v1/order/orders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.removeItem("cartItems");
                
                // Clear cart from database
                try {
                    const clearCartResponse = await fetch(`http://localhost:3000/api/v1/cart/clear/${userId}`, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    if (clearCartResponse.ok) {
                        console.log('Cart cleared successfully from database');
                    } else {
                        console.log('Failed to clear cart from database');
                    }
                } catch (error) {
                    console.error('Error clearing cart:', error);
                }
                
                toast.success("Order placed successfully!", {
                    position: "top-right",
                    autoClose: 5000,
                });

                setTimeout(() => {
                    navigate("/checkout/success");
                }, 5000);
            } else {
                toast.error("Error placing order. Please try again.", {
                    position: "top-right",
                    autoClose: 5000,
                });
            }
        } catch (error) {
            console.error("Error:", error);
            toast.error("Network error. Please try again.", {
                position: "top-right",
                autoClose: 5000,
            });
        }
    };

    return (
        <>
            <Layout />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <ShoppingBag className="text-orange-600" size={32} />
                            <h2 className="text-3xl font-bold text-gray-800">Checkout</h2>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                {/* Billing Details */}
                                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-md border border-orange-200">
                                    <div className="flex items-center gap-3 mb-6">
                                        <User className="text-orange-600" size={24} />
                                        <h3 className="text-xl font-semibold text-gray-800">Billing Details</h3>
                                    </div>
                                    <div className="space-y-4">
                                        <input 
                                            type="text" 
                                            name="fullName" 
                                            placeholder="Full Name" 
                                            value={billingDetails.fullName} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-800 placeholder-gray-500" 
                                        />
                                        <input 
                                            type="email" 
                                            name="email" 
                                            placeholder="Email Address" 
                                            value={billingDetails.email} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-800 placeholder-gray-500" 
                                        />
                                        <input 
                                            type="text" 
                                            name="phone" 
                                            placeholder="Phone Number" 
                                            value={billingDetails.phone} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-800 placeholder-gray-500" 
                                        />
                                        <input 
                                            type="text" 
                                            name="address" 
                                            placeholder="Street Address" 
                                            value={billingDetails.address} 
                                            onChange={handleInputChange} 
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-800 placeholder-gray-500" 
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                            <input 
                                                type="text" 
                                                name="city" 
                                                placeholder="City" 
                                                value={billingDetails.city} 
                                                onChange={handleInputChange} 
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-800 placeholder-gray-500" 
                                            />
                                            <input 
                                                type="text" 
                                                name="zipCode" 
                                                placeholder="Zip Code" 
                                                value={billingDetails.zipCode} 
                                                onChange={handleInputChange} 
                                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-800 placeholder-gray-500" 
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-md border border-orange-200">
                                    <div className="flex items-center gap-3 mb-6">
                                        <CreditCard className="text-orange-600" size={24} />
                                        <h3 className="text-xl font-semibold text-gray-800">Payment Method</h3>
                                    </div>
                                    <div className="border border-gray-300 rounded-lg overflow-hidden">
                                        <label className={`flex flex-col p-4 border-b cursor-pointer transition-colors duration-300 ${paymentMethod === "stripe" ? "bg-orange-50 border-orange-200" : "hover:bg-gray-50"}`} onClick={() => handlePaymentChange("stripe")}>
                                            <div className="flex items-center">
                                                <input type="radio" name="paymentMethod" value="stripe" checked={paymentMethod === "stripe"} onChange={() => handlePaymentChange("stripe")} className="hidden" />
                                                <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex justify-center items-center mr-3">
                                                    {paymentMethod === "stripe" && <span className="w-3 h-3 bg-orange-500 rounded-full"></span>}
                                                </span>
                                                <span className="text-gray-800 font-medium">Online Payment</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Secure payment with card details.</p>
                                        </label>

                                        <label className={`flex flex-col p-4 cursor-pointer transition-colors duration-300 ${paymentMethod === "cod" ? "bg-orange-50 border-orange-200" : "hover:bg-gray-50"}`} onClick={() => handlePaymentChange("cod")}>
                                            <div className="flex items-center">
                                                <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === "cod"} onChange={() => handlePaymentChange("cod")} className="hidden" />
                                                <span className="w-5 h-5 border-2 border-gray-400 rounded-full flex justify-center items-center mr-3">
                                                    {paymentMethod === "cod" && <span className="w-3 h-3 bg-orange-500 rounded-full"></span>}
                                                </span>
                                                <span className="text-gray-800 font-medium">Cash on Delivery</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">Pay in cash when your order is delivered.</p>
                                        </label>
                                    </div>

                                    {/* Card Details Form */}
                                    {showCardForm && (
                                        <div className="mt-4 bg-white/80 backdrop-blur-sm p-6 rounded-lg border border-orange-200">
                                            <div className="flex items-center gap-3 mb-4">
                                                <CreditCard className="text-orange-600" size={20} />
                                                <h4 className="text-lg font-semibold text-gray-800">Card Details</h4>
                                            </div>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                                    <input
                                                        type="text"
                                                        name="cardNumber"
                                                        placeholder="1234 5678 9012 3456"
                                                        value={cardDetails.cardNumber}
                                                        onChange={handleCardInputChange}
                                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-800 placeholder-gray-500"
                                                        maxLength="19"
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                                        <input
                                                            type="text"
                                                            name="cvv"
                                                            placeholder="123"
                                                            value={cardDetails.cvv}
                                                            onChange={handleCardInputChange}
                                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-800 placeholder-gray-500"
                                                            maxLength="4"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                                                        <input
                                                            type="text"
                                                            name="zipCode"
                                                            placeholder="12345"
                                                            value={cardDetails.zipCode}
                                                            onChange={handleCardInputChange}
                                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors duration-300 text-gray-800 placeholder-gray-500"
                                                            maxLength="10"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Order Summary */}
                            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-lg shadow-md border border-orange-200">
                                <div className="flex items-center gap-3 mb-6">
                                    <DollarSign className="text-orange-600" size={24} />
                                    <h3 className="text-xl font-semibold text-gray-800">Order Summary</h3>
                                </div>
                                
                                <div className="flex justify-between font-medium border-b border-gray-200 pb-3 mb-4">
                                    <span className="text-gray-700">Product</span>
                                    <span className="text-gray-700">Subtotal</span>
                                </div>

                                <div className="space-y-4 mb-6">
                                    {cartItems.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-4">
                                            <div className="flex items-center space-x-3">
                                                <img 
                                                    src={item.itemId.image ? `http://localhost:3000/uploads/${item.itemId.image}` : undefined} 
                                                    className="w-12 h-12 rounded-lg object-cover shadow-md" 
                                                    alt={item.itemId.name}
                                                />
                                                <div>
                                                    <span className="font-medium text-gray-800">{item.itemId.name}</span>
                                                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <span className="font-semibold text-orange-600">${(item.itemId.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 bg-orange-50 rounded-lg p-4">
                                    <div className="flex justify-between font-medium">
                                        <span className="text-gray-700">Subtotal:</span>
                                        <span className="text-gray-800">${subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-medium">
                                        <span className="text-gray-700">Shipping:</span>
                                        <span className="text-gray-800">${deliveryCharge.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t border-orange-200 pt-3">
                                        <span className="text-gray-800">Total:</span>
                                        <span className="text-orange-600">${totalPrice}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-end">
                            <button 
                                onClick={handleOrderSubmit} 
                                className="bg-orange-500 text-white font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-orange-600 transition-colors duration-300 text-lg"
                            >
                                {paymentMethod === "stripe" ? "Pay Now" : "Confirm Order"}
                            </button>
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
            </div>
            <Footer />
        </>
    );
};

export default Checkout; 