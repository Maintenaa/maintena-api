import { db, jwtConfig } from "@/core/config";
import { LoginRequest } from "../schema/login-schema";
import { RegisterRequest } from "../schema/register-schema";
import { ApiError } from "@/shared/error";
import { PasswordService } from "@/shared/service/password-service";
import Container, { Service } from "typedi";
import { User } from "@/generated/prisma/client";
import { sign, verify } from "jsonwebtoken";
import { AuthJwtPayload, AuthResponse } from "../schema/auth-schema";

@Service()
export class AuthRepository {
  private readonly password = Container.get(PasswordService);

  async register({
    name,
    email,
    password,
    company,
  }: RegisterRequest): Promise<AuthResponse> {
    const existingUser = await db.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (existingUser) {
      throw new ApiError("Email already exists", 409);
    }

    const hashedPassword = await this.password.hash(password);

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      const companyRecord = await tx.company.create({
        data: {
          name: company,
          ownerId: user.id,
        },
      });

      const position = await tx.position.create({
        data: {
          companyId: companyRecord.id,
          name: "Owner",
          isAdmin: true,
          isTechnician: false,
          isOwner: true,
        },
      });

      await tx.userCompany.create({
        data: {
          userId: user.id,
          companyId: companyRecord.id,
          positionId: position.id,
        },
      });

      return user;
    });

    return await this.createToken(result);
  }

  async login({ email, password }: LoginRequest): Promise<AuthResponse> {
    const user = await db.user.findFirst({ where: { email, deletedAt: null } });

    if (!user) {
      throw new ApiError("Invalid credentials", 404);
    }

    const isPasswordValid = await this.password.verify(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError("Invalid credentials", 401);
    }

    return await this.createToken(user);
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    const payload = verify(token, jwtConfig.auth.refreshTokenSecret, {
      algorithms: [jwtConfig.auth.algorithm],
    }) as AuthJwtPayload | null;

    if (!payload?.sub || payload.type != "refresh")
      throw new ApiError("Invalid token", 422);

    const userId = payload.sub;
    const user = await db.user.findFirst({ where: { id: userId } });

    if (!user) throw new ApiError("Unauthorized", 401);

    return await this.createToken(user);
  }

  private async createToken(user: User): Promise<AuthResponse> {
    const now = Math.floor(Date.now() / 1000);
    const accessTokenPayload: AuthJwtPayload = {
      sub: user.id,
      type: "access",
      exp: now + 60 * 15,
    };
    const refreshTokenPayload: AuthJwtPayload = {
      sub: user.id,
      type: "refresh",
      exp: now + 60 * 60 * 24 * 7,
    };

    const accessToken = sign(
      accessTokenPayload,
      jwtConfig.auth.accessTokenSecret,
      { algorithm: jwtConfig.auth.algorithm },
    );

    const refreshToken = sign(
      refreshTokenPayload,
      jwtConfig.auth.refreshTokenSecret,
      { algorithm: jwtConfig.auth.algorithm },
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
