import AppDataSource from "Providers/Database/DataSource"
import { Repository } from "typeorm"
import UserController, { IUserController } from "./User.controller"
import User from "./User.entity"
import UserService, { IUserService } from "./User.service"
import { emailService } from "Email"

const repository: Repository<User> = AppDataSource.getRepository<User>(User)
const userService:IUserService  = new UserService(repository, emailService)
const userController: IUserController = new UserController(userService, emailService)
export { userService, userController }