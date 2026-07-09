import { Static, t } from "elysia";
import { REFRESH_TOKEN_COOKIE_KEY } from "../auth-constant";
import type { JwtPayload } from "jsonwebtoken";

export const refreshTokenCookieKey = "refreshToken";

export const authResponseSchema = t.Object({
  accessToken: t.String(),
  refreshToken: t.String(),
});

export type AuthResponse = Static<typeof authResponseSchema>;

export const refreshTokenRequestSchema = t.Object({
  [REFRESH_TOKEN_COOKIE_KEY]: t.String(),
});

export type RefreshTokenRequest = Static<typeof refreshTokenRequestSchema>;

export interface AuthJwtPayload extends JwtPayload {
  sub: string;
  type: "access" | "refresh";
  [key: string]: any;
}
