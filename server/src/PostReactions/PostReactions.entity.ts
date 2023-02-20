import { TypePostReactions } from "common"
import Post from "Post/Post.entity"
import Profile from "Profile/Profile.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class PostReactions {
    @PrimaryGeneratedColumn()
    	id: number

    @Column({ enum: TypePostReactions, type: "enum", default: TypePostReactions.Like })
    	TypePostReaction: TypePostReactions

    @ManyToOne(() => Post, post => post.Reactions)
    	Post: Post

    @ManyToOne(() => Profile, { eager: true })
    	Profile: Profile
}