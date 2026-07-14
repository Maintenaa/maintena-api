import { loginRequestSchema } from "./schema/login-schema";
import { registerRequestSchema } from "./schema/register-schema";
import { isDevelopment } from "@/core/config";
import { ok } from "@/shared/schema/api-schema";
import { authRepository } from "./auth-module";
import Elysia, { Cookie } from "elysia";
import { refreshTokenRequestSchema } from "./schema/auth-schema";
import { REFRESH_TOKEN_COOKIE_KEY } from "./auth-constant";
import { authGuard } from "./guard/auth-guard";

export function authRoute() {
  function setRefreshTokenCookie(
    cookie: Record<string, Cookie<unknown>>,
    value: string,
  ) {
    const refreshToken = cookie[REFRESH_TOKEN_COOKIE_KEY];

    refreshToken.value = value;
    refreshToken.expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    refreshToken.httpOnly = true;

    if (!isDevelopment()) {
      refreshToken.secure = true;
      refreshToken.sameSite = "lax";
    }
  }

  return new Elysia({ detail: { tags: ["Auth"] } })
    .model("LoginRequest", loginRequestSchema)
    .model("RegisterRequest", registerRequestSchema)

    .post(
      "/register",
      async ({ body, cookie }) => {
        const result = await authRepository.register(body);
        setRefreshTokenCookie(cookie, result.refreshToken);

        return ok(result, { message: "Registration success" });
      },
      {
        detail: {
          summary: "Register",
        },
        body: "RegisterRequest",
      },
    )

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
        detail: {
          summary: "Refresh Token",
        },
      },
    )

    .use(
      authGuard()

        .get(
          "/profile",
          ({ user }) => {
            return ok(user as any, { message: "Profile fetched" });
          },
          {
            detail: {
              summary: "Get Profile",
            },
          },
        ),
    );
}
