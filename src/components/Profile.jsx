import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./Profile.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContext";
import { CircleDollarSign, Mail, Phone, User } from "lucide-react";
import LoaderLight from "./LoaderLight";

const Profile = () => {
  const { id } = useParams(); // Get the id from the URL
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [idLoading, setIdLoading] = useState(true); // Loading state for id delay
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const {
    user,
    balance,
    fetchBalance,
    setIsAuthorized,
    setUser,
    handleLogout,
  } = useAuth();
  const [profileBalance, setProfileBalance] = useState(null); // Balance for the specific user
  const [isDeleting, setIsDeleting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

  const fetchUser = async () => {
    setIsLoadingProfile(true);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        {
          withCredentials: true,
        }
      );
      console.log("API Response:", response);

      setProfile(response.data.user);
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("User not found");
      } else {
        toast.error("Failed to fetch user");
      }
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    // AbortController to cancel requests when dependencies change or component unmounts
    const abortController = new AbortController();
    const { signal } = abortController;
    // Check if user_id is available
    if (!user?.id && !user?.role) {
      setIdLoading(true); // No user_id, stop loading
      return;
    }
    console.log("id param:", String(id), "user id:", String(user?.id));
    // Validate access
    if (String(id) !== String(user?.id) && user?.role !== "admin") {
      // Regular user trying to access another user's profile
      toast.error("You do not have permission to access this profile.");
      navigate("/"); // Redirect to home or another page
      return;
    }
    setIdLoading(false);
    setLoading(true);
    setTransactions([]); // Clear previous transactions before new fetch
    setProfileBalance(null); // Clear previous balance before new fetch

    const fetchTransactions = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/profile/${id}`,

          {
            headers: { "Content-Type": "application/json" },
            signal,
            withCredentials: true, //for cookies
          }
        );
        console.log("frnten id param:", id);

        if (response.data.success) {
          setTransactions(response.data.transactions); // Set transactions
        }
      } catch (error) {
        if (!signal.aborted) {
          console.error("Error fetching transactions:", error);
          if (error.response) {
            if (error.response.status === 404) {
              setTransactions([]); // No transactions found
            } else {
              toast.error(
                error.response.data.error ||
                  "Failed to fetch transactions. Please try again later."
              );
            }
          } else if (error.request) {
            // Request was made but no response received
            toast.error("Unable to reach the server. Please try again later.");
          } else {
            // Something else went wrong
            toast.error("An unexpected error occurred. Please try again.");
          }
        }
      } finally {
        if (!signal.aborted) {
          setLoading(false); // Stop loading
        }
      }
    };

    fetchTransactions();

    // Fetch balance for the specific user if it's not the logged-in user
    // Fetch balance for the specific user
    const fetchUserBalance = async () => {
      const balance = await fetchBalance(id); // Fetch balance for the specific user
      console.log("Fetched balance for user:", id, balance); // Log the fetched balance
      setProfileBalance(balance); // Set the balance for the specific user
    };

    // Always fetch balance when the profile ID changes
    fetchUserBalance();
    fetchUser();
    // Cleanup the abort controller when the component unmounts or id changes
    return () => {
      abortController.abort();
    };
  }, []);

  //delete user profile
  const deleteUser = async () => {
    try {
      setIsDeleting(true);
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/users/${id}`,
        {
          withCredentials: true,
        }
      );

      toast.success("Account deleted successfully");

      // Handle logout and redirect if:
      // - User deleted themselves, OR
      // - Admin deleted themselves via another route
      if (
        user?.id.toString() === id.toString() ||
        (user?.role === "admin" && id.toString() === user?.id.toString())
      ) {
        // Clear user data before logout
        await handleLogout();
        // Wait for state updates to complete
        await new Promise((resolve) => setTimeout(resolve, 0)); // Force React to batch updates

        // navigate("/signup");
      } else {
        navigate("/admin/users"); // Redirect to user list (admin deleting another user)
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Deletion failed");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="profile">
      {isLoadingProfile || loading ? (
        <LoaderLight />
      ) : (
        <div className="profile-infos">
          <div className="profile-welcome">
            <h2>Welcome, {profile.username || "User"}!</h2>
            <p className="d-flex align-items-center gap-2 m-0">
              <CircleDollarSign /> Your Balance:{" "}
              <span
                className={
                  profileBalance > 0 ? "balance-positive" : "balance-negative"
                }
              >
                ${profileBalance}
              </span>
            </p>
          </div>

          <div className="profile-data">
            <p className="profile-name">
              <User size={20} />
              <span>{profile.username}</span>
            </p>
            <p className="profile-name">
              <Mail size={20} />
              <span>{profile.email}</span>
            </p>
            <p className="profile-name">
              <Phone size={20} />
              <span>{profile.phone}</span>
            </p>
            <div className="profile-buttons">
              <button
                className="reset-profile"
                onClick={() => navigate("/request-reset-password")}
              >
                Reset Password
              </button>
              <button
                className="delete-profile"
                onClick={() => setShowModal(true)}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <div className="profile-modal-overlay">
          <div className="profile-modal">
            <h2>Confirm Delete</h2>
            <p>This will delete all your account information.</p>
            <div className="profile-modal-buttons">
              <button
                onClick={() => setShowModal(false)}
                className="profile-cancel-btn"
              >
                Cancel
              </button>
              <button
                onClick={deleteUser}
                className="profile-delete-btn"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        ""
      ) : transactions.length === 0 ? (
        <p className="no-transactions">No transactions found.</p>
      ) : (
        <div className="transactions-table">
          <h3 className="profile-heading">Your Transactions</h3>
          {transactions.map((transaction) => (
            <div key={transaction.id} className="transaction-item">
              <div className="transaction-header">
                <div className="transaction-info">
                  <span
                    className={`amount ${
                      transaction.type === "IN" ? "green" : "red"
                    }`}
                  >
                    ${transaction.amount}
                  </span>
                  <div
                    className={`transaction-type ${
                      transaction.type === "IN" ? "green" : "red"
                    }`}
                  >
                    {transaction.type}
                  </div>
                </div>
                <div className="transaction-status">
                  <span
                    className={`status ${transaction.status.toLowerCase()}`}
                  >
                    {transaction.status}
                  </span>
                  <span className="date">
                    {new Date(transaction.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="transaction-body">
                <div className="product-name">{transaction.product_name}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Profile;
