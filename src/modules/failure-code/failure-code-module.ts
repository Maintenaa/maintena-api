import Container from "typedi";
import { FailureCodeRepository } from "./repository/failure-code-repository";

export const failureCodeRepository = Container.get(FailureCodeRepository);
