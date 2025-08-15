// src/utils/redirectByRole.js
export function redirectByRole(role) {
    switch (role) {
      case "admin":
        return "/admin/dashboard";
      case "user":
        return "/user/dashboard";
      case "fieldOfficer":
       return "/fieldOfficer/dashboard";
      case "manager":
       return "/manager/dashboard";
      case "higherManager":
       return "/higherManager/dashboard";
      case "accountant":
       return "/accountant/dashboard";
      default:
        return "/";
    }
  }
  