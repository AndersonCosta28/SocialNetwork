import { NotifyFriendship } from "Providers/Websocket"
import { TypeOfFriendship } from "common/Types/Friendship"
import { AfterInsert, AfterRemove, AfterUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import Profile from "Profile/Profile.entity"

@Entity()
export default class Friendship {
	@PrimaryGeneratedColumn()
		id: number

	@ManyToOne(() => Profile, (profile) => profile.id, { eager: true })
		Source: Profile

	@ManyToOne(() => Profile, (profile) => profile.id, { eager: true })
		Target: Profile

	@Column({ type: "enum", enum: TypeOfFriendship, default: TypeOfFriendship.Requested })
		Type: TypeOfFriendship | string

	friendProfile?: Profile

	@AfterUpdate()
	AfterUpdate?() {
		NotifyFriendship(this)
	}

	@AfterInsert()
	afterInsert?() {
		NotifyFriendship(this)
	}

	@AfterRemove()
	afterRemove(){
		NotifyFriendship(this)
	}
}
