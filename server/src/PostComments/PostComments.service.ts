import { Repository } from "typeorm"
import PostComments from "./PostComments.entity"

export default class PostCommentsService {
	constructor(private readonly repository: Repository<PostComments>) { }

	create = async (idPost: number, idProfileSource: number, text: string) => {
		const commentCreated = this.repository.create({Text: text, PostTarget: { id: idPost }, ProfileSource: { id: idProfileSource }})
		return await this.repository.save(commentCreated)
	}

	update = async (idComment: number, idProfileSource: number, text: string) => {
		const comment = await this.findOne(idComment)
		if (comment.ProfileSource.id !== idProfileSource) throw new Error("You cannot change someone else's comment")
		comment.Text = text
		await this.repository.update(idComment, comment)
	}

	delete = async (idComment: number, idProfile: number) => {
		const comment = await this.findOne(idComment)
		if (comment.ProfileSource.id !== idProfile || comment.PostTarget.Profile.id !== idProfile)
			throw new Error("You cannot delete this comment")
		await this.repository.remove(comment)
	}

	findOne = async (id: number) => {
		const comment  = await this.repository.findOneBy({id})
		if (!comment) throw new Error("Comment not found")
		return comment
	}

}