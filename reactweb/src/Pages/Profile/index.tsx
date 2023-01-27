import React from "react"
import { LoaderFunctionArgs, RouteObject, useLoaderData } from "react-router-dom"
import { BiMessageDetail } from "react-icons/bi"
import { RiMapPin2Line, RiPencilLine } from "react-icons/ri"
import { BsPersonCircle } from "react-icons/bs"
import { IUserInfo } from "common/Types/User"
import styles from "./Profile.module.css"
import { getUserId } from "utils"
import { useChat } from "Context/ChatContext"
import { useFriendship } from "Context/FriendshipContext"
import InteractWithTheProfile from "Components/InteractWithTheProfile"
import { API_AXIOS } from "Providers/axios"
import { getErrorMessage, IFriend, TypeOfFriendship } from "common"
import { toast } from "react-hot-toast"

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
			.then((res) => {
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
				<input type="button" value="Save" className={`blueButtonActive ${styles.button__editANDsave}`} onClick={onSaveProfile} />
			) : (
				<input type="button" value="Edit" className={`blueButtonActive ${styles.button__editANDsave}`} onClick={handlerIsEdit} />
			)
		) : null

	const Nickname = () => {
		const handlerNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
			const _user = user
			_user.Nickname = e.target.value
			setUser(_user)
		}
		return isEdit ? (
			<div className={`flex_row_center_center ${styles.fieldEdit}`}>
				<input type={"text"} id={styles.container__top__name} defaultValue={user.Nickname} onChange={handlerNickname} />
				<RiPencilLine />
			</div>
		) : (
			<span id={styles.container__top__name}>{user.Nickname}</span>
		)
	}

	const Description = () => {
		const handlerDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
			const _user = user
			_user.Profile.Description = e.target.value
			setUser(_user)
		}

		return isEdit ? (
			<div className={`flex_row_center_center ${styles.fieldEdit}`}>
				<input type={"text"} id={styles.container__mid__description} defaultValue={user.Profile.Description} onChange={handlerDescription} />
				<RiPencilLine />
			</div>
		) : (
			<span id={styles.container__mid__description}>{user.Profile.Description}</span>
		)
	}

	const Photo = () => {
		const handlerPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
			const { files } = e.target
			if (files === null) {
				toast.error("Nothing file selected")
				return
			}
			const formData = new FormData()			
			formData.append("avatar", files[0])
			console.log(formData)
			API_AXIOS.post("/profile/editPhoto/" + user.id, {
				data: formData,
				headers: { "Content-Type": "multipart/form-data" },
			  })
				.then(function (response) {
				  //handle success
				  console.log(response)
				})
				.catch(function (response) {
				  //handle error
				  console.log(response)
				})
			// const _user = user
			// const file: File | null = files[0]
			// _user.Profile.Photo = file
			// setUser(user)
		}

		return (
			<div id={styles.photo}>
				{isEdit ? (
					<>
						<label htmlFor={styles.photo__input} id={styles.photo__pen}>
							<RiPencilLine />
						</label>
						<input type="file" name="photo__input" id={styles.photo__input} onChange={handlerPhoto} />
					</>
				) : null}
				{user.Profile.Photo ? <img id={styles.photo__img} src={`data:image/png;base64, ${user.Profile.Photo}`} alt="photo_profile" /> : <BsPersonCircle size={150} />}
			</div>
		)
	}

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
			<EditSaveButtons />
			<div id={styles.container} className="flex_column_center_center shadow_white">
				<Photo />
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
