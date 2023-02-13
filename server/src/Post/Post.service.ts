import Files from "Files/Files.entity"
import Friendship from "Friendship/Friendship.entity"
import AppDataSource from "Providers/Database/DataSource"
import { DeepPartial, Repository } from "typeorm"
import Post from "./Post.entity"

export interface IPostService {
	// findAllByIdsProfile: (idsProfile: number[]) => Promise<Post[]>
	findAllByIdProfile: (idProfile: number) => Promise<Post[]>
	findAllFromFriends: (idProfile: number) => Promise<Post[]>
	create: (idProfile: number, files: DeepPartial<Files[]>, Text: string) => Promise<Post>
}

export default class PostService implements IPostService {
	constructor(private readonly repository: Repository<Post>) { }
	findAllByIdsProfile: (idsProfile: number[]) => Promise<Post[]>
	// /**
	//  * 
	//  * @param idsProfile 
	//  * @returns Post[]
	//  * @remarks This function doesn't make cache the result
	//  */
	// findAllByIdsProfile = async (idsProfile: number[]): Promise<Post[]> => await this.repository.find({
	// 	where: { Profile: { id: In([...idsProfile]) } },
	// 	order: { CreateAt: "DESC" },
	// 	// cache: {
	// 	// 	id: `findAllByIdsProfile_${[...idsProfile]}`,
	// 	// 	milliseconds: 60000
	// 	// }
	// })

	/**
	 * 
	 * @param idProfile 
	 * @returns Post[]
	 * @remarks This functions does make cache the result
	 */
	findAllByIdProfile = async (idProfile: number): Promise<Post[]> => await this.repository.find({
		where: { Profile: { id: idProfile } },
		order: { CreateAt: "DESC" },
		cache: {
			id: `findAllByIdProfile_${idProfile}`,
			milliseconds: 60000
		}
	})

	findAllFromFriends = async (idProfile: number): Promise<Post[]> => {
		const posts: Post[] = []
		const friends: Friendship[] = await AppDataSource.getRepository(Friendship).createQueryBuilder()
			.leftJoinAndMapOne("Friendship.friendProfile", "profile", "target", "(target.id = Friendship.targetId AND Friendship.targetId <> :idProfile) OR (target.id = Friendship.sourceId AND Friendship.sourceId <> :idProfile)", { idProfile })
			.where("Friendship.targetId = :idProfile", { idProfile })
			.orWhere("Friendship.sourceId = :idProfile", { idProfile })
			.where("Friendship.Type = '1'")
			.cache(`findAllFromFriends_${idProfile}`, 60000)
			.getMany()
		friends.forEach(async (friend) => {
			if (friend.friendProfile)
				posts.push(... await this.findAllByIdProfile(friend.friendProfile.id))
		})
		console.log("PAssou")
		posts.push(... await this.findAllByIdProfile(idProfile))

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
		const post = await this.repository.findOne({ where: { id: idPost } })
		if (!post) throw new Error("Post not found")
		return post
	}
}