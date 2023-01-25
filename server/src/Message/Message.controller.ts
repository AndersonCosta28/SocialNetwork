import IController from "@Types/IController"
import { Request, Response, Router } from "express"
import { StatusCode } from "status-code-enum"
import MessageService from "./Message.service"

export default class MessageController implements IController {
	constructor(private readonly service: MessageService) {}
	routers = (): Router => {
		const router: Router = Router()
		router.get("/findByFriendship/:friendshipId", this.findByFriendship)
		return router
	}

	findByFriendship = async (request: Request, response: Response) => {
		const { friendshipId } = request.params
		return response.status(StatusCode.SuccessOK).send(await this.service.findByFriendship(Number(friendshipId)))
	}    
}