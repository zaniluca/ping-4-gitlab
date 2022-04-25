import * as Yup from "yup";

const emailBasicValidation = Yup.string().email().required().label("Email");

const passwordBasicValidation = Yup.string().required().label("Password");

export const SignupSchema = Yup.object({
  email: emailBasicValidation,
  password: passwordBasicValidation
    .min(6)
    .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
    .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must contain at least one number")
    .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character"),
  confirmPassword: Yup.string()
    .required("Please confirm your password")
    .oneOf([Yup.ref("password"), null], "Passwords must match"),
});

export const LoginSchema = Yup.object({
  email: emailBasicValidation,
  password: passwordBasicValidation,
});
