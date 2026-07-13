import { createPositionRequestSchema } from "./schema/create-position-schema";
import { updatePositionRequestSchema } from "./schema/update-position-schema";
import { positionResponseSchema } from "./schema/position-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { positionRepository } from "./position-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia, { t } from "elysia";

export function positionRoute() {
  return new Elysia({ detail: { tags: ["Positions"] } })
    .use(
      companyGuard()
        .model(
          "PositionResponse",
          createApiResponseSchema(positionResponseSchema),
        )
        .model(
          "PositionListResponse",
          createApiResponseSchema(t.Array(positionResponseSchema)),
        )

        .get(
          "/positions",
          async ({ company }) => {
            const positions = await positionRepository.findAll(company.id);
            return ok(positions, { message: "Positions fetched" });
          },
          {
            detail: {
              summary: "List positions",
            },
            response: {
              200: "PositionListResponse",
            },
          },
        )

        .get(
          "/positions/:positionId",
          async ({ company, params }) => {
            const position = await positionRepository.findById(
              company.id,
              Number(params.positionId),
            );

            if (!position) {
              throw new Error("Position not found");
            }

            return ok(position, { message: "Position fetched" });
          },
          {
            detail: {
              summary: "Get position detail",
            },
            response: {
              200: "PositionResponse",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreatePositionRequest", createPositionRequestSchema)
        .model("UpdatePositionRequest", updatePositionRequestSchema)
        .model(
          "PositionResponse",
          createApiResponseSchema(positionResponseSchema),
        )

        .post(
          "/positions",
          async ({ company, body }) => {
            const position = await positionRepository.create(company.id, body);
            return ok(position, { message: "Position created" });
          },
          {
            detail: {
              summary: "Create position",
            },
            body: "CreatePositionRequest",
            response: {
              200: "PositionResponse",
            },
          },
        )

        .put(
          "/positions/:positionId",
          async ({ company, params, body }) => {
            const position = await positionRepository.update(
              company.id,
              Number(params.positionId),
              body,
            );
            return ok(position, { message: "Position updated" });
          },
          {
            detail: {
              summary: "Update position",
            },
            body: "UpdatePositionRequest",
            response: {
              200: "PositionResponse",
            },
          },
        )

        .delete(
          "/positions/:positionId",
          async ({ company, params }) => {
            await positionRepository.delete(
              company.id,
              Number(params.positionId),
            );
            return ok(null, { message: "Position deleted" });
          },
          {
            detail: {
              summary: "Delete position",
            },
          },
        ),
    );
}
