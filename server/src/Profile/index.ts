import AppDataSource from "Providers/Database/DataSource" 
import ProfileController from "./Profile.controller"
import Profile from "./Profile.entity"
import ProfileService from "./Profile.service"

const repository = AppDataSource.getRepository(Profile)
export const profileService = new ProfileService(repository)
export const profileController = new ProfileController(profileService)