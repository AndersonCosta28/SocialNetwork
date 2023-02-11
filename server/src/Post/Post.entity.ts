import Files from "Files/Files.entity"
import Friendship from "Friendship/Friendship.entity"
import Profile from "Profile/Profile.entity"
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm"

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

    Friends?: Friendship
}