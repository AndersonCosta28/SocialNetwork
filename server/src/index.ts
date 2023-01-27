import { setIo } from "Providers/Websocket"
import "reflect-metadata"
import server from "./server"
import "Providers/Redis"

// await redisClient.connect()
setIo(server)
server.listen(3001, () => console.log("networksocial iniciado na porta 3001"))