import Container from "typedi";
import { PartRepository } from "./repository/part-repository";

export const partRepository = Container.get(PartRepository);
