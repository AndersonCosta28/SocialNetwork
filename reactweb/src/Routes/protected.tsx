import React from "react"
import { Navigate, Outlet, RouteObject } from "react-router-dom"
import { FeedRoute } from "../Pages/Feed"
import { useAuth } from "../Context/AuthContext"
import HomePage from "../Layouts/HomePage"
import { ChatProvider } from "../Context/ChatContext"
import { ProtectedProvider } from "../Context/ProtectedContext"
import { ProfileRoute } from "../Pages/Profile"

const Protected = () => {
	const { isAuthenticated } = useAuth()

	if (!isAuthenticated) return <Navigate to={"/login"} replace />
	else
		return (
			<ProtectedProvider>
				<ChatProvider>
					<div className="BackgrounGreyFullSize">
						<HomePage>
							<Outlet />
						</HomePage>
					</div>
				</ChatProvider>
			</ProtectedProvider>
		)
}

export default Protected

export const ProtectedRoutes: RouteObject = {
	element: <Protected />,
	path: "/",
	children: [FeedRoute, ProfileRoute],
}
