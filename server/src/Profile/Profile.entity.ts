import Files from "Files/Files.entity"
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class Profile {
	@PrimaryGeneratedColumn()
		id: number

	@Column({ nullable: false, unique: true })
		Nickname: string

	@Column({ default: "" })
		Description?: string

	@OneToOne(() => Files, { cascade: true, eager: true })
	@JoinColumn()
		Avatar?: Files

	@Column({ default: "" })
		Local?: string

}