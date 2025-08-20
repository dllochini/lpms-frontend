export function redirectByRole(role) {
    switch (role) {
      case "Admin":
        return "/admin/dashboard";
      case "Field Officer":
       return "/fieldOfficer/dashboard";
      case "Manager":
       return "/manager/dashboard";
      case "Higher Management":
       return "/higherManager/dashboard";
      case "Accountant":
       return "/accountant/dashboard";
      default:
        return "/";
    }
  }
  