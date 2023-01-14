import Email from "../../Email/Email.entity"
import Friendship from "../../Friendship/Friendship.entity"
import User from "../../User/User.entity"
import Profile from "../../Profile/Profile.entity"
import env from "dotenv"
import { resolve } from "path"
import { DataSource } from "typeorm"

env.config({ path: resolve("../", ".env") })

const AppDataSource = new DataSource({
	type: "mysql",
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: "socialnetwork",
	entities: [User, Friendship, Email, Profile],
	// url: "mysql://root:mysqlpw@localhost:55000", //DOCKER
	synchronize: true,
	cache: {
		type: "redis",
		options: {
			host: "localhost",
			port: 6379
		}
	}
})

AppDataSource.initialize()
	.then(() => {
		console.log("Data Source has been initialized!")
	})
	.catch((err) => {
		console.error("Error during Data Source initialization", err)
	})
export default AppDataSource
