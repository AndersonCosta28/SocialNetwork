import AppDataSource from "Providers/Database/DataSource"
import PostController from "./Post.controller"
import Post from "./Post.entity"
import PostService, { IPostService } from "./Post.service"

const repository = AppDataSource.getRepository(Post)
const postService: IPostService = new PostService(repository)
const postController = new PostController(postService)


export { postService, postController }