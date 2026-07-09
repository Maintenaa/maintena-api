import { ApiError } from "@/shared/error";
import Elysia, { ValidationError } from "elysia";

export function errorMiddleware() {
  return new Elysia().onError({ as: "global" }, ({ error, set }) => {
    if (error instanceof ApiError) {
      set.status = error.statusCode;
      return {
        error: error.message,
      };
    }

    if (error instanceof ValidationError) {
      type ErrorMap = {
        path: string;
        messages: string[];
      };

      let errors: ErrorMap[] = [];

      for (const err of error.all) {
        const path = err.path;
        const message =
          typeof err.schema.error == "string" ? err.schema.error : err.message;

        if (errors.some((e) => e.path == path)) {
          errors = errors.map((e) => {
            if (e.path == path && e.messages.some((m) => m != message)) {
              e.messages.push(message);
            }

            return e;
          });
        } else {
          errors.push({
            path: path,
            messages: [message],
          });
        }
      }

      return {
        errors,
      };
    }

    console.error(error);
    set.status = 500;
    return "Intenal server error";
  });
}
