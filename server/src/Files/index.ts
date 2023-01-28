import AppDataSource from "Providers/Database/DataSource"
import FilesController from "./Files.controller"
import Files from "./Files.entity"
import FilesService, { IFilesService } from "./Files.service"

const repository = AppDataSource.getRepository(Files)
export const filesService: IFilesService = new FilesService(repository)
export const filesController = new FilesController(filesService)