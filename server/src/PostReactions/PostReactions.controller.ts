import { Request, Response, Router } from "express"
import IController from "Types/IController"
import PostReactionsService from "./PostReactions.service"

export default class PostReactionsController implements IController{
	routers = () => {
		const router = Router()
		router.post("/", this.ReactAnPost)
		return router
	}

	constructor(private readonly service: PostReactionsService) {}
    
	ReactAnPost = async (request: Request, response: Response) => {
		const { idPost, idProfile, typeReact } = request.body
		if (typeReact === null || typeReact === undefined)
			return response.status(200).send(await this.service.UnReactAnPost(idPost, idProfile))
		else 
			return response.status(200).send(await this.service.ReactAnPost(idPost, typeReact, idProfile))
	}
}