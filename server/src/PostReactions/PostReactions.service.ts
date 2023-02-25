import { TypePostReactions } from "common"
import { Repository } from "typeorm"
import PostReactions from "./PostReactions.entity"

export default class PostReactionsService {

	constructor(private readonly repository: Repository<PostReactions>) { }

	ReactAnPost = async (idPost: number, typeReact: TypePostReactions, idProfileSource: number): Promise<PostReactions[]> => {
		const oldReact = await this.repository.findOne({ where: { Post: { id: idPost }, Profile: { id: idProfileSource } } })
		if (oldReact)
			if (oldReact.TypePostReaction === typeReact)
				await this.UnReactAnPost(idPost, idProfileSource)
			else {
				oldReact.TypePostReaction = typeReact
				await this.repository.update(oldReact.id, oldReact)
			}

		else {
			const reactCreated = this.repository.create({ Post: { id: idPost }, TypePostReaction: typeReact, Profile: { id: idProfileSource } })
			await this.repository.save(reactCreated)
		}
		return this.findByPost(idPost)
	}

	UnReactAnPost = async (idPost: number, idProfileSource: number): Promise<PostReactions[]> => {
		const oldReact = await this.repository.findOne({ where: { Post: { id: idPost }, Profile: { id: idProfileSource } } })
		if (oldReact) 
			 await this.repository.delete(oldReact.id)
		return this.findByPost(idPost)		
	}

	findByPost = async (idPost: number): Promise<PostReactions[]> => {
		const reactions = await this.repository.find({where: { Post: { id: idPost }}})
		return reactions
	}
}
