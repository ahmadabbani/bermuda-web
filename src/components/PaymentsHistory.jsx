import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { ChevronDown, ChevronUp } from "lucide-react";
import "./MyPayments.css"; // Add some basic styling
import LoaderLight from "./LoaderLight";

const PaymentsHistory = () => {
  const { payments, paymentsError, paymentsLoading } = useOutletContext();
  const [expandedPaymentId, setExpandedPaymentId] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Toggle accordion for a payment
  const toggleAccordion = (paymentId) => {
    setExpandedPaymentId((prevId) => (prevId === paymentId ? null : paymentId));
  };

  // Pagination Helpers
  const indexOfLastPayment = currentPage * paymentsPerPage;
  const indexOfFirstPayment = indexOfLastPayment - paymentsPerPage;
  const currentPayments = payments.slice(
    indexOfFirstPayment,
    indexOfLastPayment
  );
  const totalPages = Math.ceil(payments.length / paymentsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

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
            key="next"
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

  // Show error toast if there's an error
  if (paymentsError) {
    toast.error(paymentsError);
  }

  return (
    <div className="my-payments">
      <div className="mypayments-heading">
        <h2>Payments History</h2>
      </div>
      {paymentsLoading ? (
        <LoaderLight />
      ) : payments.length === 0 ? (
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
                      <span className="payment-username">
                        • {payment.username}
                      </span>
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
                      <p>Username: {payment.username}</p>
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
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default PaymentsHistory;
