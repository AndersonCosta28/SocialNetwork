import { connectedUsers, getIo } from "Providers/Websocket"
import { IUserSocket } from "common"
import { TypeOfFriendship } from "common/Types/Friendship"
import { AfterInsert, AfterUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
import Profile from "Profile/Profile.entity"

@Entity()
export default class Friendship {
	@PrimaryGeneratedColumn()
		id: number

	@ManyToOne(() => Profile, (profile) => profile.id, { eager: true })
		Source: Profile

	@ManyToOne(() => Profile, (profile) => profile.id, { eager: true })
		Target: Profile

	@Column({
		type: "enum",
		enum: TypeOfFriendship,
		default: TypeOfFriendship.Requested,
	})
		Type: TypeOfFriendship | string


	friendProfile?: Profile

	@AfterUpdate()
	AfterUpdate?() {
		if (this.Type === TypeOfFriendship.Friend) {
			const connectecUserSource = connectedUsers.find((user: IUserSocket) => user.UserId === this.Source.id)
			if (connectecUserSource)
				getIo().to(connectecUserSource.SocketID).emit("update_list_friend", "Teste")
		}

		if (this.Type === TypeOfFriendship.Removed) {
			const connectecUserSource = connectedUsers.find((user: IUserSocket) => user.UserId === this.Source.id)
			const connectecUserTarget = connectedUsers.find((user: IUserSocket) => user.UserId === this.Target.id)
			if (connectecUserSource)
				getIo().to(connectecUserSource.SocketID).emit("update_list_friend", "Teste")

			if (connectecUserTarget)
				getIo().to(connectecUserTarget.SocketID).emit("update_list_friend", "Teste")
		}

		if (this.Type === TypeOfFriendship.Requested) { // Só acontece quando a amizade foi excluída e solicitada novamente, quando é a primeira vez tem que fazer essa verificação no after insert
			const connectecUserTarget = connectedUsers.find((user: IUserSocket) => user.UserId === this.Target.id)
			if (connectecUserTarget)
				getIo().to(connectecUserTarget.SocketID).emit("update_list_friend", "Teste")
		}
	}

	@AfterInsert()
	afterInsert() {
		const connectecUserTarget = connectedUsers.find((user: IUserSocket) => user.UserId === this.Target.id)
		if (connectecUserTarget)
			getIo().to(connectecUserTarget.SocketID).emit("update_list_friend", "Teste")
	}
}
