import React from "react"
import { LoaderFunctionArgs, RouteObject, useLoaderData } from "react-router-dom"
import { API_AXIOS } from "../../../Providers/axios"
import { getAxiosErrorMessage } from "common"
import EmailActivationError from "./EmailActivationError"

const ActivationEmail = () => {
	const dataOnLoader = useLoaderData()
	console.log(dataOnLoader)
	return (
		<div>
			<h1>Account successfully activated</h1>
		</div>
	)
}

export const ActivationEmailRoute: RouteObject = {
	path: "activation/:idemail",
	element: <ActivationEmail />,
	loader: async ({ params }: LoaderFunctionArgs) => {		
		try {
			await API_AXIOS.post("user/activation", params)
			return null
		}
		catch (error) {
			throw new Error(getAxiosErrorMessage(error))
		}
	},
	errorElement: <EmailActivationError />
}

export default ActivationEmail
