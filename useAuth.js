import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const useAuth = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchAuthData = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("token="))
        ?.split("=")[1];

      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          if (decodedToken?.authorized) {
            setIsAuthorized(true);
            setUser({
              username: decodedToken.username,
              email: decodedToken.email,
              role: decodedToken.role,
              id: decodedToken.id,
            });
          } else {
            setIsAuthorized(false);
            setUser(null);
          }
        } catch (err) {
          console.error("Invalid token:", err);
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
        setUser(null);
      }
    };

    fetchAuthData();
  }, []);

  return { isAuthorized, setIsAuthorized, user };
};
