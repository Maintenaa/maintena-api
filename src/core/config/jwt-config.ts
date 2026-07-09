import { Algorithm } from "jsonwebtoken";

export const jwtConfig = {
  auth: {
    algorithm: "HS256" as Algorithm,
    accessTokenSecret: process.env.AUTH_ACCESS_TOKEN_SECRET || "",
    refreshTokenSecret: process.env.AUTH_REFRESH_TOKEN_SECRET || "",
  },
};
