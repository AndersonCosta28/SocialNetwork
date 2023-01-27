import { AfterLoad, Column, Entity, PrimaryGeneratedColumn } from "typeorm"

@Entity()
export default class Profile {
    @PrimaryGeneratedColumn()
    	id: number

    @Column({ default: "" })
    	Description?: string

    @Column({ type: "blob" })
    	Photo?: Buffer | string

    @Column()
    	Local?: string


    @AfterLoad()
    afterLoad?() {
    	this.Photo = this.Photo?.toString("base64")
    	console.log(this)
    }
}