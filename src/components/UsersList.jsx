import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  User,
  AtSign,
  Mail,
  Phone,
  Calendar,
  XCircle,
  CheckCircle,
  Banknote,
  Wallet,
  HandCoins,
  CircleDollarSign,
} from "lucide-react";

import "./UsersList.css";
import LoaderLight from "./LoaderLight";
const UsersList = () => {
  const [users, setUsers] = useState([]); // State to store users
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error state

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(0); // New state for total pages

  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for the modal
  const [selectedType, setSelectedType] = useState(""); // Selected type ("IN" or "OUT")
  const [price, setPrice] = useState(""); // Price input value
  const [isSubmitting, setIsSubmitting] = useState(false); // Loading state for modal submission

  // search-related state
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const navigate = useNavigate();

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Fetch users from the backend
  useEffect(() => {
    const abortController = new AbortController(); // Create an AbortController

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError("");
        setUsers([]); // Reset users state before fetching

        // Fetch users from the API
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users`,
          {
            signal: abortController.signal, // Pass the signal to axios
            params: {
              page: currentPage,
              limit: usersPerPage,
            },
          }
        );

        // Specifically check the structure of the response
        const usersData = response.data.users || response.data;

        setUsers(usersData);
        setTotalPages(
          response.data.totalPages || Math.ceil(usersData.length / usersPerPage)
        );
      } catch (error) {
        if (!abortController.signal.aborted) {
          // Only handle errors if not aborted
          console.error("Error fetching users:", error);
          setError("Failed to fetch users. Please try again.");

          // Show error toast
          toast.error("Failed to fetch users. Please try again.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchUsers();

    return () => {
      abortController.abort(); // Abort the request on unmount
    };
  }, [currentPage]);

  // Pagination Helpers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Pagination Rendering
  const renderPagination = () => {
    const pageNumbers = [];

    // Always show first page
    if (!pageNumbers.includes(1)) {
      pageNumbers.push(1);
    }

    // Calculate page range
    const startPage = Math.max(2, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i);
      }
    }

    return (
      <div className="pagination">
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => handlePageChange(number)}
            className={currentPage === number ? "active" : ""}
          >
            {number}
          </button>
        ))}
        {/* Next Button */}
        {currentPage < totalPages && (
          <button
            className="next-button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        )}
      </div>
    );
  };

  // search functionality
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast.warning("Please enter a search query.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      setIsSearching(true);
      setError("");
      setSearchResults([]);

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/search`,
        {
          params: { query: searchQuery },
        }
      );

      if (response.data.length === 0) {
        toast.info("No users found matching your search.", {
          position: "top-right",
          autoClose: 3000,
        });
      }

      setSearchResults(response.data);
    } catch (error) {
      console.error("Error searching users:", error);
      setError("Failed to search users. Please try again.");

      toast.error("Failed to search users. Please try again.", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSearching(false);
    }
  };

  // Reset to initial users list
  const resetSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  // Open modal and set selected user and type
  const openModal = (user, type) => {
    setSelectedUser(user);
    setSelectedType(type);
    setIsModalOpen(true);
  };

  // Close modal and reset state
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setSelectedType("");
    setPrice("");
  };

  // Handle form submission
  const handleSubmit = async () => {
    try {
      // Validate total_price
      if (!price || price <= 0) {
        toast.warning("Please enter a valid price (greater than 0).", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return; // Stop execution if validation fails
      }

      // Set submitting state to true
      setIsSubmitting(true);

      // Prepare the order data
      const paymentData = {
        product_name: "Payment", // Default product name
        amount: price,
        //quantity: 1, // Default quantity
        type: selectedType,
        // email: selectedUser.email,
        // phone: selectedUser.phone,
        // username: selectedUser.username,
        user_id: selectedUser.id,
        username: selectedUser.username,
        // accountemail: selectedUser.email,
        status: "confirmed", // Default status by admin
        image: null, // Image file
      };

      // Send the order to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/payments`,
        paymentData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Show success toast
      // Check if the order was created successfully
      if (response.data.paymentStatus) {
        // Show success toast
        const action =
          selectedType === "IN" ? "added to wallet" : "withdrawn from wallet";

        toast.success(`$${price} ${action} successfully.`);

        // Close the modal
        closeModal();
      } else {
        // Show error toast if the backend indicates failure
        toast.error(response.data.error || "Failed to create the payment.");
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      if (error.response) {
        toast.error(error.response.data.error || "An error occurred.");
      } else if (error.request) {
        toast.error("Unable to reach the server. Please try again later.");
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      // Reset submitting state
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="users-list-container">
        <div className="users-search">
          <div className="users-list-title">
            <h2>Users List</h2>
          </div>
          {/* Search Input and Button */}
          <div className="search-container">
            <input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="search-button"
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
            {(searchResults.length > 0 || searchQuery) && (
              <button onClick={resetSearch} className="reset-search-button">
                Clear Search
              </button>
            )}
          </div>
        </div>
        {loading || isSearching ? (
          <LoaderLight />
        ) : error ? (
          <p className="error-message">{error}</p>
        ) : isSearching || searchResults.length > 0 ? (
          <div className="users-list">
            {searchResults.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-details">
                  <div className="user-info">
                    <span className="user-id">#{user.id}</span>
                    <span className="user-username">
                      <User size={18} color="#2c3e50" /> {user.username}
                    </span>
                    <span className="user-email">
                      <Mail size={18} color="#2c3e50" /> {user.email}
                    </span>
                    <span className="user-phone">
                      <Phone size={18} color="#2c3e50" /> {user.phone || "N/A"}
                    </span>
                    <span className="user-since">
                      <Calendar size={18} color="#2c3e50" />
                      {new Date(user.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="user-actions">
                    <button
                      className="action-button in-button"
                      onClick={() => openModal(user, "IN")}
                    >
                      <CircleDollarSign className="text-green w-100 h-100" />
                    </button>
                    <button
                      className="action-button out-button"
                      onClick={() => openModal(user, "OUT")}
                    >
                      <CircleDollarSign className="text-red w-100 h-100" />
                    </button>
                    <button
                      className="action-button profile-button"
                      onClick={() => navigate(`/profile/${user.id}`)}
                    >
                      Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : users.length === 0 ? (
          <p className="no-users">No users found.</p>
        ) : (
          <>
            <div className="users-list">
              {users.map((user) => (
                <div key={user.id} className="user-card">
                  <div className="user-details">
                    <div className="user-info">
                      <span className="user-id">#{user.id}</span>
                      <span className="user-username">
                        <User size={18} color="#2c3e50" /> {user.username}
                      </span>
                      <span className="user-email">
                        <Mail size={18} color="#2c3e50" /> {user.email}
                      </span>
                      <span className="user-phone">
                        <Phone size={18} color="#2c3e50" />{" "}
                        {user.phone || "N/A"}
                      </span>
                      <span className="user-since">
                        <Calendar size={18} color="#2c3e50" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="user-actions">
                      <button
                        className="action-button in-button"
                        onClick={() => openModal(user, "IN")}
                      >
                        <CircleDollarSign className="text-green w-100 h-100" />
                      </button>
                      <button
                        className="action-button out-button"
                        onClick={() => openModal(user, "OUT")}
                      >
                        <CircleDollarSign className="text-red w-100 h-100" />
                      </button>
                      <button
                        className="action-button profile-button"
                        onClick={() => navigate(`/profile/${user.id}`)}
                      >
                        Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {renderPagination()}
          </>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            backdropFilter: "blur(5px)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: "20px",
              borderRadius: "8px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              width: "300px",
              textAlign: "center",
            }}
          >
            <h3 className="modal-title">
              {selectedType === "IN"
                ? "Add to Wallet"
                : selectedType === "OUT"
                ? "Withdraw from Wallet"
                : ""}
            </h3>
            <input
              type="text"
              placeholder="100"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              style={{
                width: "100%",
                padding: "8px",
                margin: "10px 0",
                borderRadius: "4px",
                border: "1px solid #ddd",
              }}
            />
            <button
              onClick={handleSubmit}
              disabled={isSubmitting} // Disable the button while submitting
              style={{
                padding: "8px 12px",
                backgroundColor: selectedType === "IN" ? "#28a745" : "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                marginRight: "8px",
                opacity: isSubmitting ? 0.7 : 1, // Reduce opacity when disabled
              }}
            >
              {isSubmitting
                ? "Submitting..."
                : selectedType === "IN"
                ? "Add"
                : "Withdraw"}
            </button>
            <button
              onClick={closeModal}
              style={{
                padding: "8px 12px",
                backgroundColor: "#6c757d",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UsersList;
