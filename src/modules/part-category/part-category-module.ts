import Container from "typedi";
import { PartCategoryRepository } from "./repository/part-category-repository";

export const partCategoryRepository = Container.get(PartCategoryRepository);
