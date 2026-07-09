import Elysia from "elysia";
import { authRoute } from "./modules/auth/auth-route";
import { employeeRoute } from "./modules/employee/employee-route";
import { companyRoute } from "./modules/company/company-route";
import { positionRoute } from "./modules/position/position-route";

export function createRoutes(app: Elysia) {
  app.use(authRoute());
  app.use(companyRoute());
  app.use(employeeRoute());
  app.use(positionRoute());
}
