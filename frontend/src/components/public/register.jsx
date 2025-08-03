import axios from "axios";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReCAPTCHA from "react-google-recaptcha";
import zxcvbn from "zxcvbn";
import { useAuth } from "../../context/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../common/ui/card";
import { Input } from "../common/ui/input";
import { Button } from "../common/ui/button";
import { Separator } from "../common/ui/separator";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isChecked, setIsChecked] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [csrfToken, setCsrfToken] = useState("");

  // Fetch CSRF token on component mount
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/auth/csrf-token", { withCredentials: true })
      .then((response) => {
        console.log("CSRF Token fetched:", response.data.csrfToken);
        setCsrfToken(response.data.csrfToken);
      })
      .catch((error) => {
        console.error("Error fetching CSRF token:", error);
        toast.error("Failed to initialize form security.");
      });
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "terms") {
      setIsChecked(checked);
      setErrors((prevErrors) => ({ ...prevErrors, terms: "" }));
    } else if (type === "checkbox" && name === "rememberMe") {
      setRememberMe(checked);
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
      setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
    }
  };

  const validatePassword = (password) => {
    const result = zxcvbn(password);
    const minScore = 3; // Require "good" strength
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[@#$%^&*]/.test(password),
      strength: result.score >= minScore,
    };

    return {
      isValid: Object.values(requirements).every(Boolean),
      requirements,
      errors: {
        length: requirements.length ? "" : "Password must be at least 8 characters.",
        uppercase: requirements.uppercase ? "" : "Password must include at least one uppercase letter.",
        lowercase: requirements.lowercase ? "" : "Password must include at least one lowercase letter.",
        number: requirements.number ? "" : "Password must include at least one number.",
        special: requirements.special ? "" : "Password must include at least one special character (@, #, $, etc.).",
        strength: requirements.strength ? "" : "Password is too weak.",
      },
    };
  };

  const validateForm = () => {
    let newErrors = {};

    if (!formData.fname.trim()) newErrors.fname = "First name is required.";
    if (!formData.lname.trim()) newErrors.lname = "Last name is required.";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits.";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = Object.values(passwordValidation.errors)
          .filter(Boolean)
          .join(" ");
      }
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Confirm password is required.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!isChecked) {
      newErrors.terms = "You must agree to the Terms and Conditions.";
    }
    if (!recaptchaToken) {
      newErrors.captcha = "Please complete the CAPTCHA.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/register",
        {
          ...formData,
          recaptchaToken,
          termsAccepted: isChecked,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success("Registration successful! Please log in with your new account.");
        
        // Don't automatically log in the user
        // Just redirect to login page after a short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      console.error("Error during registration:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (error.response?.data?.errors) {
        error.response.data.errors.forEach((err) => toast.error(err.msg));
      } else {
        toast.error("Registration failed! Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onCaptchaChange = (value) => {
    setRecaptchaToken(value);
    setErrors((prevErrors) => ({ ...prevErrors, captcha: "" }));
  };

  const passwordValidation = validatePassword(formData.password);

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
            Step Into Style
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Create your account and discover the perfect pair of shoes for every occasion
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">First Name</label>
                <Input
                  type="text"
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  className={`bg-white text-black ${errors.fname ? "border-red-500 focus:ring-red-500" : "focus:ring-orange-500 focus:border-orange-500"}`}
                />
                {errors.fname && (
                  <p className="text-red-500 text-xs">{errors.fname}</p>
                )}
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Last Name</label>
                <Input
                  type="text"
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  className={`bg-white text-black ${errors.lname ? "border-red-500 focus:ring-red-500" : "focus:ring-orange-500 focus:border-orange-500"}`}
                />
                {errors.lname && (
                  <p className="text-red-500 text-xs">{errors.lname}</p>
                )}
              </div>
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Phone Number</label>
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                className={`bg-white text-black ${errors.phone ? "border-red-500 focus:ring-red-500" : "focus:ring-orange-500 focus:border-orange-500"}`}
              />
              {errors.phone && (
                <p className="text-red-500 text-xs">{errors.phone}</p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className={`bg-white text-black ${errors.email ? "border-red-500 focus:ring-red-500" : "focus:ring-orange-500 focus:border-orange-500"}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a secure password"
                className={`bg-white text-black ${errors.password ? "border-red-500 focus:ring-red-500" : "focus:ring-orange-500 focus:border-orange-500"}`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs">{errors.password}</p>
              )}
              
              {/* Password Requirements */}
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-xs font-medium text-gray-700 mb-2">Password Requirements:</p>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div className={`flex items-center space-x-2 ${passwordValidation.requirements.length ? "text-green-600" : "text-red-500"}`}>
                    <span>{passwordValidation.requirements.length ? "✓" : "✗"}</span>
                    <span>At least 8 characters</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.requirements.uppercase ? "text-green-600" : "text-red-500"}`}>
                    <span>{passwordValidation.requirements.uppercase ? "✓" : "✗"}</span>
                    <span>One uppercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.requirements.lowercase ? "text-green-600" : "text-red-500"}`}>
                    <span>{passwordValidation.requirements.lowercase ? "✓" : "✗"}</span>
                    <span>One lowercase letter</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.requirements.number ? "text-green-600" : "text-red-500"}`}>
                    <span>{passwordValidation.requirements.number ? "✓" : "✗"}</span>
                    <span>One number</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.requirements.special ? "text-green-600" : "text-red-500"}`}>
                    <span>{passwordValidation.requirements.special ? "✓" : "✗"}</span>
                    <span>One special character (@#$%^&*)</span>
                  </div>
                  <div className={`flex items-center space-x-2 ${passwordValidation.requirements.strength ? "text-green-600" : "text-red-500"}`}>
                    <span>{passwordValidation.requirements.strength ? "✓" : "✗"}</span>
                    <span>Strong password</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm Password</label>
              <Input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your secure password"
                className={`bg-white text-black ${errors.confirmPassword ? "border-red-500 focus:ring-red-500" : "focus:ring-orange-500 focus:border-orange-500"}`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs">{errors.confirmPassword}</p>
              )}
            </div>

            {/* CAPTCHA */}
            <div className="flex justify-center">
              <ReCAPTCHA
                sitekey="6LfdWZIrAAAAABEHkzQkNm2HY1LiSUJ92cqyKrPi"
                onChange={onCaptchaChange}
              />
            </div>
            {errors.captcha && (
              <p className="text-red-500 text-xs text-center">{errors.captcha}</p>
            )}

            <Separator />

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                name="terms"
                checked={isChecked}
                onChange={handleChange}
                className="mt-1 h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-orange-600 hover:text-orange-700 font-medium underline">
                  Terms and Conditions
                </a>
              </label>
            </div>
            {errors.terms && (
              <p className="text-red-500 text-xs">{errors.terms}</p>
            )}

            {/* Remember Me */}
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="rememberMe"
                name="rememberMe"
                checked={rememberMe}
                onChange={handleChange}
                className="h-4 w-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
              />
              <label htmlFor="rememberMe" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
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
                  <span>Creating Your Account...</span>
                </div>
              ) : (
                "Start Shopping"
              )}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="text-orange-600 hover:text-orange-700 font-medium underline">
                Sign in to continue shopping
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

export default Register;