import Elysia from "elysia";
import { authRoute } from "./modules/auth/auth-route";

export function createRoutes(app: Elysia) {
  app.use(authRoute());
}
