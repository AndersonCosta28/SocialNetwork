import { Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class Profile {
    @PrimaryGeneratedColumn()
    	id: number

    @Column({ default: "" })
    	Description: string
}