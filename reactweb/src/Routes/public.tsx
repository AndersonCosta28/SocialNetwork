import React from "react"
import { Outlet, RouteObject } from "react-router-dom"
import { LoginRoute } from "../Pages/Login"
import { RegisterRoute } from "../Pages/Register"
import { ForgetPasswordRoute } from "../Pages/ForgetPassword"
import { ActivationEmailRoute } from "../Pages/Email/Activation/ActivationEmail"
import { RedefinePasswordRoute } from "../Pages/Email/Password/RedefinePassword"

const Public = () => <Outlet />

export default Public

export const PublicRoutes: RouteObject = {
	path: "/",
	element: <Public />,
	children: [
		LoginRoute,
		RegisterRoute,
		ForgetPasswordRoute,
		{
			path: "/ping",
			element: <h1>pong</h1>,
			loader: () => {
				console.log("ping-pong")
				return null
			},
		},
		{
			path: "/user",
			children: [ActivationEmailRoute, RedefinePasswordRoute],
		},
	],
}
