import { Buffer } from "buffer"

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

