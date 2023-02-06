import React from "react"
import styles from "./MyProfileSideBar.module.css"
import { getNickname } from "utils"
import { useProtected } from "Context/ProtectedContext"
import { UserStates } from "common/Types/User"
import ResendEmailActivation from "Pages/Email/Activation/ResendEmailActivation"
import { useNavigate } from "react-router-dom"
import Avatar from "Components/Avatar"
import { useFriendship } from "Context/FriendshipContext"
import TagInfo from "Components/TagInfo"

const MyProfileSideBar = () => {
	const { myProfile, myUser } = useProtected()
	const { friendList } = useFriendship()
	const navigate = useNavigate()

	const ShowInfoAccountInactive = (): JSX.Element => {
		if (!myProfile) return <></>
		else if (myUser.State === UserStates.WaitingForActivation) return <ResendEmailActivation idUser={myUser.id} />
		else return <></>
	}

	const goToMyProfile = () => {
		navigate("/profile/" + getNickname())
	}

	return (
		<div id={styles.content}>
			<div onClick={goToMyProfile} className={`flex_column_center_center ${styles.content__profile}`}>
				<div id={styles.content__top}>{myProfile && <Avatar size={100} base64={myProfile.AvatarBase64} type={myProfile.AvatarType} />}</div>
				<div id={styles.content__mid}>
					<h2>{myProfile.Nickname}</h2>
					<span id={styles.content__profile__description}>{myProfile.Description}</span>
				</div>
				<div id={styles.content__bottom}></div>
			</div>
			<br />
			<hr style={{ width: "90%" }} />
			{/* <br /> */}
			<div id="container__tag__info" style={{display: "flex", alignItems: "center", justifyContent: "center", width: "100%"}}>
				<TagInfo number={friendList.length} title="Friends" key={"FRIENDS-" + myProfile.Nickname + "-" + friendList.length} />
				<TagInfo number={0} title="Posts" key={"POSTS-" + myProfile.Nickname + "-" + 0} />
			</div>
			<ShowInfoAccountInactive />
		</div>
	)
}

export default MyProfileSideBar
