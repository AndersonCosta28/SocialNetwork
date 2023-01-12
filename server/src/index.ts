import moduleAlias from "module-alias"
import { WebSocket } from "./Providers/Websocket"
moduleAlias.addAliases({
	"@Types": "./Types"
})
import "reflect-metadata"
import server from "./server"

WebSocket(server)
server.listen(3001, () => console.log("networksocial iniciado na porta 3001"))