import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import { toast } from "react-toastify";
const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [signupStatus, setSignupStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  // Password validation
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    return "";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLoading) return;

    setIsLoading(true);
    setError("");
    setSignupStatus("");

    // First check if any required fields are empty
    if (
      !formData.username ||
      !formData.email ||
      !formData.phone ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.warning("All fields are required");
      setIsLoading(false);
      return;
    }

    // Then validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warning("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Then validate password length
    if (formData.password.length < 8) {
      toast.warning("Password must be at least 8 characters long");
      setIsLoading(false);
      return;
    }

    // Finally check password match
    if (formData.password !== formData.confirmPassword) {
      toast.warning("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/signup`,
        {
          username: formData.username,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }
      );

      if (response.data.signupStatus) {
        toast.success(response.data.message);
        // Clear form after successful signup
        setFormData({
          username: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        });
        navigate("/signin");
      } else {
        toast.error(response.data.error);
      }
    } catch (err) {
      if (err.response) {
        // Server responded with an error
        toast.error(
          err.response.data.error || "Registration failed. Please try again."
        );
      } else if (err.request) {
        // Request was made but no response received
        toast.error("Unable to connect to the server. Please try again later.");
      } else {
        // Something else went wrong
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  return (
    <div className="container full-container  d-flex justify-content-center align-items-center">
      <div className="auth-container  container">
        <h2 className="text-center text-main mb-4">Sign Up</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="row  mt-1">
            <div className="form-group col-md-6 col-6 mb-0">
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                disabled={isLoading}
                className="form-control"
                placeholder="username"
              />
            </div>
            <div className="form-group col-md-6 col-6 mb-0">
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
                className="form-control"
                placeholder="email"
              />
            </div>
          </div>
          <div className="row">
            <div className="form-group col-md-6 col-6 mb-0">
              <label htmlFor="password">Password:</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
                className="form-control"
                placeholder="password (min 8 characters)"
              />
            </div>
            <div className="form-group col-md-6 col-6 mb-0">
              <label htmlFor="confirmPassword">Confirm Password:</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isLoading}
                className="form-control"
                placeholder="confirm password"
              />
            </div>
          </div>
          <div className="form-group mb-0">
            <label htmlFor="phone">Phone Number:</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="phone"
            />
          </div>
          <p className="text-secondary text-center mb-0">
            Already have an account?{" "}
            <Link className="signup-link" to="/signin">
              Sign In
            </Link>
          </p>
          <button
            type="submit"
            className="btn btn-main w-100"
            disabled={isLoading}
          >
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
      <img
        src="/images/logo-icon.png"
        className="signin-img"
        alt="Sign Up Background"
      />
    </div>
  );
};

export default SignUp;
