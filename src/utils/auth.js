import setAuthToken from "./setAuthToken";
import { jwtDecode } from "jwt-decode";

export const clearAuth = () => {
  localStorage.removeItem("loggedUserId");
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  localStorage.removeItem("name");
  setAuthToken(null);
};

export const isTokenExpired = (token) => {
  if (!token) return true;

  try {
    const decoded = jwtDecode(token);
    return Date.now() >= decoded.exp * 1000;
  } catch (err) {
    return true;
  }
};

export const checkToken = () => {
  const token = localStorage.getItem("token");
  if (isTokenExpired(token)) {
    clearAuth();
    window.location.href = "/login";
  }
};
