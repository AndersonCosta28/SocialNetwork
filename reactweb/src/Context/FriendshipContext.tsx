import React, { createContext, useContext } from "react"
import { API_AXIOS } from "Providers/axios"
import { getUserId } from "utils"
import { getAxiosErrorMessage } from "common"
import { toast } from "react-hot-toast"
import { useProtected } from "./ProtectedContext"

export interface IFriendshipContext {
	addFriend: (sourceId: number, targetName: string) => void
	removeFriend: (idFriendship: number) => void
	acceptFriendshipRequest: (idFriendship: number) => void
	rejectFriendshipRequest: (idFriendship: number) => void
	disableButton: boolean
}

const FriendshipContext = createContext<IFriendshipContext | null>(null)

export const FriendshipProvider = ({ children }: { children: React.ReactNode }) => {
	const { requestToUpdateFriendList } = useProtected()
	const [disableButton, setDisableButton] = React.useState<boolean>(false)

	const addFriend = (sourceId: number, targetName: string) => {
		setDisableButton(true)
		API_AXIOS.post("/friendship/add", {
			SourceId: sourceId,
			TargetName: targetName,
		})
			.then(console.log)
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
			.finally(() => {
				requestToUpdateFriendList()
				setDisableButton(false)
			})
	}

	const removeFriend = (idFriendship: number) => {
		setDisableButton(true)
		API_AXIOS.post("/friendship/RemoveFriend", { idFriendship })
			.then(console.log)
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
			.finally(() => {
				requestToUpdateFriendList()
				setDisableButton(false)
			})
	}

	const acceptFriendshipRequest = (idFriendship: number) => {
		setDisableButton(true)
		API_AXIOS.post("/friendship/ReactToFriendRequest", {
			FriendshipId: idFriendship,
			React: true,
			UserId: getUserId(),
		})
			.then(console.log)
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
			.finally(() => {
				requestToUpdateFriendList()
				setDisableButton(false)
			})
	}

	const rejectFriendshipRequest = (idFriendship: number) => {
		setDisableButton(true)
		API_AXIOS.post("/friendship/ReactToFriendRequest", {
			FriendshipId: idFriendship,
			React: false,
			UserId: getUserId(),
		})
			.then(console.log)
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
			.finally(() => {
				requestToUpdateFriendList()
				setDisableButton(false)
			})
	}

	const values = { addFriend, acceptFriendshipRequest, rejectFriendshipRequest, removeFriend, disableButton }

	return <FriendshipContext.Provider value={values}>{children}</FriendshipContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useFriendship = () => useContext(FriendshipContext)!
