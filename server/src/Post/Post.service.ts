import Files from "Files/Files.entity"
import Friendship from "Friendship/Friendship.entity"
import AppDataSource from "Providers/Database/DataSource"
import { DeepPartial, Repository } from "typeorm"
import Post from "./Post.entity"

export interface IPostService {
	findAllByIdProfile: (idProfile: number) => Promise<Post[]>
	findAllFromFriends: (idProfile: number) => Promise<Post[]>
	create: (idProfile: number, files: DeepPartial<Files[]>, Text: string) => Promise<void>
}

export default class PostService implements IPostService {
	constructor(private readonly repository: Repository<Post>) { }
	findAllByIdProfile = async (idProfile: number): Promise<Post[]> => await this.repository.find({ where: { Profile: { id: idProfile } } })

	findAllFromFriends = async (idProfile: number): Promise<Post[]> => {
		const posts: Post[] = []
		const friends = await AppDataSource.getRepository(Friendship).createQueryBuilder()
			.leftJoinAndMapMany("Friendship.friendProfile", "profile", "target", "(target.id = Friendship.targetId AND Friendship.targetId <> :idProfile) OR (target.id = Friendship.sourceId AND Friendship.sourceId <> :idProfile)", { idProfile })
			.where("Friendship.targetId = :idProfile", { idProfile })
			.orWhere("Friendship.sourceId = :idProfile", { idProfile })
			.where("Friendship.Type = '1'")
			.getMany()

		for (const friend of friends) {
			if (!friend.friendProfile) continue
			posts.push(...await this.findAllByIdProfile(friend.friendProfile.id))
		}

		return posts
	}

	create = async (idProfile: number, files: DeepPartial<Files[]>, Text: string): Promise<void> => {
		const postCreated = this.repository.create({
			Attachments: files,
			Profile: {
				id: idProfile
			},
			Text
		})
		await this.repository.save(postCreated)
	}
}