import Container from "typedi";
import { AssetRepository } from "./repository/asset-repository";

export const assetRepository = Container.get(AssetRepository);
