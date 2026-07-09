import Container from "typedi";
import { AssetCategoryRepository } from "./repository/asset-category-repository";

export const assetCategoryRepository = Container.get(AssetCategoryRepository);
