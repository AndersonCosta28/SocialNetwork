import { EmailTypes } from "common"
import User from "../User/User.entity"
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
@Entity()
export default class Email {
  @PrimaryGeneratedColumn()
  	id: number

  @Column()
  	idEmail: string

  @ManyToOne(() => User, (user: User) => user.id, { eager: true, onDelete: "CASCADE" })
  	user: User

  @Column()
  	content: string

  @Column({ type: "enum", default: EmailTypes.Activation, enum: EmailTypes })
  	type: EmailTypes | string

  @Column()
  	ExpiresAt: string

  @CreateDateColumn()
  	createAt: Date

  @UpdateDateColumn()
  	updateAt: Date
}
