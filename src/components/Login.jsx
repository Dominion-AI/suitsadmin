import { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import api from '../Services/api';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../Services/constant';

const Login = () => {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Clear error when user starts typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form Data before submission:", formData); // Log form data
    setIsLoading(true);
    setError("");

    try {
      // Send login request
      const response = await api.post("/users/login/", {
        username: formData.username, // Use 'username' instead of 'email'
        password: formData.password,
      });

      // Log the response to see what we're getting
      console.log('Auth Response:', response.data);

      // Verify we have the correct token structure
      const { access, refresh } = response.data;

      if (!access || !refresh) {
        throw new Error('Invalid token response structure');
      }

      // Verify tokens are in JWT format (should be three parts separated by dots)
      const isValidJWT = (token) => token.split('.').length === 3;

      if (!isValidJWT(access) || !isValidJWT(refresh)) {
        throw new Error('Invalid token format received');
      }

      // Store tokens
      localStorage.setItem(ACCESS_TOKEN, access);
      localStorage.setItem(REFRESH_TOKEN, refresh);

      // Log stored tokens for debugging
      console.log('Stored tokens:', {
        access: localStorage.getItem(ACCESS_TOKEN),
        refresh: localStorage.getItem(REFRESH_TOKEN),
      });

      // Navigate to protected route
      navigate("/dashboard");
    } catch (error) {
      console.error("Login Error:", error);
      let errorMessage;

      if (error.response?.status === 401) {
        errorMessage = "Invalid username or password";
      } else if (error.response?.status === 404) {
        errorMessage = "Authentication service not available";
      } else if (error.message.includes('token')) {
        errorMessage = "Authentication error - please try again";
      } else {
        errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          "An error occurred during login";
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md mb-6">
        <h1 className="text-4xl font-extrabold text-center text-indigo-800 tracking-tight">
          SuitsAdminNew
        </h1>
        <p className="mt-2 text-center text-xl text-gray-600">Management Platform</p>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-10 shadow-2xl rounded-xl sm:px-12 border border-gray-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center">Welcome Back</h2>
            <p className="text-gray-500 mt-2 text-center">Sign in to your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 text-red-700 rounded-lg flex items-center">
              <svg
                className="w-6 h-6 mr-3"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-base">{error}</span>
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Username
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="pl-10 py-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm text-base rounded-lg border-gray-300"
                  placeholder="Enter your username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-base font-medium text-gray-700 mb-2"
              >
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 py-3 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm text-base rounded-lg border-gray-300"
                  placeholder="Enter your password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-lg font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-300 focus:ring-offset-2 transition duration-150 ease-in-out shadow-lg"
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          <div className="mt-8 border-t border-gray-200 pt-6">
            <p className="text-center text-base text-gray-600">
              Dont have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Create a new account
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>© 2025 SuitsAdmin. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;