import React, { useState } from "react";
import axios from "axios";
import "./CreateAdmin.css";
import { toast } from "react-toastify";

const CreateAdmin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    phone: "",
    username: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const resetForm = () => {
    setFormData({
      email: "",
      password: "",
      phone: "",
      username: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear messages when user starts typing
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission

    setIsLoading(true);
    setMessage({ type: "", text: "" });

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

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/create-admin`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data.success) {
        setMessage({
          type: "success",
          text: response.data.message,
        });
        toast.success(response.data.message);
        resetForm();
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        "Failed to create admin. Please try again.";
      setMessage({
        type: "error",
        text: errorMessage,
      });
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="create-admin-container">
      <h1 className="create-admin-title">Create Admin</h1>
      <form onSubmit={handleSubmit}>
        <div className="create-admin-form-group">
          <label className="create-admin-form-label">Username:</label>
          <input
            type="text"
            name="username"
            className="create-admin-form-input"
            value={formData.username}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Enter username"
          />
        </div>

        <div className="create-admin-form-group">
          <label className="create-admin-form-label">Email:</label>
          <input
            type="email"
            name="email"
            className="create-admin-form-input"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Enter email address"
          />
        </div>

        <div className="create-admin-form-group">
          <label className="create-admin-form-label">Password:</label>
          <input
            type="text"
            name="password"
            className="create-admin-form-input"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="password (min 8 characters)"
          />
        </div>

        <div className="create-admin-form-group">
          <label className="create-admin-form-label">Phone:</label>
          <input
            type="tel"
            name="phone"
            className="create-admin-form-input"
            value={formData.phone}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Enter phone number"
          />
        </div>

        <button
          type="submit"
          className="create-admin-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "Creating..." : "Create Admin"}
        </button>
      </form>

      {message.text && (
        <div className={`create-admin-message ${message.type || "success"}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

export default CreateAdmin;
