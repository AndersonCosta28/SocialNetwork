import express, { Request, Response } from "express"
import { friendshipController } from "./Friendship"
import { authenticationController } from "./Authentication"
import { userController } from "./User"
import cors from "cors"
import http from "http"
import { MiddlewareError } from "./Middleware/Error"
import "express-async-errors"
import { messageController } from "./Message"
import { profileController } from "./Profile"

const app = express()
app.use(express.json())
app.use(cors())

const prefix = "/api/v1/"

app.use(prefix + "user", userController.routers())
app.use(prefix + "authentication", authenticationController.routers())
app.use(prefix + "friendship", friendshipController.routers())
app.use(prefix + "message", messageController.routers())
app.use(prefix + "profile", profileController.routers())
app.get(prefix + "ping", (request: Request, response: Response) => response.send("<b>pong</b>"))

app.use(MiddlewareError) // TODO: https://expressjs.com/en/guide/error-handling.html // Writing error handlers (using next(error in controllers))
const server = http.createServer(app)

export default server
