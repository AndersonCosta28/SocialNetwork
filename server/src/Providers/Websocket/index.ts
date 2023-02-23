import http from "http"
import { Server, Socket } from "socket.io"
import { DefaultEventsMap } from "socket.io/dist/typed-events"
import { IMessage } from "common/Types/Friendship"
import { IUserSocket } from "common"
import { messageService } from "Message"
import Message from "Message/Message.entity"
import { friendshipService } from "Friendship"
import Friendship from "Friendship/Friendship.entity"
import User from "User/User.entity"
import { userService } from "User"
import { verify } from "jsonwebtoken"


export let connectedUsers: Array<IUserSocket> = []
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>


export const setIo = (server: http.Server) => {
	io = new Server(server, {
		cors: {
			origin: "*",
			methods: "*",
		},
	})

	io.use((socket, next) => {
		const { token } = socket.handshake.auth
		if (token === null || token === "" || token === undefined) next(new Error("Invalid"))
		else {
			const secret = process.env.JWT_SECRET
			if (!secret) {
				next(new Error("Secret not provided"))
				return
			}
			const { login, id, iat } = verify(token, secret) as { login: string, id: number, iat: number }
			if (login && id && iat)
				next()
			else next(new Error("Token invalid"))
		}
	})

	io.on("connection", (socket: Socket) => {
		console.log(socket.id + " Connected")
		const socketsIdArray = Array.from(io.sockets.sockets, ([name, value]) => ({ name, value })).map(value => value.value.id)
		const { Nickname, UserId } = socket.handshake.query
		if (socketsIdArray.some((value) => value.includes(socket.id)))
			connectedUsers.push({
				SocketID: socket.id,
				Nickname: String(Nickname ?? "Não identificado"),
				UserId: Number(UserId),
			})

		io.emit("onlineUsers", connectedUsers)
		socket.on("message", async (data: IMessage, callback) => {
			try {
				const friendship: Friendship = await friendshipService.findOneById(data.FriendshipId)
				const fromUser: User = await userService.findOneById(data.FromId)
				const toUser: User = await userService.findOneById(data.ToId)
				let message: Message = {
					Friendship: friendship,
					From: fromUser,
					To: toUser,
					id: 0,
					Message: data.Message
				}

				message = await messageService.create(message)
				const imessage: IMessage = {
					FriendshipId: message.Friendship.id,
					FromId: message.From.id,
					id: message.id,
					Message: message.Message,
					ToId: message.To.id
				}

				connectedUsers.forEach((userSocket: IUserSocket) => {
					if (userSocket.UserId === data.ToId)
						io.to(userSocket.SocketID).emit("message", imessage)
				})

				connectedUsers.forEach((userSocket: IUserSocket) => {
					if (userSocket.UserId === data.FromId)
						io.to(userSocket.SocketID).emit("message", imessage)
				})
				callback({ response: "OK" })
			}
			catch (error) {
				callback({ response: "ERROR" })
			}
		})

		socket.on("disconnect", () => {
			console.log(socket.id + " Disconnected")
			connectedUsers = connectedUsers.filter((user) => user.SocketID !== socket.id)
			io.emit("onlineUsers", connectedUsers)
		})
	})

	return io
}

export const getIo = () => io