import React from "react"
import { Navigate, Outlet, RouteObject, useNavigate } from "react-router-dom"
import { FeedRoute } from "Pages/Feed"
import { useAuth } from "Context/AuthContext"
import HomePage from "Layouts/HomePage"
import { ChatProvider } from "Context/ChatContext"
import { ProtectedProvider } from "Context/ProtectedContext"
import { ProfileRoute } from "Pages/Profile"
import { FriendshipProvider } from "Context/FriendshipContext"
import { getIsAuthenticated } from "utils"
import { PostProvider } from "Context/PostContext"

const Protected = () => {
	const { isAuthenticated, setIsAuthenticated } = useAuth()
	const navigate = useNavigate()
	setIsAuthenticated(getIsAuthenticated())

	React.useEffect(() => {
		if (!isAuthenticated) navigate("/login", { replace: true })
	}, [])

	if (!isAuthenticated) return <Navigate to={"/login"} replace />	
	else
		return (
			<ProtectedProvider>
				<FriendshipProvider>
					<ChatProvider>
						<HomePage>
							<PostProvider>
								<Outlet />
							</PostProvider>
						</HomePage>
					</ChatProvider>
				</FriendshipProvider>
			</ProtectedProvider>
		)
}

export default Protected

export const ProtectedRoutes: RouteObject = {
	element: <Protected />,
	path: "/",
	children: [FeedRoute, ProfileRoute],
}
