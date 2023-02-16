import React from "react"
import styles from "./FriendsSideBar.module.css"
import { BsFillCircleFill } from "react-icons/bs"
import { useChat } from "Context/ChatContext"
import { IUserSocket } from "common/Types/User"
import { useSocketIo } from "Context/SocketIoContext"
import { useFriendship } from "Context/FriendshipContext"
import { IFriend, TypeOfFriendship, TypesOfApplicants } from "common"
import Avatar from "Components/Avatar"
import { useProtected } from "Context/ProtectedContext"

const OnlineFriendsSideBar = () => {
	enum Tab {
		FriendList,
		RequestList,
	}
	//#region External Hooks

	const { onlineUsers } = useSocketIo()
	const { openChatByFriend: openChat } = useChat()
	const { acceptFriendshipRequest, rejectFriendshipRequest, removeFriend, disableButton } = useFriendship()
	const { friendList } = useProtected()

	//#endregion

	//#region Internal hooks
	const [tab, setTab] = React.useState<Tab>(Tab.FriendList)
	//#endregion

	const onlineUsersId = onlineUsers.map((onlineUser: IUserSocket) => onlineUser.UserId)

	const OnlineFriends = (): JSX.Element => (
		<>
			{friendList
				.filter((item: IFriend) => item.Type === TypeOfFriendship.Friend)
				.map((item: IFriend) => ({ ...item, online: onlineUsersId.includes(item.FriendProfile.id) }))
				.sort((_, item2: IFriend & { online: boolean }) => (item2.online ? 1 : -1))
				.map((item: IFriend & { online: boolean }, index: number) => (
					<li style={{ display: tab === Tab.FriendList ? "flex" : "none" }} className={styles.list__item__online} key={index + "-friendOnline"} onClick={() => openChat(item)}>
						<Avatar size={30} base64={item.FriendProfile.AvatarBase64} type={item.FriendProfile.AvatarType} key={item.FriendProfile.AvatarId + "-" + item.FriendProfile.Nickname + "-Avatar"} />
						<span>{item.FriendProfile.Nickname}</span>
						{item.online && <BsFillCircleFill size={7} color={"green"} />}
					</li>
				))}
		</>
	)

	const RequestFriendship = (): JSX.Element => (
		<>
			{friendList
				.filter((item: IFriend) => item.Type === TypeOfFriendship.Requested)
				.map((item: IFriend, index: number) => (
					<li style={{ display: tab === Tab.RequestList ? "flex" : "none" }} className={styles.list__item__request} key={index + "-friendRequest"}>
						<div className="flex_column_center_center">
							<Avatar size={50} base64={item.FriendProfile.AvatarBase64} type={item.FriendProfile.AvatarType} key={item.FriendProfile.AvatarId + "-" + item.FriendProfile.Nickname + "-Avatar"} />
							<span>{item.FriendProfile.Nickname}</span>
						</div>
						{item.WhoRequested === TypesOfApplicants.Other && (
							<div className="flex_row_center_center">
								<input type="button" value="Accepts" className={`${disableButton ? "blueButtonDisable" : "blueButtonActive"}`} onClick={() => acceptFriendshipRequest(item.FriendshipId)} />
								<input type="button" value="Delete" className={`${disableButton ? "blueButtonDisable" : "blueButtonActive"}`} onClick={() => rejectFriendshipRequest(item.FriendshipId)} />
							</div>
						)}
						{item.WhoRequested === TypesOfApplicants.Me && (
							<div className="flex_row_center_center">
								<input type="button" value="Cancel" className={`${disableButton ? "blueButtonDisable" : "blueButtonActive"}`} onClick={() => removeFriend(item.FriendshipId)} />
							</div>
						)}
					</li>
				))}
		</>
	)

	return (
		<div id={styles.list}>
			<div className={styles.list__header}>
				<h3 className={`${tab === Tab.FriendList ? styles.title__active : ""}`} onClick={() => setTab(Tab.FriendList)}>
					Friends
				</h3>
				<h3 className={`${tab === Tab.RequestList ? styles.title__active : ""}`} onClick={() => setTab(Tab.RequestList)}>
					Request
				</h3>
			</div>
			<ul>
				<OnlineFriends />
				<RequestFriendship />
			</ul>
		</div>
	)
}

export default OnlineFriendsSideBar
