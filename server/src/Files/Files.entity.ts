import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { Buffer } from "buffer"

@Entity()
export default class Files {
	@PrimaryGeneratedColumn()
		id: number

	@Column({ type: "longblob", nullable: true })
		buffer?: Buffer

	@Column({default: "", nullable: true})
		type: string
}