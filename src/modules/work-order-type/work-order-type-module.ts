import Container from "typedi";
import { WorkOrderTypeRepository } from "./repository/work-order-type-repository";

export const workOrderTypeRepository = Container.get(WorkOrderTypeRepository);
