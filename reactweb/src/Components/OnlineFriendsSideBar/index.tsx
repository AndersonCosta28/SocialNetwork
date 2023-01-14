import React from "react"
import styles from "./OnlineFriendsSideBar.module.css"
import { BsPersonCircle, BsFillCircleFill } from "react-icons/bs"
import { useChat } from "../../Context/ChatContext"
import { getUserId } from "../../utils"
import { useProtected } from "../../Context/ProtectedContext"
import { IUserInfo, IUserSocket } from "common/Types/User"
import { useSocketIo } from "../../Context/SocketIoContext"

const OnlineFriendsSideBar = () => {
	const { allUsers } = useProtected()
	const { onlineUsers } = useSocketIo()
	const onlineUsersId = onlineUsers.map((onlineUser : IUserSocket) => onlineUser.UserId)
	const myFriendsOnline = allUsers.filter((user: IUserInfo) => onlineUsersId.includes(user.id))
	const { openChat } = useChat()
	return (
		<div id={styles.list}>
			<h3 className={styles.list__title}>Friends</h3>
			<ul>
				{myFriendsOnline
					.filter((value: IUserInfo) => Number(value.id) !== Number(getUserId()))
					.map((item: IUserInfo, index: number) => (
						<li className={styles.list__item} key={index + "-friendOnline"} onClick={() => openChat(item)}>
							<BsPersonCircle size={30} /> <span>{item.Nickname}</span>
							<BsFillCircleFill size={7} color={"green"} />
						</li>
					))}
			</ul>
		</div>
	)
}

export default OnlineFriendsSideBar
