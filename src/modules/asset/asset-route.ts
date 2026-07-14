import { createAssetRequestSchema } from "./schema/create-asset-schema";
import { updateAssetRequestSchema } from "./schema/update-asset-schema";
import { ok } from "@/shared/schema/api-schema";
import { assetRepository } from "./asset-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia from "elysia";

export function assetRoute() {
  return new Elysia({ detail: { tags: ["Assets"] } })
    .use(
      companyGuard()

        .get(
          "/assets",
          async ({ company }) => {
            const assets = await assetRepository.findAll(company.id);
            return ok(assets as any, { message: "Assets fetched" });
          },
          {
            detail: {
              summary: "List assets",
            },
          },
        )

        .get(
          "/assets/:assetId",
          async ({ company, params }) => {
            const asset = await assetRepository.findById(
              company.id,
              params.assetId,
            );

            if (!asset) {
              throw new Error("Asset not found");
            }

            return ok(asset as any, { message: "Asset fetched" });
          },
          {
            detail: {
              summary: "Get asset detail",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreateAssetRequest", createAssetRequestSchema)
        .model("UpdateAssetRequest", updateAssetRequestSchema)

        .post(
          "/assets",
          async ({ company, body }) => {
            const asset = await assetRepository.create(company.id, body);
            return ok(asset as any, { message: "Asset created" });
          },
          {
            detail: {
              summary: "Create asset",
            },
            body: "CreateAssetRequest",
          },
        )

        .put(
          "/assets/:assetId",
          async ({ company, params, body }) => {
            const asset = await assetRepository.update(
              company.id,
              params.assetId,
              body,
            );
            return ok(asset as any, { message: "Asset updated" });
          },
          {
            detail: {
              summary: "Update asset",
            },
            body: "UpdateAssetRequest",
          },
        )

        .delete(
          "/assets/:assetId",
          async ({ company, params }) => {
            await assetRepository.delete(company.id, params.assetId);
            return ok(null, { message: "Asset deleted" });
          },
          {
            detail: {
              summary: "Delete asset",
            },
          },
        ),
    );
}
