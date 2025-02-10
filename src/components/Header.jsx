import { Link, useNavigate, useRevalidator } from "react-router-dom";
import axios from "axios";
import {
  ChevronDown,
  House,
  LogOut,
  UserRound,
  Menu,
  X,
  BadgePlus,
  CirclePlus,
} from "lucide-react";

import { useEffect, useState } from "react";

import { useAuth } from "../../AuthContext";
import "./Header.css";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false); // State to manage dropdown visibility
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    isAuthorized,
    setIsAuthorized,
    user,
    setUser,
    setBalance,
    handleLogout,
  } = useAuth();

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navigate = useNavigate();
  useEffect(() => {
    // Close the dropdown when the route changes
    setIsOpen(false);
  }, [navigate]);

  /* const handleLogout = async () => {
    try {
      // Call the logout endpoint to clear the token cookie
      const response = await axios.post(
        "http://localhost:5000/api/logout",
        {}, // No request body needed
        { withCredentials: true } // Include credentials (cookies)
      );

      // Show a success message
      if (response.data.success) {
        toast.success(response.data.message);
        console.log("Logout response:", response.data);
        // Update authorization state and clear user info
        setIsAuthorized(false);
        setUser(null);
        setBalance(0);
        localStorage.removeItem("userData");
        // Redirect to the sign-in page after a brief delay

        setTimeout(() => {
          navigate("/signin");
        }, 1000);
      } else {
        // Handle unsuccessful logout
        toast.error("Failed to logout. Please try again.");
      }
      //  to show the toast message
    } catch (err) {
      // Handle errors
      toast.error("Failed to logout. Please try again.");
      console.error("Error logging out:", err);
    }
  }; */

  const NavLinks = ({ hoverEffect = true, closeMobileMenu }) => (
    <>
      <Link
        className="btn btn-link text-main me-0"
        to="/dashboard"
        onClick={closeMobileMenu}
      >
        <House color="#2c3e50" size={28} style={{ strokeWidth: 2 }} />
      </Link>

      {isAuthorized ? (
        <>
          <Link
            className={`btn btn-link  text-main me-0 ${
              hoverEffect ? "hover-underline" : ""
            }`}
            to="/my-orders"
            onClick={closeMobileMenu}
          >
            My Orders
          </Link>
          <Link
            className={`btn btn-link  text-main me-0 ${
              hoverEffect ? "hover-underline" : ""
            }`}
            to="/my-payments"
            onClick={closeMobileMenu}
          >
            My Payments
          </Link>
          <Link
            className={`btn btn-link  text-main me-0 ${
              hoverEffect ? "hover-underline" : ""
            }`}
            to="/charge"
            onClick={closeMobileMenu}
          >
            Add Credit
          </Link>
          {user?.role === "admin" && (
            <Link
              className={`btn btn-link  text-main me-0 ${
                hoverEffect ? "hover-underline" : ""
              }`}
              to="/admin"
              onClick={closeMobileMenu}
            >
              Admin Dashboard
            </Link>
          )}
          <div className="account-dropdown me-0">
            <button
              className="account-button btn btn-link  text-main d-fl ${hoverEffect ? 'hover-underline' : ''}`ex align-items-center"
              onClick={toggleDropdown}
            >
              My Account
              <ChevronDown size={16} className="ms-1" />
            </button>
            {isOpen && (
              <div className="menu shadow-sm">
                <div
                  className="item"
                  onClick={() => {
                    navigate(`/profile/${user?.id}`);
                    closeMobileMenu();
                  }}
                >
                  <UserRound
                    color="#2c3e50"
                    size={20}
                    style={{ strokeWidth: 3 }}
                  />{" "}
                  Profile
                </div>
                <div
                  className="item"
                  onClick={async () => {
                    await handleLogout(); // Wait for the logout process to complete
                    closeMobileMenu(); // Then run the closeMobileMenu function
                  }}
                >
                  <LogOut
                    color="#2c3e50"
                    size={20}
                    style={{ strokeWidth: 3 }}
                  />{" "}
                  Logout
                </div>
                <div
                  className="item"
                  onClick={() => {
                    navigate("/signup");
                    closeMobileMenu();
                  }}
                >
                  <CirclePlus
                    color="#2c3e50"
                    size={20}
                    style={{ strokeWidth: 3 }}
                  />{" "}
                  Register
                </div>
              </div>
            )}
          </div>
          <Link
            className={`btn btn-link  text-main me-0 ${
              hoverEffect ? "hover-underline" : ""
            }`}
            to="/about-us"
            onClick={closeMobileMenu}
          >
            About Us
          </Link>
          <Link
            className={`btn btn-link  text-main me-0 ${
              hoverEffect ? "hover-underline" : ""
            }`}
            to="/contact-us"
            onClick={closeMobileMenu}
          >
            Contact Us
          </Link>
        </>
      ) : (
        <>
          <Link
            className={`btn btn-link  text-main me-0 ${
              hoverEffect ? "hover-underline" : ""
            }`}
            to="/about-us"
            onClick={closeMobileMenu}
          >
            About Us
          </Link>
          <Link
            className={`btn btn-link  text-main me-0 ${
              hoverEffect ? "hover-underline" : ""
            }`}
            to="/contact-us"
            onClick={closeMobileMenu}
          >
            Contact Us
          </Link>
          <Link
            className="btn-link text-main customSignin me-2"
            to="/signin"
            onClick={closeMobileMenu}
          >
            Sign In
          </Link>
          <Link
            className="btn-link text-main customSignin me-0"
            to="/signup"
            onClick={closeMobileMenu}
          >
            Register
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="navbar">
      <div className="container-fluid nav-container d-flex justify-content-between align-items-center">
        <Link className="logo-link" to="/dashboard">
          <img src="/images/logo-icon.png" className="logo" alt="Logo" />
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-nav d-none d-lg-flex align-items-center">
          <NavLinks hoverEffect={true} />
        </div>

        {/* Mobile Toggle */}
        <button
          className="mobile-menu-button d-lg-none"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="mobile-menu active">
            <div className="mobile-menu-content">
              <NavLinks hoverEffect={false} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;
