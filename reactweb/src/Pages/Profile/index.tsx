import React from "react"
import { RouteObject, useParams } from "react-router-dom"
import { BiMessageDetail } from "react-icons/bi"
import { RiMapPin2Line, RiPencilLine } from "react-icons/ri"
import { IProfileInfo } from "common/Types/User"
import styles from "./Profile.module.css"
import { getUserId } from "utils"
import { useChat } from "Context/ChatContext"
import { useFriendship } from "Context/FriendshipContext"
import InteractWithTheProfile from "Components/InteractWithTheProfile"
import { API_AXIOS } from "Providers/axios"
import { getAxiosErrorMessage, getErrorMessage, IFriend, TypeOfFriendship } from "common"
import { toast } from "react-hot-toast"
import { Buffer } from "buffer"
import Avatar from "Components/Avatar"
import { useProtected } from "Context/ProtectedContext"

const Profile = () => {
	const { nickname } = useParams()

	//#region Internal Hooks
	const [profile, setProfile] = React.useState<IProfileInfo>({
		Avatar: null,
		AvatarBase64: "",
		AvatarId: 0,
		AvatarType: "",
		Description: "",
		id: 0,
		Local: "",
		Nickname: "",
	})
	const [isEdit, setIsEdit] = React.useState<boolean>(false)
	const [isPreview, setIsPreview] = React.useState<boolean>(false)
	const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
	const [friends, setFriends] = React.useState<IFriend[]>([])

	React.useEffect(() => {
		const requestApi = async () => {
			try {
				const requestUser = await API_AXIOS.get("/profile/findOneByNickname/" + nickname)
				const profile = requestUser.data

				profile.AvatarId = profile.Avatar.id
				profile.AvatarBase64 = profile.Avatar.buffer ? Buffer.from(profile.Avatar.buffer).toString("base64") : ""
				const requestFriends = await API_AXIOS.post("/friendship", { UserId: profile.id })
				const friends = requestFriends.data
				setProfile(profile)
				setFriends(friends)
			}
			catch (error) {
				throw new Error(getErrorMessage(error))
			}
		}

		requestApi()
	}, [nickname])

	//#endregion
	//#region External Hooks
	const { disableButton } = useFriendship()
	const { myProfile } = useProtected()
	const { openChatByFriend: openChat } = useChat()
	//#endregion
	//#region Functions
	let friendShip: IFriend
	const getFriendShip = (): IFriend | undefined => {
		const friendShipTemp: IFriend | undefined = friends.find((friend) => friend.FriendProfile.id === profile?.id && friend.Type === TypeOfFriendship.Friend)
		if (friendShipTemp) friendShip = friendShipTemp
		return friendShipTemp
	}

	const handlerIsEdit = () => setIsEdit(!isEdit)

	const onSaveProfile = () => {
		API_AXIOS.put("/profile/" + profile.id, {
			Description: profile.Description,
			Local: profile.Local,
		})
			.then((res) => {
				console.log(res)
				handlerIsEdit()
			})
			.catch(console.log)
	}

	const handlerAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target
		if (files === null) {
			toast.error("Nothing file selected")
			return
		}
		setAvatarFile(files[0])
		setIsPreview(true)
	}

	const sendAvatar = async () => {
		if (!avatarFile) {
			toast.error("The avatar imagem was not loaded")
			return
		}
		const formData = new FormData()
		formData.append("avatar", avatarFile)
		try {
			await API_AXIOS({ url: "/files/changeAvatar/" + profile.AvatarId, method: "post", headers: { "Content-Type": "multipart/form-data" }, data: formData })
			const __profile = profile
			__profile.AvatarBase64 = Buffer.from(await avatarFile.arrayBuffer()).toString("base64")
			setProfile(__profile)
			setIsPreview(false)
		}
		catch (error) {
			toast.error(getAxiosErrorMessage(error))
		}
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
		profile.id === getUserId() || !profile ? null : (
			<div id={styles.container__bottom} className="flex_row_center_center">
				<Message />
				<div className={`${disableButton ? "blueButtonDisable" : "blueButtonActive"}`}>
					<InteractWithTheProfile FriendId={profile.id} FriendNickname={profile.Nickname} />
				</div>
			</div>
		)

	const EditSaveButtons = () =>
		profile.id === getUserId() ? (
			isEdit && !isPreview ? (
				<input type="button" value="Save" className={`blueButtonActive ${styles.button__editANDsave}`} onClick={onSaveProfile} />
			) : (
				<input type="button" value="Edit" className={`blueButtonActive ${styles.button__editANDsave}`} onClick={handlerIsEdit} />
			)
		) : null

	const Nickname = () => {
		const handlerNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
			const _user = profile
			_user.Nickname = e.target.value
			setProfile(_user)
		}
		return isEdit ? (
			<div className={`flex_row_center_center ${styles.fieldEdit}`}>
				<input type={"text"} id={styles.container__top__name} defaultValue={profile.Nickname} onChange={handlerNickname} />
				<RiPencilLine />
			</div>
		) : (
			<span id={styles.container__top__name}>{profile.Nickname}</span>
		)
	}

	const Description = () => {
		const handlerDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
			const _user = profile
			_user.Description = e.target.value
			setProfile(_user)
		}

		return isEdit ? (
			<div className={`flex_row_center_center ${styles.fieldEdit}`}>
				<input type={"text"} id={styles.container__mid__description} defaultValue={profile.Description ? profile.Description : ""} placeholder="No description provided" onChange={handlerDescription} />
				<RiPencilLine />
			</div>
		) : (
			<span id={styles.container__mid__description}>{profile.Description ? profile.Description : "No description provided"}</span>
		)
	}

	const _Avatar = React.useCallback(
		() => (
			<div id={styles.avatar}>
				{profile.id === myProfile.id ? (
					<>
						<label htmlFor={styles.avatar__input} id={styles.avatar__pen}>
							<RiPencilLine />
						</label>
						<input type="file" name="avatar__input" id={styles.avatar__input} onChange={handlerAvatar} />
					</>
				) : null}
				<Avatar size={150} base64={profile.AvatarBase64} type={profile.AvatarType} />
			</div>
		), [profile]
	)

	const PreviewAvatar = React.useCallback(
		() =>
			isPreview ? (
				<div className="shadow_white" id={styles.previewImage} key={"PreviewAvatar" + Math.random()}>
					<img id={styles.previewImage__img} src={URL.createObjectURL(avatarFile as File)} alt="Profile_Photo_Preview" />
					<div id={styles.previewImage__buttons}>
						<input type="button" value="Confirm" className="blueButtonActive" onClick={() => sendAvatar()} />
						<input type="button" value="Cancel" className="blueButtonActive" onClick={() => setIsPreview(false)} />
					</div>
				</div>
			) : null, [isPreview]
	)

	//#endregion

	return (
		<div id={styles.page} className="flex_column_center_center">
			<PreviewAvatar />
			<EditSaveButtons />
			<div id={styles.container} className="flex_column_center_center shadow_white">
				<_Avatar key={"Avatar" + Math.random()} />
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
}
