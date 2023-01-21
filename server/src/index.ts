import moduleAlias from "module-alias"
moduleAlias.addAliases({
	"@Types": "./Types",
	"@Providers": "./Providers"
})
import { setIo } from "./Providers/Websocket"
import "reflect-metadata"
import server from "./server"
import redisClient from "./Providers/Redis"

await redisClient.connect()
setIo(server)
server.listen(3001, () => console.log("networksocial iniciado na porta 3001"))