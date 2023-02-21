import AppDataSource from "Providers/Database/DataSource"
import PostCommentsController from "./PostComments.controller"
import PostComments from "./PostComments.entity"
import PostCommentsService from "./PostComments.service"

const repository = AppDataSource.getRepository(PostComments)
const postCommentsService = new PostCommentsService(repository)
const postCommentsController = new PostCommentsController(postCommentsService)

export { postCommentsController, postCommentsService }