import { Server, Socket } from "socket.io"
import http from "http"
import { IMessage } from "common/Types/Friendship"
import { IUserSocket } from "common"

export const WebSocket = (server: http.Server) => {
	let users: Array<IUserSocket> = []
	const io = new Server(server, {
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
			users.push({
				SocketID: socket.id,
				Nickname: String(Nickname ?? "Não identificado"),
				UserId: Number(UserId),
			})

		io.emit("onlineUsers", users)
		socket.on("message", (data: IMessage, callback) => {
			const Message: IMessage = { ...data, Id: 0 }
			users.forEach((userSocket: IUserSocket) => {
				if (userSocket.UserId === data.ToId)
					io.to(userSocket.SocketID).emit("message", Message)
			})

			users.forEach((userSocket: IUserSocket) => {
				if (userSocket.UserId === data.FromId)
					io.to(userSocket.SocketID).emit("message", Message)
			})
			callback({ response: "OK" })
		})

		socket.on("disconnect", () => {
			console.log("Desconectou")
			users = users.filter((user) => user.SocketID !== socket.id)
			io.emit("onlineUsers", users)
		})
	})

	return io
}
