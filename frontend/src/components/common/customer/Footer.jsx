import { FaFacebook, FaInstagram, FaLinkedin, FaShoePrints, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import { FaXTwitter } from "react-icons/fa6";
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="lg:col-span-1">
                        <div className="flex items-center space-x-3 mb-6">
                            <FaShoePrints className="text-orange-500 text-3xl" />
                            <h2 className="text-3xl font-bold text-white">
                                ShoeHub
                            </h2>
                        </div>
                        <p className="text-gray-300 leading-relaxed mb-6">
                            Step into style with ShoeHub - your premier destination for premium footwear. 
                            Discover the perfect pair for every occasion, from casual comfort to elegant sophistication.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.facebook.com/shoehub" className="text-gray-400 hover:text-orange-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                                <FaFacebook className="text-2xl" />
                            </a>
                            <a href="https://www.linkedin.com/company/shoehub" className="text-gray-400 hover:text-orange-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                                <FaLinkedin className="text-2xl" />
                            </a>
                            <a href="https://x.com/shoehub" className="text-gray-400 hover:text-orange-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                                <FaXTwitter className="text-2xl" />
                            </a>
                            <a href="https://www.instagram.com/shoehub" className="text-gray-400 hover:text-orange-500 transition-colors duration-300" target="_blank" rel="noopener noreferrer">
                                <FaInstagram className="text-2xl" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-orange-500"></span>
                            Quick Links
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/about-us" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact-us" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/delivery-charges" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                                    Shipping Info
                                </Link>
                            </li>
                            <li>
                                <Link to="/menu" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                                    Shop Now
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-orange-500"></span>
                            Customer Service
                        </h3>
                        <ul className="space-y-3">
                            <li>
                                <Link to="/privacy-and-policy" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms-and-conditions" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                                    Terms & Conditions
                                </Link>
                            </li>
                            <li>
                                <Link to="/refund-policy" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                                    Return Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/cancellation-policy" className="text-gray-300 hover:text-orange-500 transition-colors duration-300 flex items-center gap-2">
                                    <span className="w-1 h-1 bg-orange-500 rounded-full"></span>
                                    Cancellation Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-xl font-semibold mb-6 text-white flex items-center gap-2">
                            <span className="w-8 h-0.5 bg-orange-500"></span>
                            Contact Us
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-start gap-3">
                                <FaEnvelope className="text-orange-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 font-medium">Email</p>
                                    <a href="mailto:support@shoehub.com" className="text-gray-400 hover:text-orange-500 transition-colors duration-300">
                                        support@shoehub.com
                                    </a>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaPhone className="text-orange-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 font-medium">Phone</p>
                                    <p className="text-gray-400">+1 (555) 123-4567</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <FaMapMarkerAlt className="text-orange-500 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-gray-300 font-medium">Address</p>
                                    <p className="text-gray-400">123 Fashion Street<br />New York, NY 10001</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Newsletter Section */}
                <div className="mt-12 pt-8 border-t border-gray-700">
                    <div className="text-center">
                        <h3 className="text-2xl font-semibold text-white mb-4">Stay Updated</h3>
                        <p className="text-gray-300 mb-6">Subscribe to our newsletter for the latest styles and exclusive offers</p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input 
                                type="email" 
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors duration-300"
                            />
                            <button className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors duration-300 font-medium">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-gray-400 text-sm">
                            Copyright © 2024 ShoeHub | All Rights Reserved
                        </p>
                        <div className="flex items-center gap-6 text-sm">
                            <span className="text-gray-400">Made with</span>
                            <span className="text-orange-500">❤</span>
                            <span className="text-gray-400">for shoe lovers</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
