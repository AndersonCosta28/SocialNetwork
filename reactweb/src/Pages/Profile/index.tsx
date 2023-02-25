import React from "react"
import { RouteObject, useParams } from "react-router-dom"
import { BiMessageDetail } from "react-icons/bi"
import { RiMapPin2Line, RiPencilLine } from "react-icons/ri"
import { IProfile } from "common/Types/User"
import styles from "./Profile.module.css"
import { getUserId } from "utils"
import { useChat } from "Context/ChatContext"
import { useFriendship } from "Context/FriendshipContext"
import InteractWithTheProfile from "Components/InteractWithTheProfile"
import { API_AXIOS } from "Providers/axios"
import { IFiles, getAxiosErrorMessage, IFriend, TypeOfFriendship, IPost } from "common"
import { toast } from "react-hot-toast"
import { Buffer } from "buffer"
import Avatar from "Components/Avatar"
import { useProtected } from "Context/ProtectedContext"
import TagInfo from "Components/TagInfo"
import { useSocketIo } from "Context/SocketIoContext"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { profileDefault } from "consts"

const Profile = () => {
	//#region External Hooks
	const { nickname } = useParams()
	const { disableButton } = useFriendship()
	const { myProfile, requestToUpdateMyProfile } = useProtected()
	const { openChatByFriend: openChat } = useChat()
	const { socketId } = useSocketIo()
	//#endregion
	//#region Internal Hooks

	const [isEdit, setIsEdit] = React.useState<boolean>(false)
	const [isPreview, setIsPreview] = React.useState<boolean>(false)
	const [avatarFile, setAvatarFile] = React.useState<File | null>(null)
	const [friends, setFriends] = React.useState<IFriend[]>([])
	const [posts, setPosts] = React.useState<IPost[]>([])
	const [profile, setProfile] = React.useState<IProfile>(profileDefault)

	//#region Request To API
	// The queries 2 and 3, look at on devtools, are perform when we are leave from page
	// so then we using use React.useEffect below
	/*
	useQueries({
		queries: [
			{
				queryKey: ["profile", nickname, socketId],
				queryFn: () => API_AXIOS.get<IProfile>("/profile/findOneByNickname/" + nickname).then((res) => res.data),
				enabled: profile.id === 0 && !!socketId,
				onSuccess: (data: IProfile) => {
					console.log("Executou 1")
					setProfile(data)
				},
				onError: (error: unknown) => toast.error(getAxiosErrorMessage(error)),
			},
			{
				queryKey: ["friends", nickname, socketId, profile.id],
				queryFn: () => API_AXIOS.post<IFriend[]>("/friendship", { UserId: profile.id }).then((res) => res.data),
				enabled: profile.id !== 0 && !!socketId,
				onSuccess: (data: IFriend[]) => {
					console.log("Executou 2")
					setFriends(data)
				},
				onError: (error: unknown) => toast.error(getAxiosErrorMessage(error)),
			},
			{
				queryKey: ["posts", nickname, socketId, profile.id],
				queryFn: () => API_AXIOS.get<IPost[]>("/post/findAllByIdProfile/" + profile.id).then((res) => res.data),
				enabled: profile.id !== 0 && !!socketId,
				onSuccess: (data: IPost[]) => {
					console.log("Executou 3")
					React.startTransition(() => {
						setPosts(data)
					})
				},
				onError: (error: unknown) => toast.error(getAxiosErrorMessage(error)),
				cacheTime: 0,
			},
		],
	})
	*/
	React.useEffect(() => {
		if (socketId) {
			if (profile.id === 0) {
				console.log("Executando 1")
				API_AXIOS.get<IProfile>("/profile/findOneByNickname/" + nickname)
					.then((res) => setProfile(res.data))
					.catch((error) => toast.error(getAxiosErrorMessage(error)))
			}

			if (profile.id !== 0) {
				console.log("Executando 2")
				API_AXIOS.post<IFriend[]>("/friendship", { UserId: profile.id })
					.then((res) => setFriends(res.data))
					.catch((error) => toast.error(getAxiosErrorMessage(error)))
				API_AXIOS.get<IPost[]>("/post/findAllByIdProfile/" + profile.id)
					.then((res) => setPosts(res.data))
					.catch((error) => toast.error(getAxiosErrorMessage(error)))
			}
		}
		return () => {
			console.log("EXECUTANDO 3")
			// setPosts([])
			// setFriends([])
			// setProfile(profileDefault)
		}
	}, [socketId, profile])
	//#endregion
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
			.then(() => {
				handlerIsEdit()
				requestToUpdateMyProfile()
			})
			.catch((error) => {
				toast.error(getAxiosErrorMessage(error))
			})
	}

	const handlerAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target
		if (files === null) {
			toast.error("Nothing file selected")
			return
		}
		if (files[0].size > 1000000) {
			toast.error("The maximum file size is 1MB")
			setIsPreview(false)
		}
		else {
			setAvatarFile(files[0])
			setIsPreview(true)
		}
	}

	const handlerDescription = (e: React.ChangeEvent<HTMLInputElement>) => {
		const _user = profile
		_user.Description = e.target.value
		setProfile(_user)
	}

	const sendAvatar = async () => {
		if (!avatarFile) {
			toast.error("The avatar imagem was not loaded")
			return
		}
		const formData = new FormData()
		formData.append("avatar", avatarFile)
		try {
			await API_AXIOS({ url: "/files/changeAvatar/" + (profile.Avatar as IFiles).id, method: "post", headers: { "Content-Type": "multipart/form-data" }, data: formData })
			const __profile = profile
			__profile.Avatar = __profile.Avatar as IFiles
			__profile.Avatar.base64 = Buffer.from(await avatarFile.arrayBuffer()).toString("base64")
			setProfile(__profile)
			setIsPreview(false)
			requestToUpdateMyProfile()
		}
		catch (error) {
			toast.error(getAxiosErrorMessage(error))
		}
	}

	//#endregion
	//#region Components
	const Message = getFriendShip() ? (
		<div className="blueButtonActive">
			<BiMessageDetail size={30} onClick={() => openChat(friendShip)} />
		</div>
	) : null

	const SocialButtons =
		profile.id !== getUserId() && profile.id !== 0 ? (
			<div id={styles.container__bottom} className="flex_row_center_center">
				{Message}
				<div className={`${disableButton ? "blueButtonDisable" : "blueButtonActive"}`}>
					<InteractWithTheProfile FriendId={profile.id} FriendNickname={profile.Nickname} />
				</div>
			</div>
		) : null

	const EditSaveButtons =
		profile.id === getUserId() ? (
			isEdit && !isPreview ? (
				<input type="button" value="Save" className={`blueButtonActive ${styles.button__editANDsave}`} onClick={onSaveProfile} />
			) : (
				<input type="button" value="Edit" className={`blueButtonActive ${styles.button__editANDsave}`} onClick={handlerIsEdit} />
			)
		) : null

	// eslint-disable-next-line arrow-body-style
	const Nickname = <span id={styles.container__top__name}>{profile.Nickname}</span>
	// const handlerNickname = (e: React.ChangeEvent<HTMLInputElement>) => {
	// 	const _user = profile
	// 	_user.Nickname = e.target.value
	// 	setProfile(_user)
	// }
	// return isEdit ? (
	// 	<div className={`flex_row_center_center ${styles.fieldEdit}`}>
	// 		<input type={"text"} id={styles.container__top__name} defaultValue={profile.Nickname} onChange={handlerNickname} />
	// 		<RiPencilLine />
	// 	</div>
	// ) : (
	// 	<span id={styles.container__top__name}>{profile.Nickname}</span>
	// )

	const Description = isEdit ? (
		<div className={`flex_row_center_center ${styles.fieldEdit}`}>
			<input type={"text"} id={styles.container__mid__description} defaultValue={profile.Description ? profile.Description : ""} placeholder="No description provided" onChange={handlerDescription} />
			<RiPencilLine />
		</div>
	) : (
		<span id={styles.container__mid__description}>{profile.Description ? profile.Description : "No description provided"}</span>
	)

	const _Avatar = (
		<div id={styles.avatar}>
			{profile.id === myProfile.id && !isEdit ? (
				<div>
					<label htmlFor={styles.avatar__input} id={styles.avatar__pen}>
						<RiPencilLine />
					</label>
					<input type="file" id={styles.avatar__input} onChange={handlerAvatar} accept="image/*" />
				</div>
			) : null}
			{profile.Avatar === null ? <Skeleton circle={true} count={1} style={{ height: 150, width: 150, zIndex: 4 }} /> : <Avatar size={150} base64={(profile.Avatar as IFiles).base64} type={(profile.Avatar as IFiles).type} />}
		</div>
	)

	const PreviewAvatar = isPreview ? (
		<div className="shadow_white" id={styles.previewImage}>
			<div className="flex_row_center_center" id={styles.previewImage__div}>
				<img id={styles.previewImage__img} src={URL.createObjectURL(avatarFile as File)} alt="Profile_Photo_Preview" />
			</div>
			<div id={styles.previewImage__buttons}>
				<input type="button" value="Confirm" className="blueButtonActive" onClick={() => sendAvatar()} />
				<input type="button" value="Cancel" className="blueButtonActive" onClick={() => setIsPreview(false)} />
			</div>
		</div>
	) : null

	//#endregion

	return (
		<div id={styles.page} className="flex_column_center_center">
			{PreviewAvatar}
			{EditSaveButtons}
			<div id={styles.container} className="flex_column_center_center shadow_white">
				{_Avatar}
				<div id={styles.container__top}>
					{Nickname}
					<div className="flex_row_center_center">
						<RiMapPin2Line size={20} />
						<span>Brazil, Bahia</span>
					</div>
				</div>
				<div id={styles.container__mid}>
					{Description}
					<div id="container__tag__info" className="flex_row_center_center">
						<TagInfo number={friends.length} title="Friends" />
						<TagInfo number={posts.length} title="Posts" />
					</div>
				</div>
				{SocialButtons}
			</div>
		</div>
	)
}

export default Profile

export const ProfileRoute: RouteObject = {
	element: <Profile />,
	path: "/profile/:nickname",
}

