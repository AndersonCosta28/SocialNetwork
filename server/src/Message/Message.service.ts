import { IMessage } from "common"
import { Repository } from "typeorm"
import Message from "./Message.entity"

export default class MessageService {
	constructor(private readonly repository: Repository<Message>) { }

	findByFriendship = async (idFriendship: number): Promise<IMessage[]> => {
		const messages = await this.repository.findBy({ Friendship: { id: idFriendship } })
		const messagesFormattedToFrontEnd: IMessage[] = messages.map((message: Message) => ({
			FriendshipId: idFriendship,
			FromId: message.From.id,
			ToId: message.To.id,
			id: message.id,
			Message: message.Message
		}))
		return messagesFormattedToFrontEnd
	}

	create = async (message: Message): Promise<Message> => {
		const messageCreated = this.repository.create(message)
		return await this.repository.save(messageCreated)
	}
}