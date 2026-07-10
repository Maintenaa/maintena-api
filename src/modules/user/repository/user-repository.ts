import { db } from "@/core/config";
import { User } from "@/generated/prisma/client";
import { Service } from "typedi";

@Service()
export class UserRepository {
  async findById(id: string): Promise<User | null> {
    const user = await db.user.findFirst({ where: { id } });
    return user;
  }
}
