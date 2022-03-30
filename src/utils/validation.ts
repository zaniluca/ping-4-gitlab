import * as yup from "yup";

export const signupSchema = yup.object({
  email: yup
    .string()
    .email("Email must be a valid email")
    .required("Email is required"),
  password: yup.string().required("Password is required"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});
