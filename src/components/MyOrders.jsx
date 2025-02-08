import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../AuthContext";
import "./MyOrders.css";
import { useLocation } from "react-router-dom";
import LoaderLight from "./LoaderLight";
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const location = useLocation();

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

  // Fetch orders for the user
  useEffect(() => {
    if (!user?.id) return; // Ensure user ID is available
    const abortController = new AbortController();
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        setOrders([]);
        // Fetch orders from the backend
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/orders/myorders`,
          { userId: user?.id },
          { signal: abortController.signal }
        );

        // Set the fetched orders
        setOrders(response.data);
      } catch (error) {
        if (!abortController.signal.aborted) {
          console.error("Error fetching orders:", error);
          setError("Failed to fetch orders. Please try again.");
          toast.error("Failed to fetch orders. Please try again.", {
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

    if (user?.id) {
      fetchOrders();
    }

    return () => {
      abortController.abort();
    };
  }, [user?.id, location.key]);

  // Calculate total pages
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  // Get current orders
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

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

  return (
    <div className="myorders-wrapper">
      <div className="myorders-header">
        <h2>My Orders</h2>
      </div>
      {loading ? (
        <LoaderLight />
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : orders.length === 0 ? (
        <p className="no-orders">No orders found.</p>
      ) : (
        <>
          <div className="myorders-list">
            {currentOrders.map((order) => (
              <div key={order.id} className="myorder-item">
                <div className="order-header">
                  <span className="myorder-id">Order ID: {order.id}</span>
                  <span className="order-status">
                    <span
                      className={`my-order-status ${
                        order.status === "confirmed"
                          ? "confirmed"
                          : order.status === "rejected"
                          ? "rejected"
                          : "waiting"
                      }`}
                    >
                      {order.status}
                    </span>
                  </span>
                </div>
                <div className="order-body">
                  <div className="order-info">
                    <p>Product: {order.product_name}</p>
                    <p>Username: {order.username}</p>
                    <p>Price: ${order.total_price}</p>
                    <p>Quantity: {order.quantity}</p>
                    <p>
                      Date: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
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

export default MyOrders;
