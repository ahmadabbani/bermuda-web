import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./ActivePayments.css"; // Add some basic styling
import { useOutletContext } from "react-router-dom";
import { CheckCircle, Loader, Loader2, XCircle } from "lucide-react";
import LoaderDark from "./Loader";

const ActivePayments = () => {
  const { payments, updatePaymentStatus, paymentsLoading, paymentsError } =
    useOutletContext();
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Memoize the filtered payments to avoid recalculating on every render
  const waitingPayments = useMemo(
    () => payments.filter((payment) => payment.status === "waiting"),
    [payments] // Re-run only when `orders` changes
  );

  // Handle confirm or reject action
  const handleStatusUpdate = async (paymentId, action) => {
    try {
      setLoadingStates((prev) => ({
        ...prev,
        [`${paymentId}-${action}`]: true,
      })); // action loading
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/payments/${paymentId}/update-status`,
        { action } // Send the action ('confirm' or 'reject')
      );

      if (response.data.success) {
        if (response.data.color === "success") {
          toast.success(response.data.message);
        } else if (response.data.color === "warning") {
          toast.warning(response.data.message);
        }
        // Refresh the list of waiting payments
        updatePaymentStatus(paymentId, action);
      } else {
        toast.error(response.data.error || "Failed to update payment status.");
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Failed to update payment status. Please try again later.");
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [`${paymentId}-${action}`]: false,
      })); // Stop loading
    }
  };

  // Toggle accordion for a payment
  const toggleAccordion = (paymentId) => {
    setExpandedPaymentId((prevId) => (prevId === paymentId ? null : paymentId));
  };

  // Pagination calculations
  const totalPages = Math.ceil(waitingPayments.length / itemsPerPage);
  const paginatedPayments = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return waitingPayments.slice(startIndex, startIndex + itemsPerPage);
  }, [waitingPayments, currentPage]);

  // Reset to first page if current page exceeds total pages
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Generate visible page numbers
  const getVisiblePages = (currentPage, totalPages) => {
    const pages = [1]; // Always include first page
    // Show current page and up to 3 pages before, but avoid overlapping with page 1
    let start = Math.max(2, currentPage - 3);
    let end = Math.min(totalPages, currentPage);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="waiting-payments">
      <h2>Active Payments</h2>
      {paymentsLoading ? (
        <LoaderDark />
      ) : paymentsError ? (
        <p className="waiting-error">{paymentsError}</p>
      ) : waitingPayments.length === 0 ? (
        <p className="waiting-empty">No Active payments found.</p>
      ) : (
        <>
          <div className="waiting-list">
            {paginatedPayments.map((payment) => (
              <div key={payment.id} className="waiting-item">
                <div
                  className="waiting-item-header"
                  onClick={() => toggleAccordion(payment.id)}
                >
                  <div className="waiting-item-left">
                    <div className="waiting-row">
                      <span className="waiting-id">#{payment.id}</span>
                      <span className="waiting-product">
                        {payment.product_name}
                      </span>
                      <span className="waiting-amount">${payment.amount}</span>
                    </div>
                    <span className="waiting-user">• {payment.username}</span>
                  </div>

                  <div className="waiting-item-right">
                    <div className="waiting-row">
                      <span className="waiting-status">{payment.status}</span>
                      <span className="waiting-date">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="waiting-actions">
                      <button
                        className="waiting-confirm"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent accordion toggle
                          handleStatusUpdate(payment.id, "confirmed");
                        }}
                        disabled={loadingStates[`${payment.id}-confirmed`]}
                      >
                        {loadingStates[`${payment.id}-confirmed`] ? (
                          <Loader2 className="text-green w-100 h-100 animate-spin" />
                        ) : (
                          <CheckCircle className="text-green w-100 h-100" />
                        )}{" "}
                      </button>
                      <button
                        className="waiting-reject"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent accordion toggle
                          handleStatusUpdate(payment.id, "rejected");
                        }}
                        disabled={loadingStates[`${payment.id}-rejected`]}
                      >
                        {loadingStates[`${payment.id}-rejected`] ? (
                          <Loader2 className="text-red w-100 h-100 animate-spin" />
                        ) : (
                          <XCircle className="text-red w-100 h-100" />
                        )}{" "}
                      </button>
                    </div>
                  </div>
                </div>

                {expandedPaymentId === payment.id && (
                  <div className="waiting-details">
                    <div className="waiting-details-grid">
                      <span>User Id: {payment.user_id}</span>
                      <span>Service: {payment.product_name}</span>
                      <span>Amount: ${payment.amount}</span>
                      <span>
                        Date:{" "}
                        {new Date(payment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    {payment.image_path && (
                      <div className="waiting-image-container">
                        <img
                          src={payment.image_path} // Cloudinary URL is now stored directly in image_path
                          alt="Payment Receipt"
                          className="waiting-image"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              {getVisiblePages(currentPage, totalPages).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`pagination-button ${
                    currentPage === page ? "active" : ""
                  }`}
                >
                  {page}
                </button>
              ))}
              {currentPage < totalPages && (
                <button
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="next-button"
                >
                  Next
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ActivePayments;
