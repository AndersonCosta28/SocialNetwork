import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import { Buffer } from "buffer"
import Post from "Post/Post.entity"

@Entity()
export default class Files {
	@PrimaryGeneratedColumn()
		id: number

	@Column({ type: "longblob", nullable: true })
		buffer?: Buffer

	@Column({ default: "", nullable: true })
		type: string

	@ManyToOne(() => Post, post => post.Attachments, { nullable: true })
		Post: Post
}