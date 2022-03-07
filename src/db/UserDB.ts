import { getManager, Repository, UpdateResult } from "typeorm";
import { User } from "../entity/user.entity";
import bcryptjs from "bcryptjs";
import { Registrable } from "../interfaces/Authenticatable";
import { DBUpdatable } from "../interfaces/DBAuthenticatable";

export class UserDB {
  private repository: Repository<User>;
  constructor() {
    this.repository = getManager().getRepository(User);
  }

  /**
   *
   * @param registerData
   */
  public async registerUser(registerData: Registrable): Promise<Object> {
    const { password, ...user } = await this.repository.save({
      first_name: registerData.firstName,
      last_name: registerData.lastName,
      email: registerData.email,
      password: registerData.password,
    });
    return user;
  }

  /**
   *
   * @param email
   */
  public async getUserByEmail(email: string): Promise<User> {
    const user = await this.repository.findOne({ email: email });
    return user;
  }

  /**
   *
   * @param id
   */
  public async getUserById(id: number): Promise<User> {
    const user = await this.repository.findOne({ id: id });
    return user;
  }

  public async updateUserInfo(
    userId: number,
    userData: DBUpdatable
  ): Promise<User> {
    await this.repository.update(userId, userData);
    const updatedUser = await this.repository.findOne(userId);
    return updatedUser;
  }

  public async updatePassword(
    userId: number,
    password: string
  ): Promise<UpdateResult> {
    console.log(password);
    const result = await this.repository.update(userId, { password: password });
    return result;
  }
}
