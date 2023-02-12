import Files from "Files/Files.entity"
import Friendship from "Friendship/Friendship.entity"
import AppDataSource from "Providers/Database/DataSource"
import { DeepPartial, In, Repository } from "typeorm"
import Post from "./Post.entity"

export interface IPostService {
	findAllByIdsProfile: (idsProfile: number[]) => Promise<Post[]>
	findAllFromFriends: (idProfile: number) => Promise<Post[]>
	create: (idProfile: number, files: DeepPartial<Files[]>, Text: string) => Promise<Post>
}

export default class PostService implements IPostService {
	constructor(private readonly repository: Repository<Post>) { }
	findAllByIdsProfile = async (idsProfile: number[]): Promise<Post[]> => await this.repository.find({
		where: { Profile: { id: In([...idsProfile]) } },
		order: { CreateAt: "DESC" },
		cache: {
			id: `findAllByIdsProfile_${[...idsProfile]}`,
			milliseconds: 30000
		}
	})

	findAllFromFriends = async (idProfile: number): Promise<Post[]> => {
		const posts: Post[] = []
		const friends: Friendship[] = await AppDataSource.getRepository(Friendship).createQueryBuilder()
			.leftJoinAndMapOne("Friendship.friendProfile", "profile", "target", "(target.id = Friendship.targetId AND Friendship.targetId <> :idProfile) OR (target.id = Friendship.sourceId AND Friendship.sourceId <> :idProfile)", { idProfile })
			.where("Friendship.targetId = :idProfile", { idProfile })
			.orWhere("Friendship.sourceId = :idProfile", { idProfile })
			.where("Friendship.Type = '1'")
			.cache(`findAllFromFriends_${idProfile}`, 30000)
			.getMany()

		const ids = friends.map((friend: Friendship) => friend.friendProfile !== undefined ? friend.friendProfile.id : 0).filter((num: number) => num !== 0)
		ids.push(idProfile)
		posts.push(... await this.findAllByIdsProfile(ids))

		return posts
	}

	create = async (idProfile: number, files: DeepPartial<Files[]>, Text: string): Promise<Post> => {
		const postCreated = this.repository.create({
			Attachments: files,
			Profile: { id: idProfile },
			Text
		})
		const newPost = await this.repository.save(postCreated)
		return this.findOneBy(newPost.id)
	}

	findOneBy = async (idPost: number): Promise<Post> => {
		const post = await this.repository.findOne({ where: { id: idPost } })
		if (!post) throw new Error("Post not found")
		return post
	}
}