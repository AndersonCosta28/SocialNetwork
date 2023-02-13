import { Request, Response, Router } from "express"
import Files from "Files/Files.entity"
import { MiddlewareVerifyIds } from "Middleware/Error"
import { upload } from "Providers/Multer"
import { DeepPartial } from "typeorm"
import IController from "Types/IController"
import { IPostService } from "./Post.service"


export default class PostController implements IController {
	constructor(private readonly service: IPostService) { }
	routers = () => {
		const router: Router = Router()
		router.get("/findAllByIdProfile/:id", this.findAllByIdProfile)
		router.get("/findAllFromFriends/:id", MiddlewareVerifyIds, this.findAllFromFriends)
		router.post("/create/:id", MiddlewareVerifyIds, upload.fields([{ name: "Attachments" }, { name: "Content" }]), this.create)
		return router
	}

	findAllByIdProfile = async (request: Request, response: Response): Promise<Response> => {
		const { id } = request.params
		return response.send(await this.service.findAllByIdProfile(Number(id)))
	}

	findAllFromFriends = async (request: Request, response: Response): Promise<Response> => {
		const { id } = response.locals
		return response.send(await this.service.findAllFromFriends(id))
	}

	create = async (request: Request, response: Response): Promise<Response> => {
		const { id } = response.locals
		const { Attachments = [], Content } = request.files as { Attachments: Express.Multer.File[], Content: Express.Multer.File[] }
		const { Text } = JSON.parse(Content[0].buffer.toString()) as { Text: string }
		const attachmentsParsed: DeepPartial<Files[]> = Attachments.map((attachment: Express.Multer.File) => ({ buffer: attachment.buffer, type: attachment.mimetype }))
		return response.send(await this.service.create(id, attachmentsParsed, Text ))
	}
}