import { log } from "../config";
import Elysia from "elysia";

export function logMiddleware() {
  return new Elysia()
    .derive({ as: "global" }, () => ({ startTime: Date.now() }))
    .onAfterResponse(
      { as: "global" },
      ({ startTime, path, request, set: { status } }) => {
        const duration = Date.now() - startTime;
        const method = request.method;
        const statusCode = Number(status) || 200;

        const logMessage = `${method} ${path} ${statusCode} - ${duration}ms`;

        if (statusCode >= 400) {
          log.error(logMessage);
        } else {
          log.info(logMessage);
        }
      },
    );
}
