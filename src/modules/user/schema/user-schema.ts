import { UserRole } from "@/generated/prisma/enums";
import { Static, t } from "elysia";

export const userResponseSchema = t.Object({
  id: t.String({ format: "uuid" }),
  email: t.String({ format: "email" }),
  name: t.String(),
  emailVerifiedAt: t.Optional(t.MaybeEmpty(t.Date())),
  role: t.Enum(UserRole),
  bannedUntil: t.Optional(t.MaybeEmpty(t.Date())),
  createdAt: t.Date(),
  updatedAt: t.Date(),
  deletedAt: t.Optional(t.MaybeEmpty(t.Date())),
});

export type UserResponse = Static<typeof userResponseSchema>;
