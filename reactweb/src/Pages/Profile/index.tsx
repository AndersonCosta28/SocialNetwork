import React from "react"
import { RouteObject, useParams } from "react-router-dom"
import styles from "./Profile.module.css"
import { BsPersonCircle } from "react-icons/bs"
import { useProtected } from "../../Context/ProtectedContext"
import { IUserInfo } from "common/Types/User"
import { getNickname } from "../../utils"
import { useChat } from "../../Context/ChatContext"
import { BiMessageDetail } from "react-icons/bi"
import { useFriendship } from "../../Context/FriendshipContext"
import InteractWithTheProfile from "../../Components/InteractWithTheProfile"
import { API_AXIOS } from "../../Providers/axios"
import { toast } from "react-hot-toast"
import { IFriend } from "common"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const Profile = () => {

	//#region Internal Hooks
	const { allUsers } = useProtected()
	const { friendList, disableButton } = useFriendship()
	const { openChat } = useChat()
	
	//#endregion
	//#region Internal Hooks
	const nicknameFromUrl = useParams() as { nickname: string }
	const [user, setUser] = React.useState<IUserInfo | undefined>(undefined)
	const [showError, setShowError] = React.useState<boolean>(false)
	const [friendsNumber, setFriendsNumber] = React.useState<number>()

	//#endregion
	React.useEffect(() => {
		setUser(allUsers.find((user) => user.Nickname.toLowerCase() === nicknameFromUrl.nickname.toLowerCase()))
		const _user = allUsers.find((user) => user.Nickname.toLowerCase() === nicknameFromUrl.nickname.toLowerCase())

		if (nicknameFromUrl.nickname === getNickname()?.toLowerCase()) {
			setFriendsNumber(friendList.length)
			setUser(_user)			
		}
		else if (!_user) {
			setFriendsNumber(0)
			setShowError(true)
		}
		else
			API_AXIOS.post("/friendship", { UserId: _user.id })
				.then((res) => {
					const data = res.data as IFriend[]
					setFriendsNumber(data.length)
					setUser(_user)
					setShowError(false)
				})
				.catch((error) => {
					toast.error(error)
					setFriendsNumber(0)
					setShowError(true)
				})
	}, [allUsers])

	const UserProfile = React.useMemo(() => {
		if (!user && !showError) return <Skeleton count={10} />
		else if (!user && showError) return <h1>Profile Not Found</h1>
		else if (user && !showError)
			return (
				<div id={styles.page} className="flex_column_center_center">
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
									<span>{friendsNumber}</span>
								</div>
							</div>
						</div>
						{nicknameFromUrl.nickname === getNickname()?.toLowerCase() ? null : (
							<div id={styles.container__bottom} className="flex_row_center_center">
								<div className="blueButtonActive">
									<BiMessageDetail size={30} onClick={() => openChat(user)} />
								</div>
								<div className={`${disableButton ? "blueButtonDisable" : "blueButtonActive"}`}>
									<InteractWithTheProfile FriendId={user.id} FriendNickname={user.Nickname} />
								</div>
							</div>
						)}
					</div>
				</div>
			)
		else return <><h1>{`${!!user} ${showError}`}</h1></>
	}, [showError, user])

	return <> {UserProfile}</>
}

export default Profile

export const ProfileRoute: RouteObject = {
	element: <Profile />,
	path: "/profile/:nickname",
}
