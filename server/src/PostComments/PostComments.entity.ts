import Post from "Post/Post.entity"
import Profile from "Profile/Profile.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export default class PostComments {
	@PrimaryGeneratedColumn()
		id: number

	@Column({ type: "longtext" })
		Text: string

	@ManyToOne(() => Profile, { eager: true })
		ProfileSource: Profile

	@ManyToOne(() => Post, post => post.Comments)
		PostTarget: Post

	@CreateDateColumn()
		CreateAt: Date

	@UpdateDateColumn()
		UpdateAt: Date
}