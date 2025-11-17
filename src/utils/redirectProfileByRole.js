export function redirectProfileByRole(role) {
  switch (role) {
    case "Admin":
      return "/admin/profile";
    case "Field Officer":
      return "/fieldOfficer/profile";
    case "Manager":
      return "/manager/profile";
    case "Higher Management":
      return "/higherManager/profile";
    default:
      return "/";
  }
}
