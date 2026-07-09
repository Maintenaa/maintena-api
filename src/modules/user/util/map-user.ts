import { User } from "@/generated/prisma/client";

export function mapUser(user: User) {
  return {
    ...user,
    password: undefined,
  };
}
