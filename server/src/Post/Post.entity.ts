import Files from "Files/Files.entity"
import PostComments from "PostComments/PostComments.entity"
import PostReactions from "PostReactions/PostReactions.entity"
import Profile from "Profile/Profile.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export default class Post {
    @PrimaryGeneratedColumn()
    	id: number

    @Column({ type: "longtext" })
    	Text: string

    @OneToMany(() => Files, files => files.Post)
    	Attachments?: Files[]

    @ManyToOne(() => Profile, profile => profile.Posts)
    	Profile: Profile

    @OneToMany(() => PostReactions, postReactions => postReactions.Post)
    	Reactions: PostReactions

    @OneToMany(() => PostComments, postComments => postComments.PostTarget)
    	Comments: PostComments

    @CreateDateColumn()
    	CreateAt: Date

    @UpdateDateColumn()
    	UpdateAt: Date
}