import { Search, ShoppingCart, User, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { VscHeart } from "react-icons/vsc";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";

const Navbar = () => {
    const navigate = useNavigate();
    const { isAuthenticated, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogout = () => {
        confirmAlert({
            title: "Confirm Logout",
            message: "Are you sure you want to sign out of your ShoeHub account?",
            buttons: [
                {
                    label: "Yes, Sign Out",
                    onClick: () => {
                        logout(); // Use the AuthContext logout function
                        navigate("/"); // Navigate to home page
                    },
                    className: "bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors duration-300",
                },
                {
                    label: "Cancel",
                    className: "bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-300",
                },
            ],
            closeOnClickOutside: true,
            closeOnEscape: true,
            overlayClassName: "bg-black bg-opacity-50",
            customUI: ({ title, message, onClose, buttons }) => {
                return (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                            <div className="flex items-center gap-3 mb-4">
                                <LogOut className="text-orange-600" size={24} />
                                <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
                            </div>
                            <p className="text-gray-600 mb-6">{message}</p>
                            <div className="flex gap-3 justify-end">
                                {buttons.map((button, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            button.onClick();
                                            onClose();
                                        }}
                                        className={button.className}
                                    >
                                        {button.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            },
        });
    };

    // Remove the useEffect since we're now using AuthContext

    const handleSignInClick = () => navigate("/login");
    const handleSignUpClick = () => navigate("/register");

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/searchresult?query=${searchQuery}`);
        }
    };

    const activeLinkStyle = ({ isActive }) =>
        isActive
            ? "text-black border-b-2 border-orange-500 transition duration-300"
            : "text-black text-base hover:border-b-2 hover:border-orange-500 transition duration-300";

    return (
        <div className="bg-white shadow-lg text-black sticky w-full top-0 left-0 z-50">
            <div className="flex justify-between items-center p-3 max-w-7xl mx-auto">
                {/* Brand Section */}
                <a href="/" className="flex items-center space-x-2 ml-10">
                    <div className="text-2xl font-bold text-orange-600">
                        ShoeHub
                    </div>
                </a>

                {/* Navigation Links */}
                <div className="flex items-center space-x-8">
                    <NavLink to="/" className={activeLinkStyle}>Home</NavLink>
                    <NavLink to="/menu" className={activeLinkStyle}>Shop</NavLink>
                    <NavLink to="/about-us" className={activeLinkStyle}>About</NavLink>

                    {/* Search Bar */}
                    <div className="flex items-center bg-gray-200 p-2 rounded-lg w-80 shadow-sm">
                        <input
                            type="text"
                            placeholder="Search shoes..."
                            className="ml-2 bg-transparent outline-none w-full text-gray-600 placeholder-gray-600"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button onClick={handleSearch} className="text-gray-600 ml-2">
                            <Search size={20} />
                        </button>
                    </div>
                </div>

                {/* Icons & Buttons */}
                <div className="flex items-center space-x-6 mr-10">
                    <Link to="/wishlist" className="text-2xl text-black hover:text-orange-600 transition-colors"><VscHeart /></Link>
                    <Link to="/cart" className="text-2xl text-black hover:text-orange-600 transition-colors"><ShoppingCart /></Link>

                    {isAuthenticated ? (
                        <>
                            {/* My Account Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="bg-white text-black text-base hover:text-orange-600 px-4 py-2 transition-colors"
                                >
                                    My Account
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg">
                                        <Link to="/profile" className="flex items-center px-4 py-2 hover:bg-gray-100 text-black">
                                            <User className="w-4 h-4 mr-2" />
                                            My Profile
                                        </Link>
                                        <Link to="/my-orders" className="flex items-center px-4 py-2 hover:bg-gray-100 text-black">
                                            <ShoppingCart className="w-4 h-4 mr-2" />
                                            My Orders
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Log Out Button */}
                            <button
                                className="bg-white text-black text-base hover:text-orange-600 px-4 py-2 transition-colors flex items-center gap-2"
                                onClick={handleLogout}
                            >
                                <LogOut size={16} />
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Sign In & Sign Up Buttons */}
                            <button
                                className="text-black text-base border border-orange-500 px-4 py-2 rounded-md hover:bg-orange-500 hover:text-white transition duration-300"
                                onClick={handleSignInClick}
                            >
                                Sign In
                            </button>
                            <button
                                className="text-white bg-orange-500 text-base border border-orange-500 px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300"
                                onClick={handleSignUpClick}
                            >
                                Sign Up
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Navbar;
