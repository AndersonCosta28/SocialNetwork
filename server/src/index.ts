import moduleAlias from "module-alias"
moduleAlias.addAliases({
	"@Types": "./Types"
})
import "reflect-metadata"
import server from "./server"

server.listen(3001, () => console.log("networksocial iniciado na porta 3001"))