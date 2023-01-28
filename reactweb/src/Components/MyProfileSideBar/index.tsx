import React from "react"
import styles from "./MyProfileSideBar.module.css"
import { getNickname, getUserId } from "utils"
import { useProtected } from "Context/ProtectedContext"
import { IProfileInfo, UserStates } from "common/Types/User"
import ResendEmailActivation from "Pages/Email/Activation/ResendEmailActivation"
import { useNavigate } from "react-router-dom"
import Avatar from "Components/Avatar"

const MyProfileSideBar = () => {
	const { allProfiles } = useProtected()
	const [profile, setProfile] = React.useState<IProfileInfo>()
	const navigate = useNavigate()

	React.useEffect(() => {
		// setVerifyAccount(true)
		const profile : IProfileInfo | undefined = allProfiles.find((profile: IProfileInfo) => Number(profile.id) === Number(getUserId()))
		// if (!profile || profile === undefined) throw new Error("Profile not found")
		console.log(profile)
		setProfile(profile)
	}, [allProfiles])

	const ShowInfoAccountInactive = (): JSX.Element => {
		if (!profile) return <></>
		else if (profile.State === UserStates.WaitingForActivation) return <ResendEmailActivation idUser={getUserId()} />
		else return <></>
	}

	const goToMyProfile = () => {
		navigate("/profile/" + getNickname())
	}

	return (
		<div id={styles.content}>
			<div onClick={goToMyProfile} className={`flex_column_center_center ${styles.content__profile}`}>
				<div id={styles.content__top}>
					{
						profile && <Avatar size={100} base64={profile.AvatarBase64} type={profile.AvatarType} />
					}					
				</div>
				<div id={styles.content__mid}>
					<h2>{profile?.Nickname}</h2>
					<h3></h3>
				</div>
				<div id={styles.content__bottom}></div>
			</div>
			<ShowInfoAccountInactive />
		</div>
	)
}

export default MyProfileSideBar
