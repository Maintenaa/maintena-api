import Elysia from "elysia";
import { authRoute } from "./modules/auth/auth-route";
import { employeeRoute } from "./modules/employee/employee-route";

export function createRoutes(app: Elysia) {
  app.use(authRoute());
  app.use(employeeRoute());
}
