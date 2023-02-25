import { Repository } from "typeorm"
import Friendship from "./Friendship.entity"
import { IFriend, TypesOfApplicants, TypeOfFriendship } from "common/Types/Friendship"
import { CustomErrorAPI } from "common"
import { Buffer } from "buffer"

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
				Source: true,
				Target: true,
			},
			select: {
				Source: {
					id: true,
					Nickname: true,
					// Level: true,          
				},
				Target: {
					id: true,
					Nickname: true,
					// Level: true,
				},
			},
			where: [{ Source: { id: idUser } }, { Target: { id: idUser } }],
		})

		for (const friendship of friendships) {
			const friendProfile = friendship.Source.id === idUser ? friendship.Target : friendship.Source
			const buffer: Buffer | undefined = friendProfile.Avatar?.buffer
			friendList.push({
				FriendshipId: friendship.id,
				Type: friendship.Type,
				WhoRequested: friendship.Source.id === idUser ? TypesOfApplicants.Me : TypesOfApplicants.Other,
				FriendProfile: {					
					...friendProfile,
					Avatar: buffer?.toString() ?? "",
					Description: friendProfile.Description ?? "",					
					Local: friendProfile.Local ?? "",
				}
			})
		}

		return friendList
	}

	createFriendshipRequest = async (userSource: number, userTarget: number): Promise<void> => {
		const friendShip: Friendship = this.repository.create({
			Source: { id: userSource },
			Target: { id: userTarget },
			Type: TypeOfFriendship.Requested,
		})
		await this.repository.save(friendShip)
	}

	updateTypeFriendship = async (friendship: Friendship, type: TypeOfFriendship): Promise<void> => {
		friendship.Type = type
		const friendshipCreated = this.repository.create(friendship)
		await this.repository.save(friendshipCreated)
	}

	reactToFriendRequest = async (react: boolean, userId: number, friendShipId: number): Promise<void> => {
		const friendship = await this.findOneById(friendShipId)
		if (friendship.Target.id !== userId) throw new CustomErrorAPI("Only the recipient can react to the request")
		if (react) await this.updateTypeFriendship(friendship, TypeOfFriendship.Friend)
		else await this.repository.delete(friendShipId)
	}

	findOneById = async (id: number): Promise<Friendship> => {
		const result: Friendship | null = await this.repository.findOne({
			where: { id }, relations: {
				Source: true,
				Target: true
			}
		})
		if (result === null) throw new CustomErrorAPI("Friendship not found")
		return result
	}

	findOneByUsersId = async (idSource: number, idTarget: number): Promise<Friendship | null> => {
		const friendship: Friendship | null = await this.repository.findOneBy([
			{ Source: { id: idSource }, Target: { id: idTarget } },
			{ Source: { id: idTarget }, Target: { id: idSource } },
		])
		return friendship
	}

	remove = async (id: number): Promise<void> => {
		const modelFinded: Friendship | null = await this.findOneById(id)
		await this.repository.remove(modelFinded)
		// modelFinded.Type = TypeOfFriendship.Removed
		// await this.repository.save(modelFinded)
	}
}
