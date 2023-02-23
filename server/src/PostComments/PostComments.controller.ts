import { Request, Response, Router } from "express"
import IController from "Types/IController"
import PostCommentsService from "./PostComments.service"

export default class PostCommentsController implements IController {
	routers = () => {
		const router = Router()
		router.post("/", this.create)
		router.put("/", this.update)
		router.delete("/", this.delete)
		return router
	}

	constructor(private readonly service: PostCommentsService){}

	create = async (request: Request, response: Response) => {
		const { idPost, idProfileSource, text  } = request.body
		return response.status(200).send(await this.service.create(idPost, idProfileSource, text))
	}

	update = async (request: Request, response: Response) => {
		const { idComment, idProfileSource, text  } = request.body

		return response.status(200).send(await this.service.update(idComment, idProfileSource, text))
	}

	delete = async (request: Request, response: Response) => {
		const { idComment, idProfile } = request.body

		return response.status(200).send(await this.service.delete(idComment, idProfile))
	}

}