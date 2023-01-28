import AppDataSource from "Providers/Database/DataSource" 
import ProfileController from "./Profile.controller"
import Profile from "./Profile.entity"
import ProfileService, { IProfileService } from "./Profile.service"

const repository = AppDataSource.getRepository(Profile)
export const profileService: IProfileService = new ProfileService(repository)
export const profileController = new ProfileController(profileService)