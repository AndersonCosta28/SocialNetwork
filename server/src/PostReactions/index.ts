import AppDataSource from "Providers/Database/DataSource"
import PostReactionsController from "./PostReactions.controller"
import PostReactions from "./PostReactions.entity"
import PostReactionsService from "./PostReactions.service"

const repository = AppDataSource.getRepository(PostReactions)
const postReactionsService = new PostReactionsService(repository)
const postReactionsController = new PostReactionsController(postReactionsService)

export {postReactionsController, postReactionsService}