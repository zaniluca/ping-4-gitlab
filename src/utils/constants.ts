import { AuthErrorCodes } from "firebase/auth";

// This should infer keyof typeof AuthErrorCodes but i can't find a way to optionalize the keys
export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  [AuthErrorCodes.CREDENTIAL_ALREADY_IN_USE]:
    "These credentials are already in use",
  [AuthErrorCodes.WEAK_PASSWORD]:
    "Password doesn't respect specified conditions",
  [AuthErrorCodes.INVALID_EMAIL]: "Email is invalid",
  [AuthErrorCodes.EMAIL_EXISTS]: "Email already in use",
  [AuthErrorCodes.INVALID_PASSWORD]: "Wrong Password",
  [AuthErrorCodes.USER_DELETED]: "User not found",
  [AuthErrorCodes.USER_DISABLED]: "User disabled",
};
