import { FaEnvelope, FaMobileAlt, FaMoneyBillWave, FaPhone, FaShieldAlt, FaShippingFast, FaUsers, FaShoePrints } from "react-icons/fa";
import Footer from '../../components/common/customer/Footer';
import Layout from '../../components/common/customer/layout';

const About = () => {
    return (
        <>
            <Layout />
            <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
                <div className="max-w-5xl mx-auto p-6 mt-10">
                    <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8">
                        <h1 className="text-4xl font-bold text-center text-gray-800 mb-6 flex items-center justify-center gap-3">
                            <FaShoePrints className="text-orange-600" /> About ShoeHub
                        </h1>
                        <p className="text-gray-600 text-lg text-center mb-8">
                            Stepping into Style, One Pair at a Time 👟
                        </p>

                        <div className="space-y-8 text-gray-700">
                            {/* Our Story */}
                            <section className="bg-white/60 rounded-lg p-6 shadow-md">
                                <h2 className="text-2xl font-semibold mb-4 text-orange-600">Our Story</h2>
                                <p className="text-lg leading-relaxed">
                                    ShoeHub was founded with the passion to connect shoe enthusiasts
                                    with their perfect pair, delivered fresh and fast. What started as a small local store
                                    has grown into a trusted footwear platform, bringing style and comfort together.
                                </p>
                            </section>

                            {/* Our Mission */}
                            <section className="bg-white/60 rounded-lg p-6 shadow-md">
                                <h2 className="text-2xl font-semibold mb-4 text-orange-600">Our Mission</h2>
                                <p className="text-lg leading-relaxed">
                                    We strive to make shoe shopping effortless and enjoyable, ensuring everyone
                                    has access to quality footwear without leaving the comfort of their home.
                                    ShoeHub is committed to reliable service, premium shoes, and customer satisfaction.
                                </p>
                            </section>

                            {/* Why Choose ShoeHub */}
                            <section className="bg-white/60 rounded-lg p-6 shadow-md">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-orange-600">
                                    <FaUsers className="text-orange-600" /> Why Choose ShoeHub?
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3 p-4 bg-white/40 rounded-lg">
                                        <FaShippingFast className="text-orange-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-gray-800">Fast & Reliable Delivery</strong>
                                            <p className="text-sm text-gray-600 mt-1">Enjoy your shoes delivered quickly to your doorstep.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white/40 rounded-lg">
                                        <FaMoneyBillWave className="text-orange-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-gray-800">Affordable Pricing</strong>
                                            <p className="text-sm text-gray-600 mt-1">Great shoes at wallet-friendly prices.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white/40 rounded-lg">
                                        <FaMobileAlt className="text-orange-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-gray-800">Easy Shopping</strong>
                                            <p className="text-sm text-gray-600 mt-1">Simple app and website for a smooth experience.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3 p-4 bg-white/40 rounded-lg">
                                        <FaShieldAlt className="text-orange-600 mt-1 flex-shrink-0" />
                                        <div>
                                            <strong className="text-gray-800">Secure Payments</strong>
                                            <p className="text-sm text-gray-600 mt-1">Multiple safe and secure payment options.</p>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            {/* Our Team */}
                            <section className="bg-white/60 rounded-lg p-6 shadow-md">
                                <h2 className="text-2xl font-semibold mb-4 text-orange-600">Our Team</h2>
                                <p className="text-lg leading-relaxed">
                                    We are a dedicated team of fashion enthusiasts, tech experts, and delivery professionals
                                    working together to make your ShoeHub experience seamless and delightful.
                                    Customer satisfaction is our top priority.
                                </p>
                            </section>

                            {/* Join Our Community */}
                            <section className="bg-white/60 rounded-lg p-6 shadow-md">
                                <h2 className="text-2xl font-semibold mb-4 text-orange-600">Join Our Community</h2>
                                <p className="text-lg leading-relaxed">
                                    Whether you're a fashion lover looking for trendy shoes or a brand wanting to reach more customers,
                                    ShoeHub welcomes you. Join us in redefining footwear shopping!
                                </p>
                            </section>

                            {/* Contact Us */}
                            <section className="bg-white/60 rounded-lg p-6 shadow-md">
                                <h2 className="text-2xl font-semibold mb-4 flex items-center gap-3 text-orange-600">
                                    <FaEnvelope className="text-orange-600" /> Contact Us
                                </h2>
                                <p className="text-lg mb-4">Have questions or feedback? We'd love to hear from you!</p>
                                <div className="space-y-3">
                                    <p className="flex items-center gap-3 text-lg">
                                        <FaEnvelope className="text-orange-600" />
                                        <strong>Email:</strong> support@shoehub.com
                                    </p>
                                    <p className="flex items-center gap-3 text-lg">
                                        <FaPhone className="text-orange-600" />
                                        <strong>Phone:</strong> +1 234 567 890
                                    </p>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default About;
