import axios from "axios"
import React, { useState } from "react"
import { BASE_URL_API_V1 } from "Providers/axios"
import { getAxiosErrorMessage } from "common"


const ResendEmailActivation = (props: { idUser?: number, idEmail?: string | null}) => {
	const {idEmail, idUser} = props
	const [disableButton, setDisableButton] = useState(false)
	const [message, setMessage] =  useState("")

	const resendEmail = () => {
		setDisableButton(true)
		axios
			.post(BASE_URL_API_V1 + "user/resendActivationEmail", { idEmail, idUser })
			.then(() => setMessage("An activation email has been resent to your account"))
			.catch((error) => setMessage(getAxiosErrorMessage(error)))
			.finally(() => setDisableButton(false))
	}
	return (
		<div className="flex_column_center_center">
			<p>Your account is not activated, please resend the email to activate it</p>
			<input type={"button"} value="Resend the email" className={ disableButton ? "blueButtonDisable" : "blueButtonActive"} onClick={resendEmail} disabled={disableButton} />
			<p>{message}</p>
		</div>
	)
}

export default ResendEmailActivation