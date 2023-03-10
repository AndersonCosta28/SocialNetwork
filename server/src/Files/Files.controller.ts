import { Request, Response, Router } from "express"
import { upload } from "Providers/Multer"
import { StatusCode } from "status-code-enum"
import IController from "Types/IController"
import { IFilesService } from "./Files.service"

export default class FilesController implements IController {
	constructor(private readonly service: IFilesService) { }

	routers = () => {
		const router: Router = Router()
		router.post("/changeAvatar/:id", upload.single("avatar"), this.changeAvatar)
		return router
	}

	changeAvatar = async (request: Request, response: Response): Promise<Response> => {
		const { id } = request.params
		if (!request.file) return response.status(400).send("Photo is undefined")
		const buffer = request.file.buffer
		const type = request.file.mimetype
		return response.status(StatusCode.SuccessOK).send(await this.service.changeAvatar(Number(id), buffer, type))
	}
}