import { ICreateBodyRequest, IFindAllByUserBodyRequest, IReactToFriendRequestBodyRequest, TypeOfFriendship } from "common/Types/Friendship"
import { Request, Response, Router } from "express"
import { StatusCode } from "status-code-enum"
import { IFriendshipService } from "./Friendship.service"
import IController from "Types/IController"
import { CustomErrorAPI } from "common"
import AppDataSource from "Providers/Database/DataSource"
import Profile from "Profile/Profile.entity"

export interface IFriendshipController extends IController {
	create: (request: Request, response: Response) => Promise<Response>
	findAllByUser: (request: Request, response: Response) => Promise<Response>
	reactToFriendRequest: (request: Request, response: Response) => Promise<Response>
}

export default class FriendshipController implements IFriendshipController {
	constructor(private readonly service: IFriendshipService) { }

	routers = (): Router => {
		const router: Router = Router()
		router.post("/", this.findAllByUser)
		router.post("/add", this.create)
		router.post("/ReactToFriendRequest", this.reactToFriendRequest)
		router.post("/RemoveFriend", this.removeFriend)
		return router
	}

	create = async (request: Request, response: Response): Promise<Response> => {
		const { id } = response.locals
		const { TargetName, SourceId } = request.body as ICreateBodyRequest
		if (id !== Number(SourceId)) throw new CustomErrorAPI("Ids User doens't match")
		const userTarget = await AppDataSource.getRepository(Profile)
			.createQueryBuilder("profile")
			.innerJoinAndSelect("profile.Avatar", "a")
			.where("LOWER(Nickname) = :nickname", { nickname: TargetName.toLowerCase() })
			.getOne()
		if (!userTarget) throw new Error("Profile not found")
		if (!userTarget) return response.status(StatusCode.ClientErrorNotFound).end()
		if (userTarget.id === Number(SourceId)) return response.status(StatusCode.ClientErrorBadRequest).json({ message: "You cannot add yourself" })

		const friendship = await this.service.findOneByUsersId(SourceId, userTarget.id)
		if (friendship)
			if (friendship.Type === TypeOfFriendship.Removed) return response.status(StatusCode.SuccessNoContent).send(await this.service.updateTypeFriendship(friendship, TypeOfFriendship.Requested))
			else return response.status(StatusCode.ClientErrorConflict).json({ message: "Already exists" })
		else
			return response.status(StatusCode.SuccessNoContent).send(await this.service.createFriendshipRequest(Number(SourceId), userTarget.id))
	}

	findAllByUser = async (request: Request, response: Response): Promise<Response> => {
		const { UserId } = request.body as IFindAllByUserBodyRequest
		return response.status(StatusCode.SuccessOK).send(await this.service.findAllByUser(Number(UserId)))
	}

	reactToFriendRequest = async (request: Request, response: Response): Promise<Response> => {
		const { id } = response.locals
		const { FriendshipId, React, UserId } = request.body as IReactToFriendRequestBodyRequest
		if (id !== Number(UserId)) throw new CustomErrorAPI("Ids User doens't match")
		return response.status(StatusCode.SuccessOK).send(await this.service.reactToFriendRequest(React, Number(UserId), Number(FriendshipId)))
	}

	removeFriend = async (request: Request, response: Response): Promise<Response> => {
		const { idFriendship } = request.body
		return response.status(StatusCode.SuccessOK).send(await this.service.remove(idFriendship))
	}
}
