import { createEmployeeRequestSchema } from "./schema/create-employee-schema";
import { updateEmployeeRequestSchema } from "./schema/update-employee-schema";
import { employeeResponseSchema } from "./schema/employee-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { employeeRepository } from "./employee-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia, { t } from "elysia";

export function employeeRoute() {
  const userIdParams = t.Object({
    userId: t.String({ format: "uuid", error: "Employee ID is required" }),
  });

  return new Elysia({ detail: { tags: ["Employees"] } })
    .use(
      companyGuard()
        .model(
          "EmployeeResponse",
          createApiResponseSchema(employeeResponseSchema),
        )
        .model(
          "EmployeeListResponse",
          createApiResponseSchema(t.Array(employeeResponseSchema)),
        )

        .get(
          "/employees",
          async ({ company }) => {
            const employees = await employeeRepository.findAll(company.id);
            return ok(employees as any, { message: "Employees fetched" });
          },
          {
            detail: {
              summary: "List employees",
            },
            response: {
              200: "EmployeeListResponse",
            },
          },
        )

        .get(
          "/employees/:userId",
          async ({ company, params }) => {
            const employee = await employeeRepository.findById(
              company.id,
              params.userId,
            );

            if (!employee) {
              throw new Error("Employee not found");
            }

            return ok(employee as any, { message: "Employee fetched" });
          },
          {
            params: userIdParams,
            detail: {
              summary: "Get employee detail",
            },
            response: {
              200: "EmployeeResponse",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreateEmployeeRequest", createEmployeeRequestSchema)
        .model("UpdateEmployeeRequest", updateEmployeeRequestSchema)
        .model(
          "EmployeeResponse",
          createApiResponseSchema(employeeResponseSchema),
        )

        .post(
          "/employees",
          async ({ company, body }) => {
            const employee = await employeeRepository.create(company.id, body);
            return ok(employee, { message: "Employee created" });
          },
          {
            detail: {
              summary: "Create employee",
            },
            body: "CreateEmployeeRequest",
            response: {
              200: "EmployeeResponse",
            },
          },
        )

        .put(
          "/employees/:userId",
          async ({ company, params, body }) => {
            const employee = await employeeRepository.update(
              company.id,
              params.userId,
              body,
            );
            return ok(employee, { message: "Employee updated" });
          },
          {
            params: userIdParams,
            detail: {
              summary: "Update employee",
            },
            body: "UpdateEmployeeRequest",
            response: {
              200: "EmployeeResponse",
            },
          },
        )

        .delete(
          "/employees/:userId",
          async ({ company, params }) => {
            await employeeRepository.delete(company.id, params.userId);
            return ok(null, { message: "Employee deleted" });
          },
          {
            params: userIdParams,
            detail: {
              summary: "Delete employee",
            },
          },
        ),
    );
}
