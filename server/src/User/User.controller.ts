import StatusCode from "status-code-enum"
import { Request, Response, Router } from "express"
import { IUserService } from "./User.service"
import { IControllerCrud } from "@Types/IController"
import { CustomErrorAPI, EmailTypes } from "common"
import { IEmailService } from "Email/Email.service"
import Email from "Email/Email.entity"

export interface IUserController extends IControllerCrud {
	activation: (request: Request, response: Response) => Promise<Response>
	resendActivationEmail: (request: Request, response: Response) => Promise<Response>
}
export default class UserController implements IUserController {
	constructor(private readonly service: IUserService, private readonly emailService: IEmailService) { }

	routers = (): Router => {
		const router: Router = Router()
		router.get("/", this.findAll)
		router.get("/:id", this.findOneById)
		router.post("/", this.create)
		router.put("/:id", this.update)
		router.delete("/:id", this.delete)
		router.post("/activation", this.activation)
		router.post("/resendActivationEmail", this.resendActivationEmail)
		router.post("/sendRedefinePasswordEmail", this.sendRedefinePasswordEmail)
		router.post("/checkRedefinePasswordEmail", this.checkRedefinePasswordEmail)
		router.post("/redefinePassword", this.redefinePassword)
		return router
	}

	findAll = async (request: Request, response: Response): Promise<Response> => response.status(StatusCode.SuccessOK).send(await this.service.findAll())

	findOneById = async (request: Request, response: Response): Promise<Response> => {
		const { id } = request.params
		return response.status(StatusCode.SuccessOK).send(await this.service.findOneById(Number(id)))

	}

	create = async (request: Request, response: Response): Promise<Response> => {
		const model = request.body
		await this.service.create(model)
		return response.status(StatusCode.SuccessNoContent).send()
	}

	update = async (request: Request, response: Response): Promise<Response> => {
		const { id } = request.params
		const model = request.body
		await this.service.update(Number(id), model)
		return response.status(StatusCode.SuccessNoContent).send()
	}

	delete = async (request: Request, response: Response): Promise<Response> => {
		const { id } = request.params
		await this.service.delete(Number(id))
		return response.status(StatusCode.SuccessNoContent).send()
	}

	activation = async (request: Request, response: Response): Promise<Response> => {
		const { idemail } = request.body
		return response.status(StatusCode.SuccessNoContent).send(await this.service.activation(idemail))
	}

	resendActivationEmail = async (request: Request, response: Response): Promise<Response> => {
		const { idemail, idUser } = request.body
		if (!idemail) {
			const email: Email | null = await this.emailService.findOneByIdUserAndType(idUser, EmailTypes.Activation)
			if (!email) throw new CustomErrorAPI("Email not found")
			return response.status(StatusCode.SuccessNoContent).send(await this.service.resendActivationEmail(email.idEmail))
		}
		else
			return response.status(StatusCode.SuccessNoContent).send(await this.service.resendActivationEmail(idemail))
	}

	sendRedefinePasswordEmail = async (request: Request, response: Response): Promise<Response> => {
		const { emailUser } = request.body
		return response.status(StatusCode.SuccessNoContent).send(await this.service.sendRedefinePasswordEmail(emailUser))
	}

	checkRedefinePasswordEmail = async (request: Request, response: Response): Promise<Response> => {
		const { idemail } = request.body
		await this.emailService.checkEmailRedefinePassword(idemail)
		return response.status(StatusCode.SuccessNoContent).send()
	}

	redefinePassword = async (request: Request, response: Response): Promise<Response> => {
		const { idemail, newPassword } = request.body
		await this.emailService.checkEmailRedefinePassword(idemail)
		const email: Email | null = await this.emailService.findOneByUUIDAndType(idemail, EmailTypes.RedefinePassword)
		if (!email) throw new CustomErrorAPI("Email not found", 404)
		await this.service.redefinePassword(email, newPassword)
		return response.status(StatusCode.SuccessNoContent).send()
	}
}