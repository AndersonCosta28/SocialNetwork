import Friendship from "Friendship/Friendship.entity"
import AppDataSource from "Providers/Database/DataSource"
import { Repository } from "typeorm"
import Post from "./Post.entity"

export interface IPostService {
	findAllByIdProfile: (idProfile: number) => Promise<Post[]>
	findAllFromFriends: (idProfile: number) => Promise<Post[]>
}

export default class PostService implements IPostService {
	constructor(private readonly repository: Repository<Post>) { }
	findAllByIdProfile = async (idProfile: number): Promise<Post[]> => await this.repository.find({ where: { Profile: { id: idProfile } } })

	findAllFromFriends = async (idMyProfile: number): Promise<Post[]> => {
		const posts: Post[] = []
		const friends = await AppDataSource.getRepository(Friendship).createQueryBuilder()
			.leftJoinAndMapMany("Friendship.friendProfile", "profile", "target", "(target.id = Friendship.targetId AND Friendship.targetId <> :idMyProfile) OR (target.id = Friendship.sourceId AND Friendship.sourceId <> :idMyProfile)", { idMyProfile })
			.where("Friendship.targetId = :idMyProfile", { idMyProfile })
			.orWhere("Friendship.sourceId = :idMyProfile", { idMyProfile })
			.where("Friendship.Type = '1'")
			.getMany()

		for (const friend of friends) {
			if (!friend.friendProfile) continue
			posts.push(...await this.findAllByIdProfile(friend.friendProfile.id))
		}

		return posts
	}
}