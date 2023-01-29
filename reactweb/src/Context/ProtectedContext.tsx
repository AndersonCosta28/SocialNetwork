import { IProfileInfo } from "common/Types/User"
import React from "react"
import { API_AXIOS } from "Providers/axios"
import { getErrorMessage } from "common"
import { toast } from "react-hot-toast"
import { Buffer } from "buffer"
import { getUserId } from "utils"

export interface IProtectedContext {
	allProfiles: IProfileInfo[]
	myProfile: IProfileInfo
	myUser: IUser
}

interface IUser { id: number; Login: string; Email: string; State: string }

const ProtectedContext = React.createContext<IProtectedContext | null>(null)

export const ProtectedProvider = ({ children }: { children: React.ReactNode }) => {
	const [allProfiles, setAllProfiles] = React.useState<IProfileInfo[]>([])
	const [myProfile, setMyProfile] = React.useState<IProfileInfo>({
		Avatar: null,
		AvatarBase64: "",
		AvatarId: 0,
		AvatarType: "",
		Description: "",
		id: 0,
		Local: "",
		Nickname: "",
	})

	const [myUser, setMyUser] = React.useState<IUser>({ id: 0, Login: "", Email: "", State: "" })

	React.useEffect(() => {
		API_AXIOS.get("/Profile")
			.then((res) => {
				let profiles: IProfileInfo[] = res.data
				profiles = profiles.map((profile: IProfileInfo) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const avatar = profile.Avatar as any
					const avatarBuffer = avatar.buffer
					profile.AvatarBase64 = avatarBuffer ? Buffer.from(avatarBuffer).toString("base64") : ""
					if (profile.id === getUserId()) setMyProfile(profile)
					return profile
				})
				setAllProfiles(profiles)
			})
			.catch((error) => toast.error(getErrorMessage(error)))

		API_AXIOS.get("/user/" + getUserId())
			.then((res) => setMyUser(res.data))
			.catch((error) => toast.error(getErrorMessage(error)))
	}, [])

	const values = { allProfiles, myProfile, myUser }
	return <ProtectedContext.Provider value={values}>{children}</ProtectedContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useProtected = () => React.useContext(ProtectedContext)!
