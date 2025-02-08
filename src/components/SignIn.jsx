import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext";
import { jwtDecode } from "jwt-decode";
import "./Auth.css";
import { toast } from "react-toastify";

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const { isAuthorized, setUser, setIsAuthorized } = useAuth();
  //const [error, setError] = useState("");
  //const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already authorized
  useEffect(() => {
    if (isAuthorized) {
      navigate("/dashboard");
    }
  }, [isAuthorized, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission
    setIsLoading(true);
    // Clear previous messages
    //setSuccess(false);
    // setError("");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/signin`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.signInStatus) {
        const decodedToken = jwtDecode(response.data.token); // Decode the token
        const userData = {
          username: decodedToken.username,
          email: decodedToken.email,
          role: decodedToken.role,
          id: decodedToken.id,
          phone: decodedToken.phone,
        };
        // Store in localStorage for quick access
        localStorage.setItem("userData", JSON.stringify(userData));
        setIsAuthorized(true); // Update isAuthorized state
        setUser(userData);
        toast.success("Sign in successful!"); // Show a success message
        navigate("/dashboard"); // Redirect to home page
        // console.log("role:", user.role);
        // setSuccess(true);
        // setError("");
      }
    } catch (err) {
      // Handle different types of errors
      if (err.response) {
        toast.warning(
          err.response.data.error || "An error occurred during sign in"
        );
        // setError(err.response.data.error || "An error occurred during sign in");
      } else if (err.request) {
        toast.error("Unable to connect to the server. Please try again later.");
        //  setError("Unable to connect to the server. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
        // setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // setError("");
  };

  return (
    <div className="container full-container d-flex justify-content-center align-items-center">
      <div className="auth-container  container">
        <h2 className="text-center text-main mb-4">Sign In</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group mb-0">
            <label htmlFor="email">Email:</label>
            <input
              type="text"
              id="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="email"
            />
          </div>
          <div className="form-group mb-0">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="password"
            />
          </div>
          <div className="text-end mb-3 mt-0">
            <a href="/request-reset-password" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <p className="text-secondary text-center mb-0">
            Don't have an account?{" "}
            <Link className="signup-link" to="/signup">
              Sign Up
            </Link>
          </p>

          <button
            type="submit"
            className="btn  btn-main w-100"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
      <img
        src="/images/logo-icon.png"
        className="signin-img"
        alt="Sign In Background"
      />
    </div>
  );
};

export default SignIn;
