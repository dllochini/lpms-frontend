export function redirectByRole(role) {
    switch (role) {
      case "Admin":
        return "/admin/dashboard";
      case "Field Officer":
       return "/fieldOfficer";
      case "Manager":
       return "/manager";
      case "Higher Management":
       return "/higherManager";
      case "Accountant":
       return "/accountant";
      default:
        return "/";
    }
  }
  