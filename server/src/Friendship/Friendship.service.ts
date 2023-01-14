import { Repository } from "typeorm"
import Friendship from "./Friendship.entity"
import { IFriend, TypeOfFriendship } from "common/Types/Friendship"
import { CustomErrorAPI } from "common"

export interface IFriendshipService {
	findAllByUser: (idUser: number) => Promise<IFriend[]>
	createFriendshipRequest: (userSource: number, userTarget: number) => Promise<void>
	reactToFriendRequest: (react: boolean, userId: number, friendId: number) => Promise<void>
	findOneByFriendshipId: (id: number) => Promise<Friendship | null>
	remove: (id: number) => Promise<void>
	updateTypeFriendship: (friendship: Friendship, type: TypeOfFriendship) => Promise<void>
	findOneByUsersId: (idSource: number, idTarget: number) => Promise<Friendship | null>
}

export default class FriendshipService implements IFriendshipService {
	constructor(private readonly repository: Repository<Friendship>) { }

	findAllByUser = async (idUser: number): Promise<IFriend[]> => {
		const friendList: IFriend[] = []
		const friendships: Friendship[] = await this.repository.find({
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

		for (const friendship of friendships)
			friendList.push({
				FriendshipId: friendship.id,
				Type: friendship.Type,
				FriendId: friendship.UserSource.id === idUser ? friendship.UserTarget.id : friendship.UserSource.id,
				FriendNickname: friendship.UserSource.id === idUser ? friendship.UserTarget.Nickname : friendship.UserSource.Nickname,
			})

		return friendList
	}

	createFriendshipRequest = async (userSource: number, userTarget: number): Promise<void> => {
		const friendShip: Friendship = this.repository.create({
			UserSource: { id: userSource },
			UserTarget: { id: userTarget },
			Type: TypeOfFriendship.Requested,
		})
		await this.repository.save(friendShip)
	}

	updateTypeFriendship = async (friendship: Friendship, type: TypeOfFriendship): Promise<void> =>  {
		friendship.Type = type
		const friendshipCreated = this.repository.create(friendship)
		await this.repository.update(friendship.id, friendshipCreated)
	}

	reactToFriendRequest = async (react: boolean, userId: number, friendId: number): Promise<void> => {
		const friendShip = await this.findOneByFriendshipId(friendId)
		if (!friendShip) throw new CustomErrorAPI("Friendship not found")
		if (friendShip.UserTarget.id !== userId) throw new CustomErrorAPI("Only the recipient can react to the request")
		if (react) await this.repository.update(friendId, { ...friendShip, Type: TypeOfFriendship.Friend })
		else await this.repository.delete(friendId)
	}

	findOneByFriendshipId = async (id: number): Promise<Friendship | null> => {
		const result = await this.repository.findOne({ where: { id } })
		return result
	}

	findOneByUsersId = async (idSource: number, idTarget: number): Promise<Friendship | null> => {
		const friendship: Friendship | null = await this.repository.findOneBy([
			{ UserSource: { id: idSource }, UserTarget: { id: idTarget } },
			{ UserSource: { id: idTarget }, UserTarget: { id: idSource } },
		])
		return friendship
	}

	remove = async (id: number): Promise<void> => {
		const modelFinded: Friendship | null = await this.findOneByFriendshipId(id)
		if (!modelFinded) throw new CustomErrorAPI("Friendship not found")
		modelFinded.Type = TypeOfFriendship.Removed
		await this.repository.update(id, modelFinded)
		// const resultDelete: DeleteResult = await this.repository.delete({ id: id })
		// return (resultDelete.affected ?? 0) > 0
	}
}
