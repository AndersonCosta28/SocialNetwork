import { ICreateBodyRequest, IFindAllByUserBodyRequest, IReactToFriendRequestBodyRequest } from "common/Types/Friendship"
import { Request, Response, Router } from "express"
import StatusCode from "status-code-enum"
import { IUserService } from "User/User.service"
import { IFriendshipService } from "./Friendship.service"
import IController from "@Types/IController"

export interface IFriendshipController extends IController {
	create: (request: Request, response: Response) => Promise<Response | null>
	findAllByUser: (request: Request, response: Response) => Promise<Response | null>
	reactToFriendRequest: (request: Request, response: Response) => Promise<Response | null>
}

export default class FriendshipController implements IFriendshipController {
	constructor(private readonly service: IFriendshipService, private readonly userService: IUserService) { }

	routers = (): Router => {
		const router: Router = Router()
		router.get("/", this.findAllByUser)
		router.post("/", this.create)
		router.post("/ReactToFriendRequest", this.reactToFriendRequest)
		return router
	}

	create = async (request: Request, response: Response): Promise<Response | null> => {
		const { TargetName, SourceId } = request.body as ICreateBodyRequest
		const userTarget = await this.userService.findOneByName(TargetName)
		if (!userTarget) return response.status(StatusCode.ClientErrorNotFound).end()
		if (userTarget.id === Number(SourceId)) return response.status(StatusCode.ClientErrorBadRequest).json({ message: "You cannot add yourself" })
		if (await this.service.checkIfItAlreadyExists(SourceId, userTarget.id)) return response.status(StatusCode.ClientErrorConflict).json({ message: "Already exists" })
		this.service.createFriendshipRequest(Number(SourceId), userTarget.id)
		return response.status(StatusCode.SuccessNoContent).send()
	}

	findAllByUser = async (request: Request, response: Response): Promise<Response | null> => {
		const { UserId } = request.body as IFindAllByUserBodyRequest
		return response.status(StatusCode.SuccessOK).send(await this.service.findAllByUser(Number(UserId)))
	}

	reactToFriendRequest = async (request: Request, response: Response): Promise<Response | null> => {
		const { FriendshipId, React, UserId } = request.body as IReactToFriendRequestBodyRequest
		return response.status(StatusCode.SuccessOK).send(await this.service.reactToFriendRequest(React, Number(UserId), Number(FriendshipId)))
	}
}
