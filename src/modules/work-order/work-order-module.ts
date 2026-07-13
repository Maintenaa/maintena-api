import Container from "typedi";
import { WorkOrderRepository } from "./repository/work-order-repository";

export const workOrderRepository = Container.get(WorkOrderRepository);
