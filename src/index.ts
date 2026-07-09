import "core-js";
import "reflect-metadata";
import "dotenv/config";

import { appConfig, log } from "./core/config";
import { createRoutes } from "./route";
import Elysia from "elysia";
import { cors } from "@elysia/cors";
import { logMiddleware } from "./core/middleware/log-middleware";
import { errorMiddleware } from "./core/middleware/error-middleware";
import { openapi } from "@elysia/openapi";

async function main() {
  const app = new Elysia();

  app
    .use(openapi({ path: "/docs" }))
    .use(cors())
    .use(logMiddleware())
    .use(errorMiddleware());

  createRoutes(app);

  app.listen(appConfig.port, () => {
    log.info(`Server is running on port ${appConfig.port}`);
  });
}

main();
