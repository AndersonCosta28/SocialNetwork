import { Request, Response, Router } from "express"
import IController from "Types/IController"
import ProfileService from "./Profile.service"
import multer from "multer"
import Profile from "./Profile.entity"

export default class ProfileController implements IController {

	constructor(private readonly service: ProfileService){}

	storage = multer.memoryStorage()

	upload = multer({ storage: this.storage })

	routers = () => {
		const router: Router = Router()
		router.put("/", this.edit )
		router.post("/editPhoto/:id", this.upload.single("avatar"), this.editPhoto)
		return router
	}

	edit = async (request: Request, response: Response): Promise<Response> => {
		const { Description, Local, id} = request.body
		const profile: Profile = {
			id,
			Description, 
			Local,			
		}

		await this.service.edit(profile)
		return response.end()
	}

	editPhoto = async (request: Request, response: Response): Promise<Response> => {
		console.log(request.file)
		if (!request.file) return response.status(400).send("Photo is undefined")
		const Photo = request.file ? request.file.buffer : ""
		console.log(Photo)
		return response.end()
	}
}