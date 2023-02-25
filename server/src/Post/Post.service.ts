import Files from "Files/Files.entity"
import Friendship from "Friendship/Friendship.entity"
import AppDataSource from "Providers/Database/DataSource"
import { DeepPartial, Repository } from "typeorm"
import Post from "./Post.entity"

export interface IPostService {
	findAllByIdProfile: (idProfile: number) => Promise<Post[]>
	findAllFromFriends: (idProfile: number) => Promise<Post[]>
	create: (idProfile: number, files: DeepPartial<Files[]>, Text: string) => Promise<Post>
	findOneBy:(idPost: number) => Promise<Post> 
}

export default class PostService implements IPostService {
	constructor(private readonly repository: Repository<Post>) { }
	findAllByIdProfile = async (idProfile: number): Promise<Post[]> => {
		const result = await this.repository.find({
			where: { Profile: { id: idProfile } }
			// order: { CreateAt: "DESC" },
			// cache: {
			// 	id: `findAllByIdProfile_${idProfile}`,
			// 	milliseconds: 60000
			// }
		})
		return result
	}

	findAllFromFriends = async (idProfile: number): Promise<Post[]> => {
		const posts: Post[] = []
		const friends: Friendship[] = await AppDataSource.getRepository(Friendship).createQueryBuilder()
			.innerJoinAndMapOne("Friendship.friendProfile", "profile", "target", "(target.id = Friendship.targetId AND Friendship.sourceId = :idProfile) OR (target.id = Friendship.sourceId AND Friendship.targetId = :idProfile)", { idProfile })
			.where("Friendship.targetId = :idProfile", { idProfile })
			.orWhere("Friendship.sourceId = :idProfile", { idProfile })
			.where("Friendship.Type = '1'")
			.cache(`findAllFromFriends_${idProfile}`, 60000)
			.getMany()

		for (const friend of friends)
			if (friend.friendProfile)
				posts.push(...await this.findAllByIdProfile(friend.friendProfile.id))

		posts.push(...await this.findAllByIdProfile(idProfile))
		posts.sort((postA, postB) => postA.id - postB.id)
		return posts
	}

	create = async (idProfile: number, files: DeepPartial<Files[]>, Text: string): Promise<Post> => {
		const postCreated = this.repository.create({
			Attachments: files,
			Profile: { id: idProfile },
			Text
		})
		const newPost = await this.repository.save(postCreated)
		await AppDataSource.queryResultCache?.remove([`findAllByIdProfile_${idProfile}`])
		return this.findOneBy(newPost.id)
	}

	findOneBy = async (idPost: number): Promise<Post> => {
		const post = await this.repository.findOne({ where: { id: idPost }, relations: {
			Attachments: true,
			Comments: true,
			Profile: true,
			Reactions: true,
			
		} })
		if (!post) throw new Error("Post not found")
		return post
	}
}