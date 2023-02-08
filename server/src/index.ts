import { setIo } from "Providers/Websocket"
import "reflect-metadata"
import server from "./server"
import "Providers/Redis"

// await redisClient.connect()
setIo(server)
const PORT = process.env.PORT_SERVER || 3001
server.listen(PORT, () => console.log("networksocial iniciado na porta 3001"))