import Container from "typedi";
import { LocationRepository } from "./repository/location-repository";

export const locationRepository = Container.get(LocationRepository);
