import express, { Request, Response } from "express"
import { friendshipController } from "./Friendship"
import { authenticationController } from "./Authentication"
import { userController } from "./User"
import cors from "cors"
import http from "http"
import { Server, Socket } from "socket.io"
import { IMessage } from "common/Types/Friendship"
import { IUserSocket } from "common/Types/User"
import { MiddlewareError } from "./Middleware/Error"
import "express-async-errors"
import { v4 } from "uuid"

let users: Array<IUserSocket> = []
const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/v1/user", userController.routers())
app.use("/api/v1/authentication", authenticationController.routers())
app.use("/api/v1/friendship", friendshipController.routers())
app.get("/api/v1/ping", (request: Request, response: Response) => response.send("<b>pong</b>"))

app.use(MiddlewareError) // TODO: https://expressjs.com/en/guide/error-handling.html // Writing error handlers (using next(error in controllers))
const server = http.createServer(app)
export const io = new Server(server, {
	cors: {
		origin: "*",
		methods: "*",
	},
})

users = []

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
		const target = users.find((userSocket: IUserSocket) => userSocket.UserId === data.ToId)
		if (target)
			io.to(socket.id).to(target.SocketID).emit("message", { id: v4(), message: data.Message, fromId: data.FromId, toId: data.ToId })
		else
			io.to(socket.id).emit("message", { id: v4(), message: data.Message, fromId: data.FromId, toId: data.ToId })
		callback({ response: "OK" })
	})

	socket.on("disconnect", () => {
		console.log("Desconectou")
		users = users.filter((user) => user.SocketID !== socket.id)
		io.emit("onlineUsers", users)
	})
})

export default server
