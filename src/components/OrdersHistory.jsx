import React, { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import "./OrdersHistory.css";
import LoaderLight from "./LoaderLight";
const OrdersHistory = () => {
  const { orders, ordersLoading, ordersError } = useOutletContext(); // Get the general infos passed from adminDashboard

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(10);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentPage]);

  // Derive orders count from the fetched orders data
  const ordersCount = orders.length;

  // Pagination Helpers
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

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
        {/* Next button with conditional rendering */}
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

  return (
    <div className="orders-wrapper">
      <div className="orders-header">
        <h2>Orders History</h2>
      </div>

      {ordersLoading ? (
        <LoaderLight />
      ) : ordersError ? (
        <p className="orders-message error">{ordersError}</p>
      ) : ordersCount === 0 ? (
        <p className="no-orders-history">No orders found.</p>
      ) : (
        <>
          <div className="orders-list">
            {currentOrders.map((order) => {
              const totalPrice = parseFloat(order.total_price);
              const formattedPrice = isNaN(totalPrice)
                ? "0.00"
                : Math.round(totalPrice * 100) / 100;

              return (
                <div key={order.id} className="order-item">
                  <div className="order-main">
                    <div className="order-info">
                      <span className="order-id">#{order.id}</span>
                      <span className="user-info">
                        {order.user_id} • {order.username}
                      </span>
                      <span className="user-info">
                        Product: {order.product_name}
                      </span>
                    </div>
                    <div className="order-details">
                      <span className="quantity">{order.quantity}</span>
                      <span className="price">
                        <span>
                          {" "}
                          $
                          {formattedPrice.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </span>
                      <span
                        className={`p-history-status ${order.status.toLowerCase()}`}
                      >
                        {order.status}
                      </span>
                      <span className="date">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Pagination */}
          {totalPages > 1 && renderPagination()}
        </>
      )}
    </div>
  );
};

export default OrdersHistory;
