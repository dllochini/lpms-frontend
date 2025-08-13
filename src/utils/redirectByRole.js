// src/utils/redirectByRole.js
export function redirectByRole(role) {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "user":
        return "/user/dashboard";
      default:
        return "/";
    }
  }
  