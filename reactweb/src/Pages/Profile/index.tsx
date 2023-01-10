import React from "react"
import { LoaderFunctionArgs, RouteObject } from "react-router-dom"

const Profile = () => (
	<div>Profile</div>
)

export default Profile

export const ProfileRoute: RouteObject = {
	element: <Profile />,
	path: "/profile/:nickname",
	loader: (params: LoaderFunctionArgs) => {
		console.log(params)
		return null
	}
}