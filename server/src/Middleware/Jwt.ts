import { CustomErrorAPI } from "common"
import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"
import { connectedUsers } from "Providers/Websocket"
import { StatusCode } from "status-code-enum"

export default function JwtMiddleware(request: Request, response: Response, next: NextFunction): void {	
	const token = request.headers.authorization
	const secret = process.env.JWT_SECRET
	const idWebSocket = request.headers["iws"]

	if (!token) throw new CustomErrorAPI("Token not provided", StatusCode.ClientErrorUnauthorized)
	if (!secret) throw new CustomErrorAPI("Secret not provided", 500)
	if (!idWebSocket) throw new CustomErrorAPI("IdWebSocket not provided", StatusCode.ClientErrorUnauthorized)

	const decodedToken = verify(token, secret) as { login: string, id: number, iat: number }
	const user = connectedUsers.find((_user) => _user.SocketID === idWebSocket)

	if (!user) throw new CustomErrorAPI("IdWebSocket is invalid", StatusCode.ClientErrorUnauthorized)
	if (user.UserId !== decodedToken["id"]) throw new CustomErrorAPI("IdWebSocket/IdUser is invalid", StatusCode.ClientErrorUnauthorized)

	response.locals.id = user.UserId

	next()
}