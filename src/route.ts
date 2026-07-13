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
import { failureCodeRoute } from "./modules/failure-code/failure-code-route";
import { workOrderTypeRoute } from "./modules/work-order-type/work-order-type-route";

export function createRoutes(app: Elysia) {
  app
    .use(authRoute())
    .use(companyRoute())
    .use(
      new Elysia({ prefix: "/companies/:companyId" })
        .use(employeeRoute())
        .use(positionRoute())
        .use(assetCategoryRoute())
        .use(assetRoute())
        .use(locationRoute())
        .use(partCategoryRoute())
        .use(partSupplierRoute())
        .use(partRoute())
        .use(failureCodeRoute())
        .use(workOrderTypeRoute()),
    );
}
