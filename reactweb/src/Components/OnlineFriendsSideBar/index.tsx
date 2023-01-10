import React from "react"
import styles from "./OnlineFriendsSideBar.module.css"
import { BsPersonCircle, BsFillCircleFill } from "react-icons/bs"
import { ISocketUser, useSocketIo } from "../../Context/SocketIoContext"
import { useChat } from "../../Context/ChatContext"
import { getUserId } from "../../utils"

const OnlineFriendsSideBar = () => {
	const { onlineUsers } = useSocketIo()
	const { openChat } = useChat()
	console.log(onlineUsers)
	return (
		<div id={styles.list}>
			<h3 className={styles.list__title}>Friends</h3>
			<ul>
				{onlineUsers
					.filter((value: ISocketUser) => value.UserId !== getUserId())
					.map((item: ISocketUser, index: number) => (
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
