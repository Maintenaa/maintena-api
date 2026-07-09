import { createLocationRequestSchema } from "./schema/create-location-schema";
import { updateLocationRequestSchema } from "./schema/update-location-schema";
import { locationResponseSchema } from "./schema/location-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { locationRepository } from "./location-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia, { t } from "elysia";

export function locationRoute() {
  const locationIdParams = t.Object({
    locationId: t.String({ format: "uuid", error: "Location ID is required" }),
  });

  return new Elysia({ detail: { tags: ["Locations"] } })
    .use(
      companyGuard()
        .model(
          "LocationResponse",
          createApiResponseSchema(locationResponseSchema),
        )
        .model(
          "LocationListResponse",
          createApiResponseSchema(t.Array(locationResponseSchema)),
        )

        .get(
          "/companies/:companyId/locations",
          async ({ company }) => {
            const locations = await locationRepository.findAll(company.id);
            return ok(locations, { message: "Locations fetched" });
          },
          {
            detail: {
              summary: "List locations",
            },
            response: {
              200: "LocationListResponse",
            },
          },
        )

        .get(
          "/companies/:companyId/locations/:locationId",
          async ({ company, params }) => {
            const location = await locationRepository.findById(
              company.id,
              params.locationId,
            );

            if (!location) {
              throw new Error("Location not found");
            }

            return ok(location, { message: "Location fetched" });
          },
          {
            params: locationIdParams,
            detail: {
              summary: "Get location detail",
            },
            response: {
              200: "LocationResponse",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreateLocationRequest", createLocationRequestSchema)
        .model("UpdateLocationRequest", updateLocationRequestSchema)
        .model(
          "LocationResponse",
          createApiResponseSchema(locationResponseSchema),
        )

        .post(
          "/companies/:companyId/locations",
          async ({ company, body }) => {
            const location = await locationRepository.create(company.id, body);
            return ok(location, { message: "Location created" });
          },
          {
            detail: {
              summary: "Create location",
            },
            body: "CreateLocationRequest",
            response: {
              200: "LocationResponse",
            },
          },
        )

        .put(
          "/companies/:companyId/locations/:locationId",
          async ({ company, params, body }) => {
            const location = await locationRepository.update(
              company.id,
              params.locationId,
              body,
            );
            return ok(location, { message: "Location updated" });
          },
          {
            params: locationIdParams,
            detail: {
              summary: "Update location",
            },
            body: "UpdateLocationRequest",
            response: {
              200: "LocationResponse",
            },
          },
        )

        .delete(
          "/companies/:companyId/locations/:locationId",
          async ({ company, params }) => {
            await locationRepository.delete(company.id, params.locationId);
            return ok(null, { message: "Location deleted" });
          },
          {
            params: locationIdParams,
            detail: {
              summary: "Delete location",
            },
          },
        ),
    );
}
