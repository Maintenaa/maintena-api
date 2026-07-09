import Container from "typedi";
import { AuthRepository } from "./repository/auth-repository";

export const authRepository = Container.get(AuthRepository);
