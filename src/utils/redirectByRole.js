export function redirectByRole(role) {
    switch (role) {
      case "Admin":
        return "/admin";
      case "Field Officer":
       return "/fieldOfficer";
      case "Manager":
       return "/manager";
      case "Higher Management":
       return "/higherManager";
      default:
        return "/";
    }
  }
  