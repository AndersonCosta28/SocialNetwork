import Post from "Post/Post.entity"
import Profile from "Profile/Profile.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export default class PostComments {
    @PrimaryGeneratedColumn()
    	id: number

    @Column()
    	Text: string

    @ManyToOne(() => Profile, { eager: true })
    	ProfileSource: Profile

    @ManyToOne(() => Post)
    	PostTarget: Post

	// @CreateDateColumn({name: "Create_at"})
	// 	CreateAt: Date

	// @UpdateDateColumn({name: "Create_at"})
	// 	UpdateAt: Date
}