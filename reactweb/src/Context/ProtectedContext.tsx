import { IProfileInfo } from "common/Types/User"
import React from "react"
import { API_AXIOS } from "Providers/axios"
import { getErrorMessage } from "common"
import { toast } from "react-hot-toast"
import { Buffer } from "buffer"
export interface IProtectedContext {
	allProfiles: IProfileInfo[]
}

const ProtectedContext = React.createContext<IProtectedContext | null>(null)

export const ProtectedProvider = ({ children }: { children: React.ReactNode }) => {
	const [allProfiles, setAllProfiles] = React.useState<IProfileInfo[]>([])

	React.useEffect(() => {
		API_AXIOS.get("/Profile")
			.then((res) => {
				let profiles: IProfileInfo[] = res.data
				profiles = profiles.map((profile: IProfileInfo) => {
					console.log(profile)
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const avatar = profile.Avatar as any
					const avatarBuffer = avatar.buffer
					profile.AvatarBase64 = avatarBuffer ? Buffer.from(avatarBuffer).toString("base64") : ""
					return profile
				})
				setAllProfiles(profiles)
			})
			.catch((error) => toast.error(getErrorMessage(error)))
	}, [])

	const values = { allProfiles }
	return <ProtectedContext.Provider value={values}>{children}</ProtectedContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useProtected = () => React.useContext(ProtectedContext)!
