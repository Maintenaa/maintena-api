import Container from "typedi";
import { CompanyRepository } from "./repository/company-repository";

export const companyRepository = Container.get(CompanyRepository);
