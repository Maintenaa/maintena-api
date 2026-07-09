import Elysia from "elysia";
import { authRoute } from "./modules/auth/auth-route";
import { employeeRoute } from "./modules/employee/employee-route";
import { companyRoute } from "./modules/company/company-route";
import { positionRoute } from "./modules/position/position-route";
import { assetCategoryRoute } from "./modules/asset-category/asset-category-route";
import { assetRoute } from "./modules/asset/asset-route";
import { locationRoute } from "./modules/location/location-route";
import { partCategoryRoute } from "./modules/part-category/part-category-route";
import { partSupplierRoute } from "./modules/part-supplier/part-supplier-route";
import { partRoute } from "./modules/part/part-route";

export function createRoutes(app: Elysia) {
  app.use(authRoute());
  app.use(companyRoute());
  app.use(employeeRoute());
  app.use(positionRoute());
  app.use(assetCategoryRoute());
  app.use(assetRoute());
  app.use(locationRoute());
  app.use(partCategoryRoute());
  app.use(partSupplierRoute());
  app.use(partRoute());
}
