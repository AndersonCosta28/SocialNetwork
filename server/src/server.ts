import express, { Request, Response } from "express"
import { friendshipController } from "./Friendship"
import { authenticationController } from "./Authentication"
import { userController } from "./User"
import cors from "cors"
import http from "http"
import { MiddlewareError } from "./Middleware/Error"
import "express-async-errors"

const app = express()
app.use(express.json())
app.use(cors())

app.use("/api/v1/user", userController.routers())
app.use("/api/v1/authentication", authenticationController.routers())
app.use("/api/v1/friendship", friendshipController.routers())
app.get("/api/v1/ping", (request: Request, response: Response) => response.send("<b>pong</b>"))

app.use(MiddlewareError) // TODO: https://expressjs.com/en/guide/error-handling.html // Writing error handlers (using next(error in controllers))
const server = http.createServer(app)

export default server
