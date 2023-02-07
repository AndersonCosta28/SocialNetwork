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
	/* Controle de números de abas abertas, quando a quantidade de abas aberta for igual a zero, irá limpar o localStorage - Funcionamento perfeitamente */
	// const tabsOpen: string | null = localStorage.getItem("tabsOpen")
	// if (tabsOpen === null) localStorage.setItem("tabsOpen", (1).toString())
	// else if (Number(tabsOpen) === 0) localStorage.clear()
	// localStorage.setItem("tabsOpen", (Number(tabsOpen) + 1).toString())
	// window.onunload = () => {
	// 	const tabsOpen: string | null = localStorage.getItem("tabsOpen")
	// 	if (tabsOpen !== null) localStorage.setItem("tabsOpen", (Number(tabsOpen) - 1).toString())
	// }

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
