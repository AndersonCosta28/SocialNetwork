import { getErrorMessage } from "common"
import React, { useState } from "react"
import { useLocation, useRouteError } from "react-router-dom"
import ResendEmailActivation from "./ResendEmailActivation"

const EmailActivationError = () => {
	//#region Hooks

	const error = useRouteError()
	const [message] = useState(getErrorMessage(error))
	const location = useLocation()

	//#endregion

	//#region CONSTS

	const pathSplit = location.pathname.split("/")
	const idEmail = pathSplit[pathSplit.length - 1]

	//#endregion

	return (
		<div>
			<h1>{message}</h1>
			{message === "The email has expired" && ResendEmailActivation({idEmail})}
		</div>
	)
}

export default EmailActivationError
