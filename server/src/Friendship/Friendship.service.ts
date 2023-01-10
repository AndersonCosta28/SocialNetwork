import { DeleteResult, Repository } from "typeorm"
import Friendship from "./Friendship.entity"
import { TypeOfFriendship } from "common/Types/Friendship"
import { CustomErrorAPI } from "common"

export interface IFriendshipService {
	findAllByUser: (idUser: number) => Promise<Friendship[]>
	createFriendshipRequest: (userSource: number, userTarget: number) => Promise<void>
	checkIfItAlreadyExists: (idSource: number, idTarget: number) => Promise<boolean>
	reactToFriendRequest: (react: boolean, userId: number, friendId: number) => Promise<void>
	findOneById: (id: number) => Promise<Friendship | null>
	delete: (id: number) => Promise<boolean>
}

export default class FriendshipService implements IFriendshipService {
	constructor(private readonly repository: Repository<Friendship>) { }

	findAllByUser = async (idUser: number): Promise<Friendship[]> => {
		const result = await this.repository.find({
			relations: {
				UserSource: true,
				UserTarget: true,
			},
			select: {
				UserSource: {
					id: true,
					// Nickname: true,
					// Level: true,          
				},
				UserTarget: {
					id: true,
					// Nickname: true,
					// Level: true,
				},
			},
			where: [{ UserSource: { id: idUser } }, { UserTarget: { id: idUser } }],
		})
		return result
	}

	createFriendshipRequest = async (userSource: number, userTarget: number): Promise<void> => {
		const friendShip: Friendship = this.repository.create({
			UserSource: { id: userSource },
			UserTarget: { id: userTarget },
			Type: TypeOfFriendship.Requested,
		})
		await this.repository.save(friendShip)
	}

	checkIfItAlreadyExists = async (idSource: number, idTarget: number): Promise<boolean> => {
		const result: Friendship[] = await this.repository.findBy([
			{ UserSource: { id: idSource }, UserTarget: { id: idTarget } },
			{ UserSource: { id: idTarget }, UserTarget: { id: idSource } },
		])
		return result.length > 0
	}

	reactToFriendRequest = async (react: boolean, userId: number, friendId: number): Promise<void> => {
		const friendShip = await this.findOneById(friendId)
		if (!friendShip) throw new CustomErrorAPI("Friendship not found")
		if (friendShip.UserTarget.id !== userId) throw new CustomErrorAPI("Only the recipient can react to the request")
		if (react) await this.repository.update(friendId, { ...friendShip, Type: TypeOfFriendship.Friend })
		else await this.repository.delete(friendId)
	}

	findOneById = async (id: number): Promise<Friendship | null> => {
		const result = await this.repository.findOne({ where: { id } })
		return result
	}

	delete = async (id: number): Promise<boolean> => {
		const modelFinded: Friendship | null = await this.findOneById(id)
		if (!modelFinded) throw new CustomErrorAPI("Friendship not found")

		const resultDelete: DeleteResult = await this.repository.delete({ id: id })
		return (resultDelete.affected ?? 0) > 0
	}
}
