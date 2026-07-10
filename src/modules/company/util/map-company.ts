import { Company, Position } from "@/generated/prisma/browser";

export function mapCompanyWithPosition(company: Company, position?: Position) {
  return {
    ...company,
    position,
  };
}
