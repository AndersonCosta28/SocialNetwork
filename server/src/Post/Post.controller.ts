import { Request, Response, Router } from "express"
import IController from "Types/IController"
import { IPostService } from "./Post.service"

export default class PostController implements IController {
	constructor(private readonly service: IPostService) { }
	routers = () => {
		const router: Router = Router()
		router.get("/findAllByIdProfile/:id", this.findAllByIdProfile)
		router.get("/findAllFromFriends/:id", this.findAllFromFriends)
		return router
	}

	findAllByIdProfile = async (request: Request, response: Response): Promise<Response> => {
		const { id } = response.locals
		return response.send(await this.service.findAllByIdProfile(id))
	}

	findAllFromFriends = async (request: Request, response: Response): Promise<Response> => {
		const { id } = response.locals
		return response.send(await this.service.findAllFromFriends(id))
	}
}