import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./MyPayments.css";
import { useAuth } from "../../AuthContext";
import { useLocation } from "react-router-dom";
import LoaderLight from "./LoaderLight";

const MyPayments = () => {
  const [payments, setPayments] = useState([]);
  const [hasFetched, setHasFetched] = useState(false);
  const [idLoading, setIdLoading] = useState(true); // Loading state for id delay
  const [fetchLoading, setFetchLoading] = useState(false); // Loading state for API fetch
  const [expandedPaymentId, setExpandedPaymentId] = useState(null); // Track expanded payment
  const { user } = useAuth();
  const location = useLocation();
  const [currentPage, setCurrentPage] = useState(1);
  const paymentsPerPage = 10;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Fetch payments when component mounts or userId changes
  useEffect(() => {
    if (!user?.id) {
      setIdLoading(true); // Still waiting for id
      return;
    }
    // Id is available, start fetching payments
    setIdLoading(false); // Id is ready
    setFetchLoading(true);

    const abortController = new AbortController();
    // Start API fetch loading
    const fetchPayments = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/payments/mypayments`,
          { userId: user?.id }, // Send userId in the request body
          { signal: abortController.signal }
        );

        if (response.data.success) {
          setPayments(response.data.payments);
        } else {
          toast.error(response.data.message || "No payments found.");
        }
      } catch (error) {
        if (abortController.signal.aborted) {
          console.log("Fetch aborted");
          return;
        }
        if (error.response) {
          // Handle 400 (userId missing) or 500 errors from backend
          toast.error(error.response.data.error || "Failed to fetch payments.");
        } else if (error.request) {
          toast.error("Unable to reach the server.");
        } else {
          toast.error("An unexpected error occurred.");
        }
      } finally {
        setFetchLoading(false);
        setHasFetched(true);
      }
    };

    if (user?.id) {
      fetchPayments();
    }

    // Cleanup function to abort the request if the component unmounts
    return () => {
      abortController.abort();
    };
  }, [user?.id, location.key]);

  // Calculate total pages
  const totalPages = Math.ceil(payments.length / paymentsPerPage);

  // Get current payments
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = payments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    // Always add page 1
    pageNumbers.push(1);

    // Add previous 3 pages if we're beyond page 4
    if (currentPage > 4) {
      for (let i = currentPage - 3; i < currentPage; i++) {
        pageNumbers.push(i);
      }
    } else {
      // If we're in first 4 pages, just add pages 2-4
      for (let i = 2; i < currentPage; i++) {
        pageNumbers.push(i);
      }
    }

    // Add current page if not already added
    if (currentPage !== 1) {
      pageNumbers.push(currentPage);
    }

    return pageNumbers.sort((a, b) => a - b);
  };

  // Toggle accordion for a payment
  const toggleAccordion = (paymentId) => {
    setExpandedPaymentId((prevId) => (prevId === paymentId ? null : paymentId));
  };

  return (
    <div className="my-payments">
      <div className="mypayments-heading">
        <h2>My Payments</h2>
      </div>
      {fetchLoading ? (
        <LoaderLight />
      ) : hasFetched && payments.length === 0 ? (
        <p className="no-payments">No payments found.</p>
      ) : (
        <>
          <div className="payments-list">
            {currentPayments.map((payment) => (
              <div
                key={payment.id}
                className={`payment-item ${
                  expandedPaymentId === payment.id ? "expanded" : ""
                }`}
              >
                <div
                  className="mypayment-header"
                  onClick={() => toggleAccordion(payment.id)}
                >
                  <div className="payment-summary">
                    <div className="payment-info">
                      <div className="payment-main">
                        <span className="product-name">
                          {payment.product_name}
                        </span>
                        <span className="payment-amount">
                          ${payment.amount}
                        </span>
                      </div>
                    </div>
                    <div className="payment-status">
                      <span
                        className={`status ${payment.status.toLowerCase()}`}
                      >
                        {payment.status}
                      </span>
                      <span className="payment-date">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </span>
                      <div className="arrow">
                        {expandedPaymentId === payment.id ? (
                          <ChevronUp />
                        ) : (
                          <ChevronDown />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {expandedPaymentId === payment.id && (
                  <div className="payment-details">
                    <div className="details-left">
                      <p>User ID: {payment.user_id}</p>
                      <p>Service: {payment.product_name}</p>
                      <p>Amount: ${payment.amount}</p>
                      <p>
                        Date:{" "}
                        {new Date(payment.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="details-center">
                      {payment.image_path && (
                        <img
                          src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${
                            payment.image_path
                          }`}
                          alt="Payment Receipt"
                          className="payment-image"
                        />
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Pagination */}
          <div className="pagination">
            {getPageNumbers().map((number) => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`pagination-button ${
                  currentPage === number ? "active" : ""
                }`}
              >
                {number}
              </button>
            ))}
            {currentPage < totalPages && (
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                className="next-button"
              >
                Next
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default MyPayments;
