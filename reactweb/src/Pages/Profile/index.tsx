import React from "react"
import { LoaderFunctionArgs, RouteObject, useLoaderData } from "react-router-dom"
import styles from "./Profile.module.css"
import { BsPersonCircle } from "react-icons/bs"
import { IUserInfo } from "common/Types/User"
import { getUserId } from "../../utils"
import { useChat } from "../../Context/ChatContext"
import { BiMessageDetail } from "react-icons/bi"
import { useFriendship } from "../../Context/FriendshipContext"
import InteractWithTheProfile from "../../Components/InteractWithTheProfile"
import { API_AXIOS } from "../../Providers/axios"
import { getErrorMessage, IFriend, TypeOfFriendship } from "common"

const Profile = () => {
	const { user, friends } = useLoaderData() as { user: IUserInfo, friends: IFriend[] }
	
	//#region Functions
	let friendShip: IFriend
	const getFriendShip = (): IFriend | undefined => {
		const friendShipTemp: IFriend | undefined = friendList.find((friend) => friend.FriendId === user?.id && friend.Type === TypeOfFriendship.Friend)
		if (friendShipTemp) friendShip = friendShipTemp
		return friendShipTemp
	}
	//#endregion
	//#region Components
	const Message = () =>
		getFriendShip() ? (
			<div className="blueButtonActive">
				<BiMessageDetail size={30} onClick={() => openChat(friendShip)} />
			</div>
		) : null

	const Buttons = () =>
		user.id === getUserId() || !user ? null : (
			<div id={styles.container__bottom} className="flex_row_center_center">
				<Message />
				<div className={`${disableButton ? "blueButtonDisable" : "blueButtonActive"}`}>
					<InteractWithTheProfile FriendId={user.id} FriendNickname={user.Nickname} />
				</div>
			</div>
		)

	//#endregion

	//#region External Hooks
	const { friendList, disableButton } = useFriendship()
	const { openChatByFriend: openChat } = useChat()
	//#endregion

	return <div id={styles.page}>
		<div className="flex_column_center_center">
			<div id={styles.container} className="flex_column_center_center">
				<div id={styles.container__top}>
					<BsPersonCircle size={150} />
					<span id={styles.container__top__span__name}>{user?.Nickname}</span>
					<span id={styles.container__top__span__description}>{user?.Profile.Description}</span>
				</div>
				<div id={styles.container__mid}>
					<span id={styles.container__mid__mid__span__aboutMe}>
								Lorem ipsum dolor sit amet, consectetur adipisicing elit. Provident inventore excepturi nisi harum libero dolor reiciendis sint nostrum, corporis quo molestiae dolorum. Non veniam quam quae! Fugiat aliquid voluptates
								iusto!
					</span>
					<div id={styles.container__mid__info} className="flex_row_center_center">
						<div className={styles.container__mid__info__div}>
							<span>Friends</span>
							<span>{friends.length}</span>
						</div>
					</div>
				</div>
				<Buttons />
			</div>
		</div>
	</div>
}

export default Profile

export const ProfileRoute: RouteObject = {
	element: <Profile />,
	path: "/profile/:nickname",
	loader: async (args: LoaderFunctionArgs) => {
		try {
			const { nickname } = args.params
			const request = await API_AXIOS.get("/user/findOneByName/" + nickname)
			const user = request.data
			const request2 = await API_AXIOS.post("/friendship", { UserId: user.id })
			const friends = request2.data
			console.log({ ...user, friends: friends }	)
			return { user: user, friends: friends }			
		}
		catch (error) {			
			throw new Error(getErrorMessage(error))
		}
	},
}
