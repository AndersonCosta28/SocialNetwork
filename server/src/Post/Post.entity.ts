import Files from "Files/Files.entity"
import Friendship from "Friendship/Friendship.entity"
import PostReactions from "PostReactions/PostReactions.entity"
import Profile from "Profile/Profile.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"

@Entity()
export default class Post {
    @PrimaryGeneratedColumn()
    	id: number

    @Column()
    	Text: string

    @OneToMany(() => Files, files => files.Post, { eager: true, cascade: true, nullable: true })
    	Attachments?: Files[]

    @ManyToOne(() => Profile, profile => profile.id, { eager: true })
    	Profile: Profile

    @OneToMany(() => PostReactions, postReactions => postReactions.Post, { eager: true })
    	Reactions: PostReactions

    @CreateDateColumn()
    	CreateAt: Date

    @UpdateDateColumn()
    	UpdateAt: Date    

    Friends?: Friendship
}