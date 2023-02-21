import Email from "Email/Email.entity"
import Friendship from "Friendship/Friendship.entity"
import User from "User/User.entity"
import Profile from "Profile/Profile.entity"
import Message from "Message/Message.entity"
import { DataSource } from "typeorm"
import Files from "Files/Files.entity"
import Post from "Post/Post.entity"
import { getErrorMessage } from "common"
import PostReactions from "PostReactions/PostReactions.entity"
import PostComments from "PostComments/PostComments.entity"

const AppDataSource = new DataSource({
	type: "mysql",
	host: process.env.DATABASE_HOST,
	port: Number(process.env.DATABASE_PORT),
	username: process.env.DATABASE_USERNAME,
	password: process.env.DATABASE_PASSWORD,
	database: "socialnetwork",
	entities: [User, Friendship, Email, Profile, Message, Files, Post, PostReactions, PostComments],
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
		console.error("Error during Data Source initialization", getErrorMessage(err))
	})
export default AppDataSource
