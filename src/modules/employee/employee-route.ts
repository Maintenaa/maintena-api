import { createEmployeeRequestSchema } from "./schema/create-employee-schema";
import { updateEmployeeRequestSchema } from "./schema/update-employee-schema";
import { ok } from "@/shared/schema/api-schema";
import { employeeRepository } from "./employee-module";
import { companyGuard } from "../company/guard/company-guard";
import Elysia from "elysia";

export function employeeRoute() {
  return new Elysia({ detail: { tags: ["Employees"] } })
    .use(
      companyGuard()

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
            detail: {
              summary: "Get employee detail",
            },
          },
        ),
    )
    .use(
      companyGuard(["owner", "admin"])
        .model("CreateEmployeeRequest", createEmployeeRequestSchema)
        .model("UpdateEmployeeRequest", updateEmployeeRequestSchema)

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
            detail: {
              summary: "Update employee",
            },
            body: "UpdateEmployeeRequest",
          },
        )

        .delete(
          "/employees/:userId",
          async ({ company, params }) => {
            await employeeRepository.delete(company.id, params.userId);
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
