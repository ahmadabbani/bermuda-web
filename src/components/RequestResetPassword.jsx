import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./Auth.css";

const RequestResetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Enhanced email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email || !emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/reset-password-request`,
        { email }
      );

      if (response.data.status) {
        toast.success(
          response.data.message || "Check your email for the reset link."
        );
        setMessage("Check your email for the reset link.");
        setEmail(""); // Clear form on success
      } else {
        toast.error(response.data.error || "Failed to send reset link");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to connect to the server";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="request-reset-container">
      <h2 className="request-reset-title">Request Password Reset</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="request-reset-form-group">
          <label className="request-reset-form-label">Email:</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="request-reset-form-input"
            placeholder="Enter your registered email"
            disabled={isLoading}
          />
        </div>

        <button
          type="submit"
          className="request-reset-submit-btn"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send Reset Link"}
        </button>
        {message && (
          <p
            style={{
              backgroundColor: "#27ae60",
              color: "#fff",
              textAlign: "center",
              marginTop: "1rem",
              marginBottom: "0",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default RequestResetPassword;
