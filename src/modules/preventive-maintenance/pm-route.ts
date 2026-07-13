import {
  pmResponseSchema,
  pmListResponseSchema,
  pmTimelineSchema,
} from "./schema/preventive-maintenance-schema";
import { createPmSchema } from "./schema/create-pm-schema";
import { updatePmSchema } from "./schema/update-pm-schema";
import { assignPmSchema } from "./schema/assign-pm-schema";
import { createPmTimelineSchema } from "./schema/create-pm-timeline-schema";
import { updatePmTimelineSchema } from "./schema/update-pm-timeline-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { pmRepository } from "./pm-module";
import { companyGuard } from "../company/guard/company-guard";
import { assertPmPermission } from "./guard/pm-permission";
import Elysia, { t } from "elysia";

export function pmRoute() {
  return new Elysia({ detail: { tags: ["Preventive Maintenance"] } })
    // ─── PM Endpoints ─────────────────────────────────────────
    .use(
      companyGuard()
        .model(
          "PmResponse",
          createApiResponseSchema(pmResponseSchema),
        )
        .model(
          "PmListResponse",
          createApiResponseSchema(t.Array(pmListResponseSchema)),
        )

        .get(
          "/preventive-maintenance",
          async ({ company }) => {
            const pms = await pmRepository.findAll(company.id);
            return ok(pms, { message: "Preventive maintenance fetched" });
          },
          {
            detail: { summary: "List all preventive maintenance" },
            response: { 200: "PmListResponse" },
          },
        )

        .get(
          "/preventive-maintenance/my-task",
          async ({ company, user }) => {
            const pms = await pmRepository.findMyTasks(company.id, user.id);
            return ok(pms, { message: "My tasks fetched" });
          },
          {
            detail: { summary: "List my assigned preventive maintenance" },
            response: { 200: "PmListResponse" },
          },
        )

        .get(
          "/preventive-maintenance/:pmId",
          async ({ company, params }) => {
            const pm = await pmRepository.findById(company.id, params.pmId);
            if (!pm) {
              throw new Error("Preventive maintenance not found");
            }
            return ok(pm, { message: "Preventive maintenance fetched" });
          },
          {
            detail: { summary: "Get preventive maintenance detail" },
            response: { 200: "PmResponse" },
          },
        ),
    )

    // ─── Admin-only Endpoints ─────────────────────────────────
    .use(
      companyGuard(["owner", "admin"])
        .model("CreatePm", createPmSchema)
        .model("UpdatePm", updatePmSchema)
        .model("AssignPm", assignPmSchema)
        .model(
          "PmResponse",
          createApiResponseSchema(pmResponseSchema),
        )

        .post(
          "/preventive-maintenance",
          async ({ company, body }) => {
            const pm = await pmRepository.create(company.id, body);
            return ok(pm, { message: "Preventive maintenance created" });
          },
          {
            detail: { summary: "Create preventive maintenance" },
            body: "CreatePm",
            response: { 200: "PmResponse" },
          },
        )

        .put(
          "/preventive-maintenance/:pmId",
          async ({ company, params, body }) => {
            const pm = await pmRepository.update(company.id, params.pmId, body);
            return ok(pm, { message: "Preventive maintenance updated" });
          },
          {
            detail: { summary: "Update preventive maintenance" },
            body: "UpdatePm",
            response: { 200: "PmResponse" },
          },
        )

        .delete(
          "/preventive-maintenance/:pmId",
          async ({ company, params }) => {
            await pmRepository.delete(company.id, params.pmId);
            return ok(null, { message: "Preventive maintenance deleted" });
          },
          {
            detail: { summary: "Delete preventive maintenance" },
          },
        )

        .post(
          "/preventive-maintenance/assign",
          async ({ company, body }) => {
            const pm = await pmRepository.assign(company.id, body);
            return ok(pm, { message: "Preventive maintenance assigned" });
          },
          {
            detail: { summary: "Assign preventive maintenance" },
            body: "AssignPm",
            response: { 200: "PmResponse" },
          },
        ),
    )

    // ─── Timeline Endpoints (assigner only) ───────────────────
    .use(
      companyGuard()
        .model("PmTimeline", pmTimelineSchema)
        .model(
          "PmTimelineListResponse",
          createApiResponseSchema(t.Array(pmTimelineSchema)),
        )
        .model("CreatePmTimeline", createPmTimelineSchema)
        .model("UpdatePmTimeline", updatePmTimelineSchema)

        .get(
          "/preventive-maintenance/:pmId/timeline",
          async ({ company, params }) => {
            const timelines = await pmRepository.findTimelines(
              company.id,
              params.pmId,
            );
            return ok(timelines, { message: "Timelines fetched" });
          },
          {
            detail: { summary: "List preventive maintenance timelines" },
            response: { 200: "PmTimelineListResponse" },
          },
        )

        .post(
          "/preventive-maintenance/:pmId/timeline",
          async ({ company, user, params, body }) => {
            await assertPmPermission(params.pmId, user.id, company.id, [
              "assigner",
            ]);
            const timeline = await pmRepository.createTimeline(
              company.id,
              params.pmId,
              user.id,
              body,
            );
            return ok(timeline, { message: "Timeline created" });
          },
          {
            detail: { summary: "Create timeline (assigner only)" },
            body: "CreatePmTimeline",
            response: { 200: "PmTimeline" },
          },
        )

        .put(
          "/preventive-maintenance/:pmId/timeline/:timelineId",
          async ({ company, user, params, body }) => {
            await assertPmPermission(params.pmId, user.id, company.id, [
              "assigner",
            ]);
            const timeline = await pmRepository.updateTimeline(
              company.id,
              params.pmId,
              Number(params.timelineId),
              body,
            );
            return ok(timeline, { message: "Timeline updated" });
          },
          {
            detail: { summary: "Update timeline (assigner only)" },
            body: "UpdatePmTimeline",
            response: { 200: "PmTimeline" },
          },
        )

        .delete(
          "/preventive-maintenance/:pmId/timeline/:timelineId",
          async ({ company, user, params }) => {
            await assertPmPermission(params.pmId, user.id, company.id, [
              "assigner",
            ]);
            await pmRepository.deleteTimeline(
              company.id,
              params.pmId,
              Number(params.timelineId),
            );
            return ok(null, { message: "Timeline deleted" });
          },
          {
            detail: { summary: "Delete timeline (assigner only)" },
          },
        ),
    );
}
