import React from "react"
import { BsPersonCircle } from "react-icons/bs"
import styles from "./MyProfileSideBar.module.css"
import { getNickname, getUserId } from "../../utils"
import { useProtected } from "../../Context/ProtectedContext"
import { IUserInfo, UserStates } from "common/Types/User"
import ResendEmailActivation from "../../Pages/Email/Activation/ResendEmailActivation"
import { useNavigate } from "react-router-dom"

const MyProfileSideBar = () => {
	const { allUsers } = useProtected()
	const [user, setUser] = React.useState<IUserInfo>()
	const [verifyAccount, setVerifyAccount] = React.useState<boolean>(false)
	const navigate = useNavigate()

	React.useEffect(() => {
		// setVerifyAccount(true)
		setUser(allUsers.find((user: IUserInfo) => Number(user.id) === Number(getUserId())))
	}, [allUsers])

	const ShowInfoAccountInactive = (): JSX.Element => {
		console.log(allUsers)
		const user = allUsers.find((user: IUserInfo) => Number(user.id) === Number(getUserId()))
		if (!user) return <></>
		else if (user.State === UserStates.WaitingForActivation) return <ResendEmailActivation idUser={getUserId()} />
		else return <></>
	}

	const goToMyProfile = () => {
		navigate("/profile/" + getNickname())
	}

	return (
		<div id={styles.content}>
			<div onClick={goToMyProfile} >
				<div id={styles.content__top}>
					<BsPersonCircle size={100} />
				</div>
				<div id={styles.content__mid}>
					<h2>{getNickname()}</h2>
					<h3></h3>
				</div>
				<div id={styles.content__bottom}>
				</div>
			</div>
			{verifyAccount ? <ShowInfoAccountInactive /> : null}
		</div>
	)
}

export default MyProfileSideBar