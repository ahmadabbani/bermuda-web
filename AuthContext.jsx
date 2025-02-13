import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Ensure you have this package installed
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // New flag

  const navigate = useNavigate();
  //user wallet
  const fetchBalance = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/balance?user_id=${userId}`
      );
      const balance = response.data.balance || 0; // Default to 0 if balance is null/undefined

      setBalance(balance);
      return balance;
    } catch (err) {
      console.error("Error fetching balance:", err);
      return 0;
    }
  };

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        if (isLoggingOut) return;
        // First check localStorage for initial quick load
        const cachedUser = JSON.parse(localStorage.getItem("userData"));
        if (cachedUser) {
          setIsAuthorized(true);
          setUser(cachedUser);
        }
        const token = document.cookie
          .split("; ")
          .find((row) => row.startsWith("token="))
          ?.split("=")[1];

        if (token) {
          // Only run if the user is not already authorized

          const decodedToken = jwtDecode(token);
          if (decodedToken?.authorized) {
            setIsAuthorized(true);
            const userData = {
              username: decodedToken.username,
              email: decodedToken.email,
              role: decodedToken.role,
              id: decodedToken.id,
              phone: decodedToken.phone,
            };
            setUser(userData);
            // Update localStorage with fresh data
            localStorage.setItem("userData", JSON.stringify(userData));
            await fetchBalance(userData?.id); // Fetch balance after setting user
          } else {
            setIsAuthorized(false);
            //setUser(null);
            localStorage.removeItem("userData");
          }
        }
      } catch (err) {
        console.error("Invalid token:", err);
        handleLogout();
      } finally {
        setLoading(false);
      }
    };

    fetchAuthData();
  }, [isAuthorized, isLoggingOut]);

  // Unified logout function
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axios.post(
        `${import.meta.env.VITE_API_URL}/logout`,
        {},
        { withCredentials: true }
      );
      toast.success("Logged out successfully");
      setIsAuthorized(false);
      // setUser(null);
      localStorage.removeItem("userData");
      // Wait for state updates to complete
      await new Promise((resolve) => setTimeout(resolve, 0));
      setTimeout(() => {
        navigate("/signin");
      }, 1000);
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false); // Reset the logout flag
    }
  };

  return (
    <AuthContext.Provider
      value={{
        loading,
        isAuthorized,
        setIsAuthorized,
        user,
        setUser,
        balance,
        setBalance,
        fetchBalance,
        handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
