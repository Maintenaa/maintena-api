import { createEmployeeRequestSchema } from "./schema/create-employee-schema";
import { updateEmployeeRequestSchema } from "./schema/update-employee-schema";
import { employeeResponseSchema } from "./schema/employee-schema";
import { createApiResponseSchema, ok } from "@/shared/schema/api-schema";
import { employeeRepository } from "./employee-module";
import { companyGuard } from "./guard/company-guard";
import Elysia, { t } from "elysia";

export function employeeRoute() {
  return new Elysia({ detail: { tags: ["Employees"] } }).use(
    companyGuard()
      .model("CreateEmployeeRequest", createEmployeeRequestSchema)
      .model("UpdateEmployeeRequest", updateEmployeeRequestSchema)
      .model(
        "EmployeeResponse",
        createApiResponseSchema(employeeResponseSchema),
      )
      .model(
        "EmployeeListResponse",
        createApiResponseSchema(t.Array(employeeResponseSchema)),
      )

      .get(
        "/companies/:companyId/employees",
        async ({ company }) => {
          const employees = await employeeRepository.findAll(company.id);
          return ok(employees, { message: "Employees fetched" });
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
        "/companies/:companyId/employees/:id",
        async ({ company, params }) => {
          const employee = await employeeRepository.findById(
            company.id,
            (params as Record<string, string>).id,
          );

          if (!employee) {
            throw new Error("Employee not found");
          }

          return ok(employee, { message: "Employee fetched" });
        },
        {
          detail: {
            summary: "Get employee detail",
          },
          response: {
            200: "EmployeeResponse",
          },
        },
      )

      .post(
        "/companies/:companyId/employees",
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
        "/companies/:companyId/employees/:id",
        async ({ company, params, body }) => {
          const employee = await employeeRepository.update(
            company.id,
            (params as Record<string, string>).id,
            body,
          );
          return ok(employee, { message: "Employee updated" });
        },
        {
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
        "/companies/:companyId/employees/:id",
        async ({ company, params }) => {
          await employeeRepository.delete(
            company.id,
            (params as Record<string, string>).id,
          );
          return ok(null, { message: "Employee deleted" });
        },
        {
          detail: {
            summary: "Delete employee",
          },
        },
      ),
  );
}
