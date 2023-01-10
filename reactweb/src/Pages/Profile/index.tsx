import React from "react"
import { LoaderFunctionArgs, RouteObject, useLoaderData } from "react-router-dom"
import styles from "./Profile.module.css"
import { BsPersonCircle } from "react-icons/bs"
import { useProtected } from "../../Context/ProtectedContext"
import { IUserInfo } from "common/Types/User"
import { getNickname, getUserId } from "../../utils"
import { useChat } from "../../Context/ChatContext"
import { BsFillPersonPlusFill, BsFillPersonCheckFill, BsFillPersonDashFill } from "react-icons/bs"
import { BiMessageDetail } from "react-icons/bi"
import { useFriendship } from "../../Context/FriendshipContext"
import { TypeOfFriendship } from "common"

const Profile = () => {
	const loaderData = useLoaderData() as { nickname: string }
	const { allUsers } = useProtected()
	const { openChat } = useChat()
	const { friendList, addFriend, removeFriend, disableButton } = useFriendship()
	const user: IUserInfo | undefined = allUsers.find((user) => user.Nickname.toLowerCase() === loaderData.nickname.toLowerCase())
	const friend = friendList.find((friend) => friend.FriendId === user?.id)

	const UserProfile = () => {
		if (!user) return <h1>Profile Not Found</h1>
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
								<span>Number</span>
							</div>
						</div>
					</div>
					{loaderData.nickname === getNickname()?.toLowerCase() ? null : (
						<div id={styles.container__bottom} className="flex_row_center_center">
							<div className="blueButtonActive">
								<BiMessageDetail size={30} onClick={() => openChat(user)} />
							</div>
							<div className={`${disableButton ? "blueButtonDisable" : "blueButtonActive"}`}>
								{friend?.Type === TypeOfFriendship.Removed || !friend ? <BsFillPersonPlusFill size={30} onClick={() => disableButton ? null : addFriend(Number(getUserId()), user.Nickname)} /> : null}
								{friend?.Type === TypeOfFriendship.Friend ? <BsFillPersonDashFill size={30} onClick={() => disableButton ? null : removeFriend(friend.FriendshipId)} /> : null}
								{friend?.Type === TypeOfFriendship.Requested ? <BsFillPersonCheckFill size={30} onClick={() => disableButton ? null : removeFriend(friend.FriendshipId)} /> : null}
							</div>
						</div>
					)}
				</div>
			</div>
		)
	}

	return UserProfile()
}

export default Profile

export const ProfileRoute: RouteObject = {
	element: <Profile />,
	path: "/profile/:nickname",
	loader: (args: LoaderFunctionArgs) => ({ nickname: args.params.nickname }),
}
