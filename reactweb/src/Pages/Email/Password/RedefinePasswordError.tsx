import { getErrorMessage } from "common"
import React, { useState } from "react"
import { useRouteError } from "react-router-dom"

const RedefinePasswordError = () => {
	const error = useRouteError()
	const [message] = useState(getErrorMessage(error))
	return <div>{message}</div>
}

export default RedefinePasswordError
