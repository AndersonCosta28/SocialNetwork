import { Server, Socket } from "socket.io"
import http from "http"
import { IMessage } from "common/Types/Friendship"
import { IUserSocket } from "common"
import { DefaultEventsMap } from "socket.io/dist/typed-events"

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
		if (socket.handshake.auth.authenticated) next()
		else next(new Error("Invalid"))
	})

	io.on("connection", (socket: Socket) => {
		console.log("Conectou")
		const socketsIdArray = Array.from(io.sockets.sockets, ([name, value]) => ({ name, value })).map(value => value.value.id)
		const { Nickname, UserId } = socket.handshake.query
		if (socketsIdArray.some((value) => value.includes(socket.id)))
			connectedUsers.push({
				SocketID: socket.id,
				Nickname: String(Nickname ?? "Não identificado"),
				UserId: Number(UserId),
			})

		io.emit("onlineUsers", connectedUsers)
		socket.on("message", (data: IMessage, callback) => {
			const Message: IMessage = { ...data, Id: 0 }
			connectedUsers.forEach((userSocket: IUserSocket) => {
				if (userSocket.UserId === data.ToId)
					io.to(userSocket.SocketID).emit("message", Message)
			})

			connectedUsers.forEach((userSocket: IUserSocket) => {
				if (userSocket.UserId === data.FromId)
					io.to(userSocket.SocketID).emit("message", Message)
			})
			callback({ response: "OK" })
		})

		socket.on("disconnect", () => {
			console.log("Desconectou")
			connectedUsers = connectedUsers.filter((user) => user.SocketID !== socket.id)
			io.emit("onlineUsers", connectedUsers)
		})
	})

	return io
}

export const getIo = () => io