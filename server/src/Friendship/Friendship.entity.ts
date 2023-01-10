import { TypeOfFriendship } from "common/Types/Friendship"
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import User from "../User/User.entity"

@Entity()
export default class Friendship {
  @PrimaryGeneratedColumn()
  	id: number

  @ManyToOne(() => User, (user) => user.id)
  	UserSource: User

  @ManyToOne(() => User, (user) => user.id)
  	UserTarget: User

  @Column({
  	type: "enum",
  	enum: TypeOfFriendship,
  	default: TypeOfFriendship.Requested,
  })
  	Type: TypeOfFriendship | string
}
