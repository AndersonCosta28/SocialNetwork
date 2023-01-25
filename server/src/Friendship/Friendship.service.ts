import { Repository } from "typeorm"
import Friendship from "./Friendship.entity"
import { IFriend, TypesOfApplicants, TypeOfFriendship } from "common/Types/Friendship"
import { CustomErrorAPI } from "common"

export interface IFriendshipService {
	findAllByUser: (idUser: number) => Promise<IFriend[]>
	findOneById: (id: number) => Promise<Friendship>
	findOneByUsersId: (idSource: number, idTarget: number) => Promise<Friendship | null>
	createFriendshipRequest: (userSource: number, userTarget: number) => Promise<void>
	reactToFriendRequest: (react: boolean, userId: number, friendId: number) => Promise<void>
	remove: (id: number) => Promise<void>
	updateTypeFriendship: (friendship: Friendship, type: TypeOfFriendship) => Promise<void>
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
					Nickname: true,
					// Level: true,          
				},
				UserTarget: {
					id: true,
					Nickname: true,
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
				WhoRequested: friendship.UserSource.id === idUser ? TypesOfApplicants.Me : TypesOfApplicants.Other
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

	reactToFriendRequest = async (react: boolean, userId: number, friendShipId: number): Promise<void> => {
		const friendShip = await this.findOneById(friendShipId)
		
		if (friendShip.UserTarget.id !== userId) throw new CustomErrorAPI("Only the recipient can react to the request")
		if (react) await this.updateTypeFriendship(friendShip, TypeOfFriendship.Friend )
		else await this.repository.delete(friendShipId)
	}

	findOneById = async (id: number): Promise<Friendship> => {
		const result : Friendship | null = await this.repository.findOne({ where: { id }, relations: {
			UserSource: true,
			UserTarget: true
		} })
		if (result === null) throw new CustomErrorAPI("Friendship not found")
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
		const modelFinded: Friendship | null = await this.findOneById(id)

		modelFinded.Type = TypeOfFriendship.Removed
		await this.repository.update(id, modelFinded)
	}
}
