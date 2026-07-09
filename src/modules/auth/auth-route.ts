import { loginRequestSchema } from "./schema/login-schema";
import { isDevelopment } from "@/core/config";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { authRepository } from "./auth-module";
import Elysia, { Cookie } from "elysia";
import {
  authResponseSchema,
  refreshTokenRequestSchema,
} from "./schema/auth-schema";
import { REFRESH_TOKEN_COOKIE_KEY } from "./auth-constant";
import { authGuard } from "./guard/auth-guard";
import { userResponseSchema } from "../user/schema/user-schema";

export function authRoute() {
  function setRefreshTokenCookie(
    cookie: Record<string, Cookie<unknown>>,
    value: string,
  ) {
    const refreshToken = cookie[REFRESH_TOKEN_COOKIE_KEY];

    refreshToken.value = value;
    refreshToken.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    refreshToken.httpOnly = true;
    refreshToken.secure = !isDevelopment();
    refreshToken.sameSite = isDevelopment() ? "none" : "lax";
  }

  return new Elysia({ detail: { tags: ["Auth"] } })
    .model("LoginRequest", loginRequestSchema)
    .model("AuthResponse", createApiResponseSchema(authResponseSchema))

    .post(
      "/login",
      async ({ body, cookie }) => {
        const result = await authRepository.login(body);
        setRefreshTokenCookie(cookie, result.refreshToken);

        return ok(result, { message: "Login success" });
      },
      {
        detail: {
          summary: "Login",
        },
        body: "LoginRequest",
        response: {
          200: "AuthResponse",
        },
      },
    )

    .post(
      "/refresh-token",
      async ({ cookie }) => {
        const token = cookie.refreshToken.value;
        const result = await authRepository.refreshToken(token);
        setRefreshTokenCookie(cookie, result.refreshToken);

        return ok(result, { message: "Token refreshed" });
      },
      {
        cookie: refreshTokenRequestSchema,
        response: {
          200: "AuthResponse",
        },
        detail: {
          summary: "Refresh Token",
        },
      },
    )

    .use(
      authGuard()
        .model("ProfileResponse", createApiResponseSchema(userResponseSchema))

        .get(
          "/profile",
          ({ user }) => {
            return ok(user as any, { message: "Profile fetched" });
          },
          {
            detail: {
              summary: "Get Profile",
            },
            response: {
              200: "ProfileResponse",
            },
          },
        ),
    );
}
