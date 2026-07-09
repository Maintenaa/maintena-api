import Container from "typedi";
import { PartSupplierRepository } from "./repository/part-supplier-repository";

export const partSupplierRepository = Container.get(PartSupplierRepository);
