import { Request, Response, Router } from "express"
import IController from "Types/IController"
import { IProfileService } from "./Profile.service"
import Profile from "./Profile.entity"
import { StatusCode } from "status-code-enum"

export default class ProfileController implements IController {

	constructor(private readonly service: IProfileService) { }

	routers = () => {
		const router: Router = Router()
		router.get("/", this.findAll)
		router.get("/findOneById/:id", this.findOneById)
		router.get("/findOneByNickname/:Nickname", this.findOneByNickname)
		router.put("/:id", this.edit)
		return router
	}	

	findAll = async (request: Request, response: Response): Promise<Response> => response.status(StatusCode.SuccessOK).send(await this.service.findAll())

	findOneById = async (request: Request, response: Response): Promise<Response> => response.status(StatusCode.SuccessOK).send(await this.service.findOneById(Number(request.params.id)))

	findOneByNickname = async (request: Request, response: Response): Promise<Response> => response.status(StatusCode.SuccessOK).send(await this.service.findOneByNickname(String(request.params.Nickname)))

	edit = async (request: Request, response: Response): Promise<Response> => {
		const { id } = request.params
		const { Description, Local, Nickname } = request.body
		const profile: Partial<Profile> = {
			Description,
			Local,
			Nickname
		}

		await this.service.edit(Number(id), profile)
		return response.status(StatusCode.SuccessOK).end()
	}
}