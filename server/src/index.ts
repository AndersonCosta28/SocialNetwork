import moduleAlias from "module-alias"
import { WebSocket } from "./Providers/Websocket"
moduleAlias.addAliases({
	"@Types": "./Types",
	"@Providers": "./Providers"
})
import "reflect-metadata"
import server from "./server"
import redisClient from "./Providers/Redis"

await redisClient.connect()
WebSocket(server)
server.listen(3001, () => console.log("networksocial iniciado na porta 3001"))