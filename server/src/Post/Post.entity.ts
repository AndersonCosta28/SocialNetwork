import Files from "Files/Files.entity"
import Friendship from "Friendship/Friendship.entity"
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

    @CreateDateColumn()
    	CreateAt: Date

    @UpdateDateColumn()
    	UpdateAt: Date

    Friends?: Friendship
}