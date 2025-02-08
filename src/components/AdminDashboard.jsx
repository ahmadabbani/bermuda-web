import React, { useState, useEffect } from "react";
import axios from "axios";
import { Outlet } from "react-router-dom";
import DropdownButton from "./DropdownButton";
import "./AdminDashboard.css";
const AdminDashboard = () => {
  // State for Orders
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  // State for Total Users
  const [totalUsers, setTotalUsers] = useState(0);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  //State for Payments
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [paymentsError, setPaymentsError] = useState("");

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const updatePaymentStatus = (paymentID, newStatus) => {
    setPayments((prevPayments) =>
      prevPayments.map((payment) =>
        payment.id === paymentID ? { ...payment, status: newStatus } : payment
      )
    );
  };

  // Function to fetch all orders
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/orders`
      );
      setOrders(response.data); // Assuming API returns an array of orders
      setOrdersError("");
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrdersError("Failed to fetch orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  // Function to fetch total users
  const fetchTotalUsers = async () => {
    try {
      setUsersLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/count`
      );
      setTotalUsers(response.data.count);
      setUsersError("");
    } catch (error) {
      console.error("Error fetching total users:", error);
      setUsersError("Failed to fetch total users.");
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch active payments
  const fetchAllPayments = async () => {
    try {
      setPaymentsLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/waiting-payments`
      );
      if (response.data.success) {
        setPayments(response.data.payments);
        setPaymentsError("");
      } else {
        if (response.status === 404) {
          setPayments([]); // Clear payments
        } else {
          setPaymentsError(
            response.data.message || "No active payments found."
          );
        }
      }
    } catch (error) {
      if (error.response) {
        // Server responded with an error status
        if (error.response.status === 404) {
          setPayments([]); // Clear payments
        } else {
          setPaymentsError(
            error.response.data.error ||
              "Failed to fetch payments. Please try again later."
          );
        }
      } else if (error.request) {
        // Request was made but no response received
        setPaymentsError("Unable to reach the server. Please try again later.");
      } else {
        // Something else went wrong
        setPaymentsError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setPaymentsLoading(false); // Stop API fetch loading
    }
  };

  // Fetch all data on component mount
  useEffect(() => {
    fetchOrders();
    fetchTotalUsers();
    fetchAllPayments();
  }, []);

  // Derive active payments count from the fetched payments data
  const paymentsCount = payments.length;

  // Derive orders count from the fetched orders data
  const ordersCount = orders.length;

  // Calculate total sales from orders
  const totalSales = orders.reduce((sum, order) => sum + order.total_price, 0);

  // Calculate weekly sales (last 7 days)
  const weeklySales = orders
    .filter((order) => {
      const orderDate = new Date(order.created_at); // Parse "2025-01-11 21:09:54" to Date object
      const today = new Date();
      const oneWeekAgo = new Date(today.setDate(today.getDate() - 7)); // Calculate date 7 days ago
      return orderDate >= oneWeekAgo; // Filter orders from the last 7 days
    })
    .reduce((sum, order) => sum + order.total_price, 0);

  // Calculate monthly sales (last 30 days)
  const monthlySales = orders
    .filter((order) => {
      const orderDate = new Date(order.created_at); // Parse "2025-01-11 21:09:54" to Date object
      const today = new Date();
      const oneMonthAgo = new Date(today.setDate(today.getDate() - 30)); // Calculate date 30 days ago
      return orderDate >= oneMonthAgo; // Filter orders from the last 30 days
    })
    .reduce((sum, order) => sum + order.total_price, 0);

  return (
    <div className="admin-dashboard">
      <DropdownButton
        ordersLoading={ordersLoading}
        orders={orders}
        paymentsLoading={paymentsLoading}
        payments={payments}
      />
      {/* Pass general infos as props to admin home*/}
      <Outlet
        context={{
          orders,
          updateOrderStatus, // Pass the state updater function
          ordersLoading,
          ordersError,
          payments,
          paymentsLoading,
          paymentsError,
          updatePaymentStatus,
          usersLoading,
          usersError,
          totalUsers,
        }}
      />
    </div>
  );
};

export default AdminDashboard;
