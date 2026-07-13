import {
  workOrderResponseSchema,
  workOrderListResponseSchema,
  workOrderTimelineSchema,
  workOrderCostSchema,
} from "./schema/work-order-schema";
import { requestWorkOrderSchema } from "./schema/request-work-order-schema";
import { assignWorkOrderSchema } from "./schema/assign-work-order-schema";
import { updateWorkOrderSchema } from "./schema/update-work-order-schema";
import { updateWorkOrderStatusSchema } from "./schema/update-work-order-status-schema";
import { createWorkOrderTimelineSchema } from "./schema/create-work-order-timeline-schema";
import { updateWorkOrderTimelineSchema } from "./schema/update-work-order-timeline-schema";
import { createWorkOrderCostSchema } from "./schema/create-work-order-cost-schema";
import { updateWorkOrderCostSchema } from "./schema/update-work-order-cost-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { workOrderRepository } from "./work-order-module";
import { companyGuard } from "../company/guard/company-guard";
import { assertWorkOrderPermission } from "./guard/work-order-permission";
import Elysia, { t } from "elysia";

export function workOrderRoute() {
  return new Elysia({ detail: { tags: ["Work Orders"] } })
    // ─── Work Order Endpoints ──────────────────────────────────
    .use(
      companyGuard()
        .model(
          "WorkOrderResponse",
          createApiResponseSchema(workOrderResponseSchema),
        )
        .model(
          "WorkOrderListResponse",
          createApiResponseSchema(t.Array(workOrderListResponseSchema)),
        )

        .get(
          "/work-order",
          async ({ company }) => {
            const workOrders = await workOrderRepository.findAll(company.id);
            return ok(workOrders, { message: "Work orders fetched" });
          },
          {
            detail: { summary: "List all work orders" },
            response: { 200: "WorkOrderListResponse" },
          },
        )

        .get(
          "/work-order/my-request",
          async ({ company, user }) => {
            const workOrders = await workOrderRepository.findMyRequests(
              company.id,
              user.id,
            );
            return ok(workOrders, { message: "My requests fetched" });
          },
          {
            detail: { summary: "List my requested work orders" },
            response: { 200: "WorkOrderListResponse" },
          },
        )

        .get(
          "/work-order/my-task",
          async ({ company, user }) => {
            const workOrders = await workOrderRepository.findMyTasks(
              company.id,
              user.id,
            );
            return ok(workOrders, { message: "My tasks fetched" });
          },
          {
            detail: { summary: "List my assigned work orders" },
            response: { 200: "WorkOrderListResponse" },
          },
        )

        .get(
          "/work-order/:workOrderId",
          async ({ company, params }) => {
            const workOrder = await workOrderRepository.findById(
              company.id,
              params.workOrderId,
            );
            if (!workOrder) {
              throw new Error("Work order not found");
            }
            return ok(workOrder, { message: "Work order fetched" });
          },
          {
            detail: { summary: "Get work order detail" },
            response: { 200: "WorkOrderResponse" },
          },
        )

        .post(
          "/work-order/request",
          async ({ company, user, body }) => {
            const workOrder = await workOrderRepository.request(
              company.id,
              user.id,
              body,
            );
            return ok(workOrder, { message: "Work order requested" });
          },
          {
            detail: { summary: "Request a work order" },
            body: "RequestWorkOrder",
            response: { 200: "WorkOrderResponse" },
          },
        ),
    )

    // ─── Admin-only Endpoints ──────────────────────────────────
    .use(
      companyGuard(["owner", "admin"])
        .model("AssignWorkOrder", assignWorkOrderSchema)
        .model(
          "WorkOrderResponse",
          createApiResponseSchema(workOrderResponseSchema),
        )

        .post(
          "/work-order/assign",
          async ({ company, body }) => {
            const workOrder = await workOrderRepository.assign(
              company.id,
              body,
            );
            return ok(workOrder, { message: "Work order assigned" });
          },
          {
            detail: { summary: "Assign and schedule work order" },
            body: "AssignWorkOrder",
            response: { 200: "WorkOrderResponse" },
          },
        ),
    )

    // ─── Mixed Permission Endpoints (requester/admin/assigner) ──
    .use(
      companyGuard()
        .model("RequestWorkOrder", requestWorkOrderSchema)
        .model("UpdateWorkOrder", updateWorkOrderSchema)
        .model("UpdateWorkOrderStatus", updateWorkOrderStatusSchema)
        .model(
          "WorkOrderResponse",
          createApiResponseSchema(workOrderResponseSchema),
        )

        .put(
          "/work-order/:workOrderId",
          async ({ company, user, params, body }) => {
            await assertWorkOrderPermission(
              params.workOrderId,
              user.id,
              company.id,
              ["requester", "admin"],
            );
            const workOrder = await workOrderRepository.update(
              company.id,
              params.workOrderId,
              body,
            );
            return ok(workOrder, { message: "Work order updated" });
          },
          {
            detail: { summary: "Update work order (requester or admin)" },
            body: "UpdateWorkOrder",
            response: { 200: "WorkOrderResponse" },
          },
        )

        .put(
          "/work-order/:workOrderId/status",
          async ({ company, user, params, body }) => {
            await assertWorkOrderPermission(
              params.workOrderId,
              user.id,
              company.id,
              ["requester", "admin", "assigner"],
            );
            const workOrder = await workOrderRepository.updateStatus(
              company.id,
              params.workOrderId,
              body,
            );
            return ok(workOrder, { message: "Work order status updated" });
          },
          {
            detail: {
              summary: "Update work order status (requester, admin, or assigner)",
            },
            body: "UpdateWorkOrderStatus",
            response: { 200: "WorkOrderResponse" },
          },
        )

        .delete(
          "/work-order/:workOrderId",
          async ({ company, user, params }) => {
            await assertWorkOrderPermission(
              params.workOrderId,
              user.id,
              company.id,
              ["requester", "admin"],
            );
            await workOrderRepository.delete(company.id, params.workOrderId);
            return ok(null, { message: "Work order deleted" });
          },
          {
            detail: { summary: "Delete work order (requester or admin)" },
          },
        ),
    )

    // ─── Timeline Endpoints (assigner only) ────────────────────
    .use(
      companyGuard()
        .model("WorkOrderTimeline", workOrderTimelineSchema)
        .model(
          "WorkOrderTimelineListResponse",
          createApiResponseSchema(t.Array(workOrderTimelineSchema)),
        )
        .model("CreateWorkOrderTimeline", createWorkOrderTimelineSchema)
        .model("UpdateWorkOrderTimeline", updateWorkOrderTimelineSchema)

        .get(
          "/work-order/:workOrderId/timeline",
          async ({ company, params }) => {
            const timelines = await workOrderRepository.findTimelines(
              company.id,
              params.workOrderId,
            );
            return ok(timelines, { message: "Timelines fetched" });
          },
          {
            detail: { summary: "List work order timelines" },
            response: { 200: "WorkOrderTimelineListResponse" },
          },
        )

        .post(
          "/work-order/:workOrderId/timeline",
          async ({ company, user, params, body }) => {
            await assertWorkOrderPermission(
              params.workOrderId,
              user.id,
              company.id,
              ["assigner"],
            );
            const timeline = await workOrderRepository.createTimeline(
              company.id,
              params.workOrderId,
              user.id,
              body,
            );
            return ok(timeline, { message: "Timeline created" });
          },
          {
            detail: { summary: "Create timeline (assigner only)" },
            body: "CreateWorkOrderTimeline",
            response: { 200: "WorkOrderTimeline" },
          },
        )

        .put(
          "/work-order/:workOrderId/timeline/:timelineId",
          async ({ company, user, params, body }) => {
            await assertWorkOrderPermission(
              params.workOrderId,
              user.id,
              company.id,
              ["assigner"],
            );
            const timeline = await workOrderRepository.updateTimeline(
              company.id,
              params.workOrderId,
              Number(params.timelineId),
              body,
            );
            return ok(timeline, { message: "Timeline updated" });
          },
          {
            detail: { summary: "Update timeline (assigner only)" },
            body: "UpdateWorkOrderTimeline",
            response: { 200: "WorkOrderTimeline" },
          },
        )

        .delete(
          "/work-order/:workOrderId/timeline/:timelineId",
          async ({ company, user, params }) => {
            await assertWorkOrderPermission(
              params.workOrderId,
              user.id,
              company.id,
              ["assigner"],
            );
            await workOrderRepository.deleteTimeline(
              company.id,
              params.workOrderId,
              Number(params.timelineId),
            );
            return ok(null, { message: "Timeline deleted" });
          },
          {
            detail: { summary: "Delete timeline (assigner only)" },
          },
        ),
    )

    // ─── Cost Endpoints (assigner only) ────────────────────────
    .use(
      companyGuard()
        .model("WorkOrderCost", workOrderCostSchema)
        .model(
          "WorkOrderCostListResponse",
          createApiResponseSchema(t.Array(workOrderCostSchema)),
        )
        .model("CreateWorkOrderCost", createWorkOrderCostSchema)
        .model("UpdateWorkOrderCost", updateWorkOrderCostSchema)

        .get(
          "/work-order/:workOrderId/cost",
          async ({ company, params }) => {
            const costs = await workOrderRepository.findCosts(
              company.id,
              params.workOrderId,
            );
            return ok(costs, { message: "Costs fetched" });
          },
          {
            detail: { summary: "List work order costs" },
            response: { 200: "WorkOrderCostListResponse" },
          },
        )

        .post(
          "/work-order/:workOrderId/cost",
          async ({ company, user, params, body }) => {
            await assertWorkOrderPermission(
              params.workOrderId,
              user.id,
              company.id,
              ["assigner"],
            );
            const cost = await workOrderRepository.createCost(
              company.id,
              params.workOrderId,
              user.id,
              body,
            );
            return ok(cost, { message: "Cost added" });
          },
          {
            detail: { summary: "Add cost (assigner only)" },
            body: "CreateWorkOrderCost",
            response: { 200: "WorkOrderCost" },
          },
        )

        .put(
          "/work-order/:workOrderId/cost/:costId",
          async ({ company, user, params, body }) => {
            await assertWorkOrderPermission(
              params.workOrderId,
              user.id,
              company.id,
              ["assigner"],
            );
            const cost = await workOrderRepository.updateCost(
              company.id,
              params.workOrderId,
              Number(params.costId),
              body,
            );
            return ok(cost, { message: "Cost updated" });
          },
          {
            detail: { summary: "Update cost (assigner only)" },
            body: "UpdateWorkOrderCost",
            response: { 200: "WorkOrderCost" },
          },
        )

        .delete(
          "/work-order/:workOrderId/cost/:costId",
          async ({ company, user, params }) => {
            await assertWorkOrderPermission(
              params.workOrderId,
              user.id,
              company.id,
              ["assigner"],
            );
            await workOrderRepository.deleteCost(
              company.id,
              params.workOrderId,
              Number(params.costId),
            );
            return ok(null, { message: "Cost deleted" });
          },
          {
            detail: { summary: "Delete cost (assigner only)" },
          },
        ),
    );
}
