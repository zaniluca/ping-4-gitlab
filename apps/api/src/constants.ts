import type { User } from "@prisma/client";

// Public facing fields for user model that can be sent to the client.
export const USER_PUBLIC_FIELDS: Partial<Record<keyof User, boolean>> = {
  id: true,
  email: true,
  hookId: true,
};
