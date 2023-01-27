import { Request, Response, Router } from "express"
import { IAuthenticationService } from "./authentication.service"
import { IUserLogin } from "common/Types/User"
import IController from "Types/IController"

export interface IAuthenticationController extends IController {
	login: (request: Request, response: Response) => Promise<Response>
}

export default class AuthenticationController implements IAuthenticationController {
	constructor(private readonly AuthenticationService: IAuthenticationService) { }

	login = async (request: Request, response: Response): Promise<Response> => {
		const usuarioLogin: IUserLogin = request.body
		const retornoDoLogin = await this.AuthenticationService.login(usuarioLogin)
		return response.status(retornoDoLogin.code).send({ ...retornoDoLogin })
	}

	routers = (): Router => {
		const router = Router()
		router.post("/", this.login)
		return router
	}
}
