export const getIsAuthenticated = () => localStorage.getItem("authenticated") === "true"
export const getNickname = () => localStorage.getItem("nickname")
export const getUserId = () => Number(localStorage.getItem("iduser"))

export const onClickOutSideComponent = (element: HTMLElement | null, target: Node, callback: VoidFunction) => {
	if (!element) return
	if (!element.contains(target)) callback()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withTimeout = (onSuccess: { apply: (arg0: undefined, arg1: any[]) => void }, onTimeout: () => void, timeout: number | undefined) => {
	let called = false
  
	const timer = setTimeout(() => {
	  if (called) return
	  called = true
	  onTimeout()
	}, timeout)
  
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return (...args: any) => {
	  if (called) return
	  called = true
	  clearTimeout(timer)
	  onSuccess.apply(this, args)
	}
}

