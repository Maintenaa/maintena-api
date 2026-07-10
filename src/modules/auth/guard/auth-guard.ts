import { jwtConfig } from "@/core/config";
import { UserRole } from "@/generated/prisma/enums";
import { UserRepository } from "@/modules/user/repository/user-repository";
import { ApiError } from "@/shared/error";
import jwt from "@elysia/jwt";
import Elysia from "elysia";
import Container from "typedi";
import { AuthJwtPayload } from "../schema/auth-schema";

export function authGuard(roles?: UserRole[]) {
  return new Elysia({
    detail: {
      security: [
        {
          "Bearer Auth": [],
        },
      ],
    },
  })
    .use(
      jwt({
        secret: jwtConfig.auth.accessTokenSecret,
        alg: jwtConfig.auth.algorithm,
      }),
    )
    .derive(async ({ jwt, headers }) => {
      const UNAUTHORIZED = new ApiError("Unauthorized", 401);

      const token = headers.Authorization || headers.authorization;
      if (!token) throw UNAUTHORIZED;

      const prefix = "Bearer";
      if (!token.startsWith(prefix))
        throw new ApiError("Invalid token schema", 422);

      const normalizedToken = token.replace(prefix, "").trimStart();
      const repo = Container.get(UserRepository);

      try {
        const payload = (await jwt.verify(
          normalizedToken,
        )) as AuthJwtPayload | null;

        const id = payload?.sub;
        if (!id || payload.type != "access") throw UNAUTHORIZED;

        const user = await repo.findById(id);
        if (!user) throw UNAUTHORIZED;

        if (roles && !roles.includes(user.role))
          throw new ApiError("Forbidden", 403);

        return { user };
      } catch (error) {
        throw UNAUTHORIZED;
      }
    });
}
