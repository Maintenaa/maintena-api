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

export function authRoute() {
  function setRefreshTokenCookie(
    cookie: Record<string, Cookie<unknown>>,
    value: string,
  ) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    cookie[REFRESH_TOKEN_COOKIE_KEY].set({
      value,
      expires,
      httpOnly: true,
      secure: !isDevelopment(),
      sameSite: isDevelopment() ? "none" : "lax",
    });
  }

  return new Elysia({ detail: { tags: ["Auth"] } })

    .post(
      "/login",
      async ({ body, cookie }) => {
        const result = await authRepository.login(body);
        setRefreshTokenCookie(cookie, result.refreshToken);

        return ok(result);
      },
      {
        detail: {
          summary: "Login",
        },
        body: loginRequestSchema,
        response: {
          200: createApiResponseSchema(authResponseSchema),
        },
      },
    )

    .post(
      "/refresh-token",
      async ({ cookie }) => {
        const token = cookie.refreshToken.value;
        const result = await authRepository.refreshToken(token);
        setRefreshTokenCookie(cookie, result.refreshToken);

        return ok(result);
      },
      {
        cookie: refreshTokenRequestSchema,
        response: {
          200: createApiResponseSchema(authResponseSchema),
        },
        detail: {
          summary: "Refresh Token",
        },
      },
    );
}
