import AppDataSource from "../Providers/Database/DataSource"
import MessageController from "./Message.controller"
import Message from "./Message.entity"
import MessageService from "./Message.service"

const repository = AppDataSource.getRepository(Message)
export const messageService = new MessageService(repository)
export const messageController = new MessageController(messageService)