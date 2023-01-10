import { IUserInfo } from "common/Types/User"
import React from "react"
import { API_AXIOS } from "../Providers/axios"
import { getErrorMessage } from "common"
import { toast } from "react-hot-toast"

export interface IProtectedContext {
	allUsers: IUserInfo[]
}

const ProtectedContext = React.createContext<IProtectedContext | null>(null)

export const ProtectedProvider = ({ children }: { children: React.ReactNode }) => {
	const [allUsers, setAllUser] = React.useState<IUserInfo[]>([])
	React.useEffect(() => {
		API_AXIOS.get("/user")
			.then((res) => setAllUser(res.data))
			.catch((error) => toast.error(getErrorMessage(error)))
	}, [])

	const values = { allUsers }
	return <ProtectedContext.Provider value={values}>{children}</ProtectedContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useProtected = () => React.useContext(ProtectedContext)!
