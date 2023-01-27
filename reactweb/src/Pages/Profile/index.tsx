import React from "react"
import { LoaderFunctionArgs, RouteObject, useLoaderData } from "react-router-dom"
import styles from "./Profile.module.css"
import { BsPersonCircle } from "react-icons/bs"
import { IUserInfo } from "common/Types/User"
import { getUserId } from "../../utils"
import { useChat } from "../../Context/ChatContext"
import { useFriendship } from "../../Context/FriendshipContext"
import InteractWithTheProfile from "../../Components/InteractWithTheProfile"
import { BiMessageDetail } from "react-icons/bi"
import { API_AXIOS } from "../../Providers/axios"
import { RiMapPin2Line } from "react-icons/ri"
import { getErrorMessage, IFriend, TypeOfFriendship } from "common"

const Profile = () => {
	//#region Functions
	let friendShip: IFriend
	const getFriendShip = (): IFriend | undefined => {
		const friendShipTemp: IFriend | undefined = friendList.find((friend) => friend.FriendId === user?.id && friend.Type === TypeOfFriendship.Friend)
		if (friendShipTemp) friendShip = friendShipTemp
		return friendShipTemp
	}

	const handlerIsEdit = () => setIsEdit(!isEdit)

	const onSaveProfile = () => {
		API_AXIOS.post("/profile/" + user.id)
			.then(res => {
				console.log(res)
				handlerIsEdit()
			})
			.catch(console.log)
	}

	//#endregion
	//#region Components
	const Message = () =>
		getFriendShip() ? (
			<div className="blueButtonActive">
				<BiMessageDetail size={30} onClick={() => openChat(friendShip)} />
			</div>
		) : null

	const SocialButtons = () =>
		user.id === getUserId() || !user ? null : (
			<div id={styles.container__bottom} className="flex_row_center_center">
				<Message />
				<div className={`${disableButton ? "blueButtonDisable" : "blueButtonActive"}`}>
					<InteractWithTheProfile FriendId={user.id} FriendNickname={user.Nickname} />
				</div>
			</div>
		)

	const EditSaveButtons = () =>
		user.id === getUserId() ? (
			isEdit ? (
				<input type="button" value="Save" className={`blueButtonActive ${styles.button__editANDsave}`} onClick={handlerIsEdit} />
			) : (
				<input type="button" value="Edit" className={`blueButtonActive ${styles.button__editANDsave}`} onClick={onSaveProfile} />
			)
		) : null

	const Nickname = () =>
		isEdit ? (
			<input type={"text"} id={styles.container__top__name} className={styles.input__edit} value={user.Nickname} onChange={(e) => setUser((prev) => ({ ...prev, Nickname: e.target.value }))} />
		) : (
			<span id={styles.container__top__name}>{user.Nickname}</span>
		)

	const Description = () =>
		isEdit ? (
			<input type={"text"} id={styles.container__mid__description} className={styles.input__edit} value={user.Profile.Description} onChange={(e) => setUser((prev) => ({ ...prev, Profile: { ...prev.Profile, Description: e.target.value } }))} />
		) : (
			<span id={styles.container__mid__description}>{user.Profile.Description}</span>
		)

	//#endregion

	//#region Internal Hooks
	const [isEdit, setIsEdit] = React.useState<boolean>(false)
	const { user: _user, friends } = useLoaderData() as { user: IUserInfo; friends: IFriend[] }
	const [user, setUser] = React.useState(_user)
	//#endregion
	//#region External Hooks
	const { friendList, disableButton } = useFriendship()
	const { openChatByFriend: openChat } = useChat()
	//#endregion

	return (
		<div id={styles.page} className="flex_column_center_center">
			<BsPersonCircle size={150} id={styles.photo} />
			<EditSaveButtons />
			<div id={styles.container} className="flex_column_center_center shadow_white">
				<div id={styles.container__top}>
					<Nickname />
					<div className="flex_row_center_center">
						<RiMapPin2Line size={20} />
						<span>Brazil, Bahia</span>
					</div>
				</div>
				<div id={styles.container__mid}>
					<Description />
					<div id={styles.container__mid__info} className="flex_row_center_center">
						<div className={styles.container__mid__info__div}>
							<span className={styles.container__mid__info__div__number}>{friends.length}</span>
							<span className={styles.container__mid__info__div__tag}>Friends</span>
						</div>
					</div>
				</div>
				<SocialButtons />
			</div>
		</div>
	)
}

export default Profile

export const ProfileRoute: RouteObject = {
	element: <Profile />,
	path: "/profile/:nickname",
	loader: async (args: LoaderFunctionArgs) => {
		try {
			const { nickname } = args.params
			const requestUser = await API_AXIOS.get("/user/findOneByName/" + nickname)
			const user = requestUser.data
			console.log(user)
			const requestFriends = await API_AXIOS.post("/friendship", { UserId: user.id })
			const friends = requestFriends.data
			return { user: user, friends: friends }
		}
		catch (error) {
			throw new Error(getErrorMessage(error))
		}
	},
}
