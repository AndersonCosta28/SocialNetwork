import React from "react"
import "./App.css"
import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { AuthProvider } from "./Context/AuthContext"
import { SocketIoProvider } from "./Context/SocketIoContext"
import WebFont from "webfontloader"
import { ProtectedRoutes } from "./Routes/protected"
import { PublicRoutes } from "./Routes/public"

const App = () => {
	React.useEffect(() => {
		WebFont.load({
			google: {
				families: ["Roboto"],
			},
		})
	}, [])

	const routes = createBrowserRouter([ProtectedRoutes, PublicRoutes])
	return (
		<div className="App">
			<AuthProvider>
				<SocketIoProvider>
					<RouterProvider router={routes} />
				</SocketIoProvider>
			</AuthProvider>
		</div>
	)
}

export default App
