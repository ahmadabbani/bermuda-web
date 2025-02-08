import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./DropDown.css";
import { ChevronDown, ChevronUp, LayoutDashboard, Plus } from "lucide-react";
const DropdownButton = ({
  ordersLoading,
  orders,
  paymentsLoading,
  payments,
}) => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility
  const navigate = useNavigate();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Handle option click
  const handleOptionClick = (path) => {
    navigate(path); // Navigate to the specified path
    toggleDropdown(); // Close the dropdown
  };

  return (
    <div className="admin-dropdown">
      <button className="dropdown-button" onClick={toggleDropdown}>
        Admin {isOpen ? <ChevronUp /> : <ChevronDown />}
      </button>

      {isOpen && (
        <div className="dropdown-menu">
          <ul className="dropdown-list">
            <li
              className="dropdown-item dropdown-item-dashboard"
              onClick={() => handleOptionClick("/admin")}
            >
              <span>
                <LayoutDashboard />
              </span>{" "}
              Admin Dashboard
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleOptionClick("/admin/create")}
            >
              Create Items <Plus />
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleOptionClick("/admin/orders")}
            >
              Orders History
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleOptionClick("/admin/payments-history")}
            >
              Payments History
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleOptionClick("/admin/active-payments")}
            >
              Active Payments
              <span className="badge">
                {paymentsLoading ? (
                  <span className="loading-text">...</span>
                ) : (
                  payments.filter((payment) => payment.status === "waiting")
                    .length
                )}
              </span>
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleOptionClick("/admin/users")}
            >
              All Users
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleOptionClick("/admin/active-orders")}
            >
              Active Orders
              <span className="badge">
                {ordersLoading ? (
                  <span className="loading-text">...</span>
                ) : (
                  orders.filter((order) => order.status === "waiting").length
                )}
              </span>
            </li>
            <li
              className="dropdown-item"
              onClick={() => handleOptionClick("/admin/create-admin")}
            >
              New Admin <Plus />
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default DropdownButton;
