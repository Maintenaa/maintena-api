import Container from "typedi";
import { PmRepository } from "./repository/pm-repository";

export const pmRepository = Container.get(PmRepository);
