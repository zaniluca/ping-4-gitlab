import * as Yup from "yup";

export const SignupSchema = Yup.object({
  email: Yup.string().email().required().label("Email"),
  password: Yup.string()
    .required()
    .label("Password")
    .min(6)
    .matches(/^(?=.*[a-z])/, "Must contain at least one lowercase character")
    .matches(/^(?=.*[A-Z])/, "Must contain at least one uppercase character")
    .matches(/^(?=.*[0-9])/, "Must contain at least one number")
    .matches(/^(?=.*[!@#%&])/, "Must contain at least one special character"),
});
