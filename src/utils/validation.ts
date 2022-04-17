import * as Yup from "yup";

export const SignupSchema = Yup.object({
  email: Yup.string()
    .email("Email must be a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const LoginSchema = Yup.object({
  email: Yup.string()
    .email("Email must be a valid email")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});
