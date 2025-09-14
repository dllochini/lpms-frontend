import setAuthToken from "./setAuthToken";
import { jwtDecode } from "jwt-decode";

export const clearAuth = () => {
  localStorage.removeItem("loggedUserId");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  setAuthToken(null);
};

// Check if token is expired
export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    return Date.now() >= decoded.exp * 1000; // exp is in seconds
  } catch (err) {
    return true;
  }
};

// Auto-logout if token expired
export const checkToken = () => {
  const token = localStorage.getItem("token");
  if (isTokenExpired(token)) {
    clearAuth();
    window.location.href = "/login"; // redirect to login page
  }
};
