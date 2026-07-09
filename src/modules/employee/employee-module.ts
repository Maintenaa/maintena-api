import Container from "typedi";
import { EmployeeRepository } from "./repository/employee-repository";

export const employeeRepository = Container.get(EmployeeRepository);
