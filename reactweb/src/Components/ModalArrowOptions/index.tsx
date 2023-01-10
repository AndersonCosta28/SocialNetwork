import React from "react"
import styles from "./ModalArrowOptions.module.css"
import { useAuth } from "../../Context/AuthContext"
import { useNavigate } from "react-router-dom"

const ModalArrowOptions = () => {
	const navigate = useNavigate()
	const { logout } = useAuth()

	const callbackLogout = () => {
		navigate("/login")
	}

	return (
		<div className={`${styles.modal} shadow_white`}>
			<ul className={styles.modal__list}>
				<li className={styles.modal__list__item}>Settings</li>
				<li className={styles.modal__list__item} onClick={() => logout(callbackLogout)}>Logout</li>
			</ul>
		</div>
	)
}

export default ModalArrowOptions
