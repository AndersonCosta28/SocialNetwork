import React from "react"
import { getErrorMessage } from "common"
import { useRouteError } from "react-router-dom"

const ErrorPage = () => {
	const e = useRouteError()
	const error = getErrorMessage(e)

	return (
		<div id="error-page">
			<h1>Oops!</h1>
			<p>Sorry, an unexpected error has occurred.</p>
			<p>
				<i>{error}</i>
			</p>
		</div>
	)
}
export default ErrorPage
