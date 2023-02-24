import Files from "Files/Files.entity"
import Friendship from "Friendship/Friendship.entity"
import Profile from "Profile/Profile.entity"
import AppDataSource from "Providers/Database/DataSource"
import { DeepPartial, Repository } from "typeorm"
import Post from "./Post.entity"

type ProfilePost = {
	Profile: Profile,
	Posts: Omit<Post, "Profile">[]
}

export interface IPostService {
	findAllByIdProfile: (idProfile: number, getProfile: boolean) => Promise<ProfilePost | null>
	findAllFromFriends: (idProfile: number) => Promise<ProfilePost[]>
	create: (idProfile: number, files: DeepPartial<Files[]>, Text: string) => Promise<Post>
}

export default class PostService implements IPostService {
	constructor(private readonly repository: Repository<Post>) { }
	findAllByIdProfile = async (idProfile: number, getProfile = true): Promise<ProfilePost | null> => {
		const result = await this.repository.find({
			where: { Profile: { id: idProfile } }, relations: { Profile: getProfile }
			// order: { CreateAt: "DESC" },
			// cache: {
			// 	id: `findAllByIdProfile_${idProfile}`,
			// 	milliseconds: 60000
			// }
		})

		if (result.length === 0) return null
		const profile = { ...result[0].Profile }
		const ar: ProfilePost = {
			Profile: profile,
			Posts: []
		}
		const _result = result.map(post => post)
		_result.forEach((post: Partial<Post>) => {
			delete post.Profile
			ar.Posts.push({ ...post } as Omit<Post, "Profile">)
		})
		return ar
	}

	findAllFromFriends = async (idProfile: number): Promise<ProfilePost[]> => {
		const posts: ProfilePost[] = []
		const friends: Friendship[] = await AppDataSource.getRepository(Friendship).createQueryBuilder()
			.innerJoinAndMapOne("Friendship.friendProfile", "profile", "target", "(target.id = Friendship.targetId AND Friendship.sourceId = :idProfile) OR (target.id = Friendship.sourceId AND Friendship.targetId = :idProfile)", { idProfile })
			.where("Friendship.targetId = :idProfile", { idProfile })
			.orWhere("Friendship.sourceId = :idProfile", { idProfile })
			.where("Friendship.Type = '1'")
			.cache(`findAllFromFriends_${idProfile}`, 60000)
			.getMany()

		for (const friend of friends)
			if (friend.friendProfile) {
				const _posts = await this.findAllByIdProfile(friend.friendProfile.id)
				if (!_posts) continue
				posts.push(_posts)
			}
		const _posts = await this.findAllByIdProfile(idProfile)
		if (_posts)
			posts.push(_posts)

		const result: ProfilePost[] = []
		posts.forEach(_posts => {
			_posts.Posts.sort((postA, postB) => postA.id - postB.id)
			result.push(_posts)
		})
		return result
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