
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../common/customer/Navbar';
import Footer from '../common/customer/Footer';
import { useAuth } from '../../context/AuthContext';
import { ShoppingBag, Package, User } from 'lucide-react';

function MyOrders() {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const customerId = user.userId || sessionStorage.getItem('userId');
  const [userData, setUserData] = useState({
    fname: '',
    lname: '',
    email: '',
  });
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [csrfToken, setCsrfToken] = useState('');

  // Fetch CSRF token and user data
  useEffect(() => {
    console.log('MyOrders.jsx: isAuthenticated:', isAuthenticated);
    console.log('MyOrders.jsx: user:', user);
    console.log('MyOrders.jsx: loading:', loading);
    console.log('MyOrders.jsx: sessionStorage:', {
      token: sessionStorage.getItem('token'),
      userId: sessionStorage.getItem('userId'),
      rememberMe: localStorage.getItem('rememberMe'),
    });

    // Fetch CSRF token
    axios
      .get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true })
      .then((response) => {
        console.log('MyOrders.jsx: CSRF Token fetched:', response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error('MyOrders.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to fetch CSRF token. Please refresh the page.');
      });

    if (!isAuthenticated && !user.token) {
      toast.error('Please log in to view your orders.');
      navigate('/login');
      return;
    }
    if (!loading) {
      fetchUserData();
    }
  }, [user, isAuthenticated, loading, navigate]);

  const fetchUserData = async () => {
    try {
      const token = user.token || sessionStorage.getItem('token');
      const response = await axios.get(`http://localhost:3000/api/v1/auth/${customerId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });

      if (response.data.success) {
        const { fname, lname, email } = response.data.data;
        setUserData({
          fname: fname || '',
          lname: lname || '',
          email: email || '',
        });
      } else {
        toast.error('Failed to fetch user data.');
      }
    } catch (error) {
      console.error('MyOrders.jsx: Error fetching user data:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Error fetching user data.');
    } finally {
      setIsUserLoading(false);
    }
  };

  const { data: orders, error, isLoading: isOrdersLoading } = useQuery({
    queryKey: ['orders', customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const res = await axios.get(`http://localhost:3000/api/v1/order/orders/user/${customerId}`, {
        headers: {
          Authorization: `Bearer ${user.token || sessionStorage.getItem('token')}`,
          'X-CSRF-Token': csrfToken,
        },
        withCredentials: true,
      });
      return res.data; // The API returns orders directly, not wrapped in data
    },
    enabled: !!customerId && !!csrfToken,
  });

  const statusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'processing':
        return 'bg-blue-100 text-blue-700 border border-blue-200';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-700 border border-indigo-200';
      case 'delivered':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  const paymentBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border border-orange-200';
      case 'paid':
        return 'bg-green-100 text-green-700 border border-green-200';
      case 'failed':
        return 'bg-red-100 text-red-700 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  };

  if (!customerId || !isAuthenticated || !user.token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <User className="text-orange-600 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Please Log In</h2>
          <p className="text-gray-600 mb-4">You need to be logged in to view your orders.</p>
          <button 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300"
            onClick={() => navigate('/login')}
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (isUserLoading || isOrdersLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
        <div className="flex items-center space-x-2">
          <svg className="animate-spin h-5 w-5 text-orange-600" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
          <span className="text-gray-700">Loading your orders...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <Package className="text-red-500 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Failed to Load Orders</h2>
          <p className="text-gray-600 mb-4">Please try again later.</p>
          <button 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="text-gray-400 mx-auto mb-4" size={64} />
          <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Orders Yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here!</p>
          <button 
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors duration-300"
            onClick={() => navigate('/menu')}
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 py-20">
        <div className="max-w-6xl mx-auto p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBag className="text-orange-600" size={32} />
              <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Welcome back, {userData.fname} {userData.lname}!
              </h2>
              <p className="text-gray-600">Email: {userData.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Order #{order._id.slice(-8)}</h2>
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusBadge(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Payment Status</h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${paymentBadge(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                    <p className="text-sm text-gray-600 mt-1">Method: {order.paymentMethod}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Total Amount</h3>
                    <p className="text-2xl font-bold text-orange-600">${order.totalPrice.toFixed(2)}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
                    <p className="text-lg font-medium text-gray-800">{order.cartItems.length} item(s)</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                      <User size={20} className="text-orange-600" />
                      Billing Details
                    </h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <p className="text-gray-800 font-medium">{order.billingDetails.fullName}</p>
                      <p className="text-gray-600">{order.billingDetails.email}</p>
                      <p className="text-gray-600">{order.billingDetails.phone}</p>
                      <p className="text-gray-600">
                        {order.billingDetails.address}, {order.billingDetails.city} - {order.billingDetails.zipCode}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3 text-gray-800 flex items-center gap-2">
                      <Package size={20} className="text-orange-600" />
                      Order Items
                    </h3>
                    <div className="space-y-3 max-h-64 overflow-y-auto">
                      {order.cartItems.map((item) => {
                        const product = item.itemId;
                        return (
                          <div key={product._id || product} className="flex items-center gap-4 bg-gray-50 rounded-lg p-3">
                            <img
                              src={`http://localhost:3000/uploads/${product.image}`}
                              alt={product.name}
                              className="w-16 h-16 object-cover rounded-lg border border-gray-200 hover:scale-110 transition-transform duration-300"
                            />
                            <div className="flex-1">
                              <p className="font-medium text-gray-800">{product.name || 'Unnamed Product'}</p>
                              <p className="text-sm text-gray-600">
                                Qty: {item.quantity} | Price: ${item.price}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        theme="light"
        toastClassName="rounded-lg shadow-lg"
      />
    </>
  );
}

export default MyOrders;
