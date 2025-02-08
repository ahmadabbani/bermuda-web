import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { toast } from "react-toastify";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import LoaderDark from "./Loader";
import "./ActiveOrders.css";
const ActiveOrders = () => {
  const { orders, updateOrderStatus, ordersLoading, ordersError } =
    useOutletContext(); // Get the general infos passed from adminDashboard

  //pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Memoize the filtered orders to avoid recalculating on every render
  const waitingOrders = useMemo(
    () => orders.filter((order) => order.status === "waiting"),
    [orders] // Re-run only when `orders` changes
  );

  // Calculate pagination values
  const totalPages = Math.ceil(waitingOrders.length / ordersPerPage);
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = waitingOrders.slice(
    indexOfFirstOrder,
    indexOfLastOrder
  );

  // Generate page numbers for navigation
  const getPageNumbers = () => {
    const pageNumbers = [];

    // Always show page 1
    pageNumbers.push(1);

    if (currentPage > 4) {
      pageNumbers.push("...");
    }

    // Show previous 3 pages if applicable
    for (let i = Math.max(2, currentPage - 3); i < currentPage; i++) {
      pageNumbers.push(i);
    }

    // Show current page if not 1
    if (currentPage !== 1) {
      pageNumbers.push(currentPage);
    }

    // Show next 3 pages if applicable
    for (
      let i = currentPage + 1;
      i <= Math.min(totalPages, currentPage + 3);
      i++
    ) {
      pageNumbers.push(i);
    }

    if (totalPages > currentPage + 4) {
      pageNumbers.push("...");
    }

    // Show last page if not already included
    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const [loadingStates, setLoadingStates] = useState({});

  // Function to handle order action (accepted or rejected)
  const handleOrderAction = async (orderId, action) => {
    try {
      setLoadingStates((prev) => ({
        ...prev,
        [`${orderId}-${action}`]: true,
      }));
      // Send the action to the backend
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/action`,
        {
          orderId,
          action,
        }
      );

      // Show success toast with custom styles based on the action
      if (response.data.success) {
        if (action === "confirmed") {
          toast.success(`Order has been accepted.`, {});
        } else if (action === "rejected") {
          toast.warning(`Order has been rejected.`);
        }

        // Update the parent orders state to reflect changes
        updateOrderStatus(orderId, action);
      } else {
        toast.error(response.data.message || "Failed to update order status.", {
          position: "top-right", // Position of the toast
          autoClose: 5000, // Auto-close after 5 seconds
        });
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error("Failed to update order status. Please try again.", {
        position: "top-right", // Position of the toast
        autoClose: 3000, // Auto-close after 5 seconds
      });
    } finally {
      setLoadingStates((prev) => ({
        ...prev,
        [`${orderId}-${action}`]: false,
      }));
    }
  };

  return (
    <div className="active-orders-wrapper">
      <h2 className="active-orders-heading">Active Orders</h2>
      {ordersLoading ? (
        <LoaderDark />
      ) : ordersError ? (
        <p className="error-text">{ordersError}</p>
      ) : waitingOrders.length === 0 ? (
        <p className="no-orders-text">No active orders found.</p>
      ) : (
        <>
          <div className="active-orders-list">
            {currentOrders.map((order) => {
              // Parse the params string into name-value pairs
              const parsedParams = order.params
                ? order.params
                    .split(",")
                    .map((param) => {
                      const [name, value] = param.split(":");
                      return name && value
                        ? {
                            name: name.trim().toLowerCase(),
                            value: value.trim(),
                          }
                        : null;
                    })
                    .filter((param) => param)
                : [];

              return (
                <div className="order-card" key={order.id}>
                  {/* Left Section */}
                  <div className="order-content">
                    <div className="orderH-details">
                      <div className="top-details">
                        <p className="order-id">#{order.id}</p>
                        <span className="qty">Qty: {order.quantity}</span>
                        <span className="order-price">
                          Price:
                          <span className="price-value">
                            {" "}
                            ${order.total_price}
                          </span>
                        </span>
                      </div>
                      <p className="order-username">
                        <span className="big-dot"></span>
                        <span>
                          {" "}
                          <strong>Product: </strong>
                        </span>
                        <span>{order.product_name}</span>
                      </p>
                      <p className="order-username">
                        <span className="big-dot"></span>
                        <span>
                          {" "}
                          <strong>User: </strong>
                        </span>{" "}
                        {order.username ? order.username : "Unknown"}
                      </p>
                    </div>

                    {/* Right Section */}
                    <div className="order-actions">
                      <div className="right-infos">
                        <p className="status waiting">Waiting</p>
                        <p className="order-date">
                          <span className="label">Date:</span>{" "}
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="action-buttons">
                        <button
                          className="accept-button"
                          onClick={() =>
                            handleOrderAction(order.id, "confirmed")
                          }
                          disabled={loadingStates[`${order.id}-confirmed`]}
                        >
                          {loadingStates[`${order.id}-confirmed`] ? (
                            <Loader2 className="text-green w-100 h-100 animate-spin" />
                          ) : (
                            <CheckCircle className="text-green w-100 h-100" />
                          )}{" "}
                        </button>
                        <button
                          className="reject-button"
                          onClick={() =>
                            handleOrderAction(order.id, "rejected")
                          }
                          disabled={loadingStates[`${order.id}-rejected`]}
                        >
                          {loadingStates[`${order.id}-rejected`] ? (
                            <Loader2 className="text-red w-100 h-100 animate-spin" />
                          ) : (
                            <XCircle className="text-red w-100 h-100" />
                          )}{" "}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Params Section */}
                  {parsedParams.length > 0 ? (
                    <div className="order-params">
                      <h4 className="params-heading">Additional Information</h4>
                      {parsedParams.map((param, index) => (
                        <p className="param" key={index}>
                          <strong>{param.name}:</strong> {param.value}
                        </p>
                      ))}
                    </div>
                  ) : (
                    <div className="order-params">
                      <h4 className="params-heading">Additional Information</h4>
                      <p className="param">
                        <strong>Not Available</strong>
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <div className="pagination">
            {getPageNumbers().map((number, index) => (
              <button
                key={index}
                className={`pagination-button ${
                  number === currentPage ? "active" : ""
                } ${number === "..." ? "dots" : ""}`}
                onClick={() => number !== "..." && setCurrentPage(number)}
                disabled={number === "..."}
              >
                {number}
              </button>
            ))}
            {/* Next button */}
            {currentPage < totalPages && (
              <button
                className="next-button"
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
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

export default ActiveOrders;
