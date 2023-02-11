import AppDataSource from "Providers/Database/DataSource"
import FriendshipController, { IFriendshipController } from "./Friendship.controller"
import FriendshipService, { IFriendshipService } from "./Friendship.service"
import Friendship from "./Friendship.entity"

const repository = AppDataSource.getRepository<Friendship>(Friendship)
const friendshipService: IFriendshipService = new FriendshipService(repository)
const friendshipController: IFriendshipController = new FriendshipController(friendshipService)

export { friendshipService, friendshipController }
