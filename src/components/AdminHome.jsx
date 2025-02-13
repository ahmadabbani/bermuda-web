import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ShoppingCart,
  CreditCard,
  Users,
  DollarSign,
  Clock,
  Calendar,
} from "lucide-react";
const AdminHome = () => {
  const {
    orders,
    ordersLoading,
    ordersError,
    payments,
    paymentsLoading,
    paymentsError,
    usersLoading,
    usersError,
    totalUsers,
  } = useOutletContext(); // Get the general infos passed from adminDashboard

  const navigate = useNavigate();

  // Derive  total payments count from the fetched payments data
  const paymentsCount = payments.length;

  // Derive waiting payments count from the fetched payments data
  const activePaymentsCount = payments.filter(
    (payment) => payment.status === "waiting"
  ).length;

  // Derive total orders count from the fetched orders data
  const ordersCount = orders.length;

  // Derive waiting orders count from the fetched orders data
  const activeOrdersCount = orders.filter(
    (order) => order.status === "waiting"
  ).length;

  // Calculate total sales from orders
  /*const totalSales = orders.reduce((sum, order) => sum + order.total_price, 0);

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
    .reduce((sum, order) => sum + order.total_price, 0);*/
  // Helper functions first
  const getDateDaysAgo = (days) => {
    const date = new Date();
    // Convert current date to UTC+2
    date.setHours(date.getUTCHours() + 2);
    date.setDate(date.getDate() - days);
    // Set to start of day in Beirut time (UTC+2)
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const getStartOfMonth = () => {
    const date = new Date();
    // Convert current date to UTC+2
    date.setHours(date.getUTCHours() + 2);
    date.setDate(1); // First day of current month
    date.setHours(0, 0, 0, 0);
    return date;
  };

  const convertToBeirutTime = (utcDateString) => {
    const date = new Date(utcDateString);
    // Convert to UTC+2
    date.setHours(date.getUTCHours() + 2);
    return date;
  };

  const formatCurrency = (value) => {
    // Handle null, undefined, or NaN
    if (value == null || isNaN(value)) return "0.00";

    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "0.00";

    return numValue.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Main calculation function
  const calculateSalesMetrics = (payments) => {
    if (!Array.isArray(payments)) {
      return { totalSales: 0, weeklySales: 0, monthlySales: 0 };
    }

    // Only consider confirmed payments
    const confirmedPayments = payments.filter(
      (payment) => payment?.status === "confirmed"
    );

    // Total sales (all time)
    const totalSales = confirmedPayments.reduce(
      (sum, payment) => sum + (parseFloat(payment.amount) || 0),
      0
    );

    // Get reference dates
    const sevenDaysAgo = getDateDaysAgo(7);
    const startOfMonth = getStartOfMonth();

    // Weekly sales (last 7 days)
    const weeklySales = confirmedPayments
      .filter((payment) => {
        const paymentDate = convertToBeirutTime(payment.created_at);
        return paymentDate >= sevenDaysAgo;
      })
      .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);

    // Monthly sales (from start of current month)
    const monthlySales = confirmedPayments
      .filter((payment) => {
        const paymentDate = convertToBeirutTime(payment.created_at);
        return paymentDate >= startOfMonth;
      })
      .reduce((sum, payment) => sum + (parseFloat(payment.amount) || 0), 0);

    return {
      totalSales,
      weeklySales,
      monthlySales,
    };
  };

  // Usage in component
  const metrics = calculateSalesMetrics(payments);
  const Widget = ({
    title,
    icon: Icon,
    loading,
    error,
    children,
    className,
  }) => (
    <div className={`widget ${className}`}>
      <div className="widget-header">
        <h3 className="widget-title">{title}</h3>
        {Icon && <Icon size={25} color="#6c757d" />}
      </div>
      <div className="widget-content">
        {loading ? (
          <p className="widget-loading">Loading...</p>
        ) : error ? (
          <p className="widget-error">{error}</p>
        ) : (
          children
        )}
      </div>
    </div>
  );

  return (
    <div className="dashboard-wrapper">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
        </div>

        <div className="row g-4">
          <div className="col-12 col-md-6 col-lg-3">
            <Widget
              title="Total Orders"
              icon={ShoppingCart}
              loading={ordersLoading}
              error={ordersError}
              className="widget-orders"
            >
              <p className="widget-value">{ordersCount}</p>
            </Widget>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <Widget
              title="Total Payments"
              icon={CreditCard}
              loading={paymentsLoading}
              error={paymentsError}
              className="widget-payments"
            >
              <p className="widget-value">{paymentsCount}</p>
            </Widget>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <Widget
              title="Total Users"
              icon={Users}
              loading={usersLoading}
              error={usersError}
              className="widget-users"
            >
              <p className="widget-value">{totalUsers}</p>
            </Widget>
          </div>

          <div className="col-12 col-md-6 col-lg-3">
            <Widget
              title="Total Sales"
              icon={DollarSign}
              loading={ordersLoading}
              error={ordersError}
              className="widget-sales"
            >
              <p className="widget-value">
                ${formatCurrency(metrics?.totalSales || 0)}
              </p>
            </Widget>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <Widget
              title="Weekly Sales"
              icon={Clock}
              loading={ordersLoading}
              error={ordersError}
              className="widget-weekly-sales"
            >
              <p className="widget-value">
                ${formatCurrency(metrics?.weeklySales || 0)}
              </p>
            </Widget>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <Widget
              title="Monthly Sales"
              icon={Calendar}
              loading={ordersLoading}
              error={ordersError}
              className="widget-monthly-sales"
            >
              <p className="widget-value">
                ${formatCurrency(metrics?.monthlySales || 0)}
              </p>
            </Widget>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <Widget
              title="New Orders (Waiting)"
              icon={ShoppingCart}
              loading={ordersLoading}
              error={ordersError}
              className="widget-waiting-orders"
            >
              <p className="widget-value">{activeOrdersCount}</p>
              <button
                className="widget-action-button"
                onClick={() => navigate("/admin/active-orders")}
              >
                New Orders
              </button>
            </Widget>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <Widget
              title="New Payments (Waiting)"
              icon={CreditCard}
              loading={ordersLoading}
              error={paymentsError}
              className="widget-waiting-payments"
            >
              <p className="widget-value">{activePaymentsCount}</p>
              <button
                className="widget-action-button"
                onClick={() => navigate("/admin/active-payments")}
              >
                New Payments
              </button>
            </Widget>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
