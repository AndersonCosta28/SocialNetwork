import Files from "Files/Files.entity"
import Profile from "Profile/Profile.entity"
import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class Post {
    @PrimaryGeneratedColumn()
    	id: number

    @Column()
    	Content: string

    @OneToMany(() => Files, files => files.id, { eager: true })
    	attachments: Files

    @OneToOne(() => Profile, profile => profile.id, { eager: true })
    @JoinColumn()
    	Profile: Profile

}