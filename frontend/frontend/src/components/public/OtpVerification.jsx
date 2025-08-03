
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../context/AuthContext';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../common/ui/card';
import { Input } from '../common/ui/input';
import { Button } from '../common/ui/button';
import { Link } from 'react-router-dom';

const OtpVerification = () => {
  const { login, getRole, isAuthenticated } = useAuth();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState('');
  const [isCsrfLoading, setIsCsrfLoading] = useState(true);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/auth/csrf-token', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
        console.log('VerifyOtp.jsx: CSRF Token fetched:', response.data.csrfToken);
      } catch (error) {
        console.error('VerifyOtp.jsx: CSRF Token Error:', error.message);
        toast.error('Failed to initialize. Please refresh the page.');
      } finally {
        setIsCsrfLoading(false);
      }
    };
    fetchCsrfToken();
  }, []);

  useEffect(() => {
  if (isAuthenticated) {
    const role = getRole();
    console.log('VerifyOtp.jsx: isAuthenticated changed, role:', role);
    toast.success('Logged in successfully!');
    
    setTimeout(() => {
      window.location.href = role === 'admin' ? '/admin/dashboard' : '/';
    }, 1500); // Delay to allow toast to show
  }
}, [isAuthenticated, getRole]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      toast.error('Please enter a valid 6-digit OTP.');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://localhost:3000/api/v1/auth/verify-otp',
        { userId: state?.userId, otp },
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );

      console.log('VerifyOtp.jsx: OTP Verification Response:', response.data);

      if (response.data.success) {
        const { token, userId } = response.data;
        if (!token || !userId) {
          throw new Error('Missing token or userId in response');
        }
        console.log('VerifyOtp.jsx: JWT Token:', token);
        const decoded = jwtDecode(token);
        console.log('VerifyOtp.jsx: Decoded JWT:', decoded);
        sessionStorage.clear(); // Clear any stale tokens
        login(token, userId, state?.rememberMe);
        console.log('VerifyOtp.jsx: Login called with:', { userId, rememberMe: state?.rememberMe });
      } else {
        toast.error(response.data.message || 'Invalid or expired OTP.');
      }
    } catch (error) {
      console.error('VerifyOtp.jsx: OTP Verification Error:', error.response?.data || error.message);
      const message = error.response?.data?.message || 'Error verifying OTP. Please try again.';
      toast.error(message);
      if (message.includes('Invalid or expired OTP')) {
        setTimeout(() => navigate('/login'), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!state?.userId || !state?.email) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
        {/* Brand Header */}
        <div className="absolute top-8 left-8">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl font-bold text-orange-600">ShoeHub</span>
          </Link>
        </div>

        {/* Error Card */}
        <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
              Session Expired
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Invalid session. Please log in again to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <Button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>

        <ToastContainer 
          position="top-right" 
          autoClose={3000} 
          hideProgressBar 
          theme="light"
          toastClassName="rounded-lg shadow-lg"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100 flex items-center justify-center p-4">
      {/* Brand Header */}
      <div className="absolute top-8 left-8">
        <Link to="/" className="flex items-center space-x-2">
          <span className="text-3xl font-bold text-orange-600">ShoeHub</span>
        </Link>
      </div>

      {/* Main Card */}
      <Card className="w-full max-w-md shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-orange-600 to-orange-800 bg-clip-text text-transparent">
            Verify OTP
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Enter the 6-digit OTP sent to {state.email || 'your email'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* OTP Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">OTP Code</label>
              <Input
                type="text"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '');
                  setOtp(value);
                }}
                placeholder="Enter 6-digit OTP"
                maxLength={6}
                className="text-center text-lg font-mono focus:ring-orange-500 focus:border-orange-500"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || isCsrfLoading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                    />
                  </svg>
                  <span>Verifying...</span>
                </div>
              ) : isCsrfLoading ? (
                'Loading...'
              ) : (
                'Verify OTP'
              )}
            </Button>
          </form>

          {/* Back to Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive the OTP?{' '}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium underline">
                Try again
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      <ToastContainer 
        position="top-right" 
        autoClose={3000} 
        hideProgressBar 
        theme="light"
        toastClassName="rounded-lg shadow-lg"
      />
    </div>
  );
};

export default OtpVerification;
