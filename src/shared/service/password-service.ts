import * as bcrypt from "bcrypt";
import { Service } from "typedi";

@Service()
export class PasswordService {
  private saltRounds = 12;

  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds);
  }

  async verify(password: string, hashPassword: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hashPassword);
    } catch (_) {
      return false;
    }
  }
}
