import * as yup from "yup";

const getUserSchema = (roles, { isEdit = false } = {}) => {
  return yup.object({
    designation: yup.string().required("Choose a designation"),
    role: yup.string().required("Choose a role"),
    division: yup
      .string()
      .test("division-required", "Choose a division", function (value) {
        const { role } = this.parent;
        const selectedRole = roles.find((r) => r._id === role);
        if (!selectedRole) return true;
        if (["Admin", "Higher Management"].includes(selectedRole.name)) {
          return true;
        } 
        return !!value;
      }),
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email format"),
    nic: yup
      .string()
      .matches(
        /^([0-9]{9}[vV]|[0-9]{12})$/,
        "Invalid NIC format. Must be 12 digits or 9 digits with 'V'/'v'"
      )
      .nullable()
      .notRequired(),
    contact_no: yup
      .string()
      .matches(/^[0-9]{10}$/, "Invalid format. Must be 10 digits")
      .nullable()
      .notRequired(),
    ...(isEdit
      ? {
          password: yup
            .string()
            .nullable()
            .notRequired()
            .min(8, "Password must be at least 8 characters")
            .matches(/[a-z]/, "At least one lowercase letter")
            .matches(/[A-Z]/, "At least one uppercase letter")
            .matches(/[0-9]/, "At least one number")
            .matches(/[@$!%*?&]/, "At least one special character"),
          confirmPassword: yup
            .string()
            .nullable()
            .notRequired()
            .oneOf([yup.ref("password"), null], "Passwords must match"),
        }
      : {
          password: yup
            .string()
            .required("Password is required")
            .min(8, "Password must be at least 8 characters")
            .matches(/[a-z]/, "At least one lowercase letter")
            .matches(/[A-Z]/, "At least one uppercase letter")
            .matches(/[0-9]/, "At least one number")
            .matches(/[@$!%*?&]/, "At least one special character"),
          confirmPassword: yup
            .string()
            .required("Please confirm your password")
            .oneOf([yup.ref("password"), null], "Passwords must match"),
        }),
  });
};

export default getUserSchema;
