import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"
import { Blob } from "buffer"

@Entity()
export default class Files {
	@PrimaryGeneratedColumn()
		id: number

	@Column({ type: "longblob", nullable: true })
		buffer?: Blob

	@Column({default: "", nullable: true})
		type: string
}