import { createLocationRequestSchema } from "./schema/create-location-schema";
import { updateLocationRequestSchema } from "./schema/update-location-schema";
import { ok } from "@/shared/schema/api-schema";
import { locationRepository } from "./location-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia from "elysia";

export function locationRoute() {
  return new Elysia({
    detail: { tags: ["Locations"] },
  })
    .use(
      companyGuard()

        .get(
          "locations",
          async ({ company }) => {
            const locations = await locationRepository.findAll(company.id);
            return ok(locations, { message: "Locations fetched" });
          },
          {
            detail: {
              summary: "List locations",
            },
          },
        )

        .get(
          "/locations/:locationId",
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
            detail: {
              summary: "Get location detail",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreateLocationRequest", createLocationRequestSchema)
        .model("UpdateLocationRequest", updateLocationRequestSchema)

        .post(
          "/locations",
          async ({ company, body }) => {
            const location = await locationRepository.create(company.id, body);
            return ok(location, { message: "Location created" });
          },
          {
            detail: {
              summary: "Create location",
            },
            body: "CreateLocationRequest",
          },
        )

        .put(
          "/locations/:locationId",
          async ({ company, params, body }) => {
            const location = await locationRepository.update(
              company.id,
              params.locationId,
              body,
            );
            return ok(location, { message: "Location updated" });
          },
          {
            detail: {
              summary: "Update location",
            },
            body: "UpdateLocationRequest",
          },
        )

        .delete(
          "/locations/:locationId",
          async ({ company, params }) => {
            await locationRepository.delete(company.id, params.locationId);
            return ok(null, { message: "Location deleted" });
          },
          {
            detail: {
              summary: "Delete location",
            },
          },
        ),
    );
}
