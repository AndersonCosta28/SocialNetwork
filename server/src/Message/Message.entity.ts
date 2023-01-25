import Friendship from "../Friendship/Friendship.entity"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import User from "../User/User.entity"

@Entity()
export default class Message {
    @PrimaryGeneratedColumn()
    	id: number

    @ManyToOne(() => Friendship, (friendship: Friendship) => friendship.id)
    	Friendship: Friendship

    @ManyToOne(() => User, (user: User) => user.id, { eager: true })
    	From: User

    @ManyToOne(() => User, (user: User) => user.id, { eager: true })
    	To: User

    @Column()
    	Message: string
}