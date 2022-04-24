import * as Yup from "yup";

const emailBasicValidation = Yup.string()
  .email("Email must be a valid email")
  .required("Email is required");

const passwordBasicValidation = Yup.string().required("Password is required");

export const SignupSchema = Yup.object({
  email: emailBasicValidation,
  password: passwordBasicValidation,
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const LoginSchema = Yup.object({
  email: emailBasicValidation,
  password: passwordBasicValidation,
});
