import { Buffer } from "buffer"
import { IProfile } from "common"

export const getIsAuthenticated = () => {
	const token = localStorage.getItem("token")
	return !!token
	// if (jwt.verify(token))
}

export const getToken = () => localStorage.getItem("token")
export const getNickname = () => localStorage.getItem("nickname")
export const getUserId = () => Number(localStorage.getItem("iduser"))

export const getIWS = () => sessionStorage.getItem("iws")

export const onClickOutSideComponent = (element: HTMLElement | null, target: Node, callback: VoidFunction) => {
	if (!element) return
	if (!element.contains(target)) callback()
}

export const sleep = (milliseconds: number) => {
	const date = Date.now()
	let currentDate = null
	do
		currentDate = Date.now()

	while (currentDate - date < milliseconds)
}


export const getBase64FromBuffer = (buffer: Buffer) => buffer ? Buffer.from(buffer).toString("base64") : ""

export const getAvatarFromProfile = (profile: IProfile): { buffer: Buffer, type: string, base64: string, id : number} => {
	const avatar = profile.Avatar as { buffer: Buffer; type: string, id: number }
	const base64 = getBase64FromBuffer(avatar.buffer)
	return {...avatar, base64 }
}
export const timeSince = (date: Date) => {

	const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

	let interval = seconds / 31536000

	if (interval > 1)
		return Math.floor(interval) + " years ago"

	interval = seconds / 2592000
	if (interval > 1)
		return Math.floor(interval) + " months ago"

	interval = seconds / 86400
	if (interval > 1)
		return Math.floor(interval) + " days ago"

	interval = seconds / 3600
	if (interval > 1)
		return Math.floor(interval) + " hours ago"

	interval = seconds / 60
	if (interval > 1)
		return Math.floor(interval) + " minutes ago"

	return Math.floor(seconds) + " seconds ago"
}

// Função antiga para usar no SocketIO
// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// export const withTimeout = (onSuccess: { apply: (arg0: undefined, arg1: any[]) => void }, onTimeout: () => void, timeout: number | undefined) => {
// 	let called = false

// 	const timer = setTimeout(() => {
// 		if (called) return
// 		called = true
// 		onTimeout()
// 	}, timeout)

// 	// eslint-disable-next-line @typescript-eslint/no-explicit-any
// 	return (...args: any) => {
// 		if (called) return
// 		called = true
// 		clearTimeout(timer)
// 		onSuccess.apply(this, args)
// 	}
// }

