import { IProfile } from "common/Types/User"
import React from "react"
import { API_AXIOS } from "Providers/axios"
import { getAxiosErrorMessage, IFriend } from "common"
import { toast } from "react-hot-toast"
import { getAvatarFromProfile, getUserId } from "utils"
import { useSocketIo } from "./SocketIoContext"
import { profileDefault } from "consts"

export interface IProtectedContext {
	allProfiles: IProfile[]
	myProfile: IProfile
	myUser: IUser
	requestToUpdateMyProfile: () => void
	requestToUpdateFriendList: () => void
	friendList: IFriend[]
}

interface IUser {
	id: number
	Login: string
	Email: string
	State: string
}

const ProtectedContext = React.createContext<IProtectedContext | null>(null)

export const ProtectedProvider = ({ children }: { children: React.ReactNode }) => {
	const [allProfiles, setAllProfiles] = React.useState<IProfile[]>([])
	const [myUser, setMyUser] = React.useState<IUser>({ id: 0, Login: "", Email: "", State: "" })
	const [friendList, setFriendList] = React.useState<IFriend[]>([])
	const [myProfile, setMyProfile] = React.useState<IProfile>(profileDefault)
	const { socket, socketId } = useSocketIo()

	const requestToUpdateMyProfile = () => {
		API_AXIOS.get("/Profile")
			.then((res) => {
				let profiles: IProfile[] = res.data
				profiles = profiles.map((profile: IProfile) => {
					const { base64: avatarBase64, type: avatarType } = getAvatarFromProfile(profile)
					profile.AvatarType = avatarType
					profile.AvatarBase64 = avatarBase64
					if (profile.id === getUserId()) setMyProfile(profile)

					return profile
				})
				setAllProfiles(profiles)
			})
			.catch((error) => {
				console.log(error)
				toast.error(getAxiosErrorMessage(error))
			})

		API_AXIOS.get("/user/" + getUserId())
			.then((res) => setMyUser(res.data))
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
	}

	const requestToUpdateFriendList = React.useCallback(() => {
		API_AXIOS.post("/friendship", { UserId: getUserId() })
			.then((res) => setFriendList(res.data))
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
	}, [])

	React.useEffect(() => {
		if (socket !== null && socketId !== null) {
			requestToUpdateMyProfile()
			requestToUpdateFriendList()
			socket.on("update_list_friend", () => {
				console.log("Atualizando a lista de amigos a pedido do servidor")
				requestToUpdateFriendList()
			})

		}
	}, [socket, socketId])

	const values = { allProfiles, myProfile, myUser, requestToUpdateMyProfile, friendList, requestToUpdateFriendList }
	return <ProtectedContext.Provider value={values}>{children}</ProtectedContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useProtected = () => React.useContext(ProtectedContext)!
