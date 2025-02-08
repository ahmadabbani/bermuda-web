import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Auth.css";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Client-side validation
    if (!newPassword || newPassword.length < 8) {
      toast.error("Password must be at least 8 characters");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/reset-password/${token}`,
        { newPassword },
        { withCredentials: true }
      );

      if (response.data.status) {
        toast.success(response.data.message || "Password reset successful!");
        setNewPassword(""); // Clear password field
        setTimeout(() => navigate("/signin"), 2000);
      } else {
        toast.error(response.data.error || "Password reset failed");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to reset password. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="request-reset-container">
      <h2 className="request-reset-title">Reset Password</h2>
      <form onSubmit={handleSubmit} className="auth-form" noValidate>
        <div className="request-reset-form-group">
          <label className="request-reset-form-label">New Password:</label>
          <input
            type="text"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="request-reset-form-input"
            placeholder="Enter new password (min 8 characters)"
            disabled={isLoading}
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          className="request-reset-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
