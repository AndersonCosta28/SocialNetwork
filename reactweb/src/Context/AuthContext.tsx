import { AxiosResponse } from "axios"
import { IResponseLogin, IUserLogin, IUserRegister, getAxiosErrorMessage } from "common"
import React, { useContext, createContext, ReactNode, useState } from "react"
import { getIsAuthenticated } from "../utils"
import { toast } from "react-hot-toast"
import { API_AXIOS } from "../Providers/axios"


export interface IAuthContext {
	login: (e: React.FormEvent<HTMLFormElement>, credential: IUserLogin, callbackSucses: (data: string) => void, callbackError: (error: string) => void) => void
	createAccount: (e: React.FormEvent<HTMLFormElement>, userRegister: IUserRegister, callbackSucses: (data: string) => void, callbackError: (error: string) => void) => void
	logout: (callback: VoidFunction) => void
	isAuthenticated: boolean
	setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
	disableButton: boolean
}

const AuthContext = createContext<IAuthContext | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [isAuthenticated, setIsAuthenticated] = useState<boolean>(getIsAuthenticated())
	const [disableButton, setDisableButton] = useState(false)

	const login = (e: React.FormEvent<HTMLFormElement>, credential: IUserLogin, callbackSucess: (data: string) => void = () => null, callbackError: (errorMessage: string) => void = () => null): void => {
		e.preventDefault()
		setDisableButton(true)
		API_AXIOS
			.post("authentication", credential)
			.then((res) => {
				if (res.status === 202) {
					const { idUser, nickname, authenticated } = res.data as IResponseLogin
					localStorage.clear()
					localStorage.setItem("authenticated", String(authenticated))
					localStorage.setItem("nickname", String(nickname))
					localStorage.setItem("iduser", String(idUser))
					setIsAuthenticated(true)
					callbackSucess(res.data)
				}
			})
			.catch((error) => {
				callbackError(getAxiosErrorMessage(error))
				toast.error(getAxiosErrorMessage(error))
			})
			.finally(() => setDisableButton(false))
	}

	const createAccount = (e: React.FormEvent<HTMLFormElement>, userRegister: IUserRegister, callbackSucess: (data: string) => void = () => null, callbackError: (errorMessage: string) => void = () => null): void => {
		e.preventDefault()
		setDisableButton(true)
		userRegister.Login = userRegister.Nickname.toLowerCase()
		API_AXIOS
			.post<null>("user", userRegister)
			.then((res: AxiosResponse) => {
				toast.success("User created")
				callbackSucess(res.data)
			})
			.catch((e) => {
				toast.error(getAxiosErrorMessage(e))
				callbackError(getAxiosErrorMessage(e))
			})
			.finally(() => setDisableButton(false))
	}

	const logout = (callback: VoidFunction): void => {
		localStorage.clear()
		setIsAuthenticated(false)
		callback()
	}

	const values: IAuthContext = { login, logout, isAuthenticated, createAccount, disableButton, setIsAuthenticated }
	return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useAuth = () => useContext(AuthContext)!
