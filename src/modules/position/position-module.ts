import Container from "typedi";
import { PositionRepository } from "./repository/position-repository";

export const positionRepository = Container.get(PositionRepository);
