import React, { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react"
import { connectToServerWebSocket } from "../Providers/axios"
import { Socket } from "socket.io-client"
import { useAuth } from "./AuthContext"
import { IUserSocket } from "common"

export interface ISocketIoContext {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: IUserSocket[];
}

const SocketIoContext = createContext<ISocketIoContext | null>(null)

export const SocketIoProvider = ({ children }: { children: ReactNode }) => {
	const { isAuthenticated } = useAuth()
	const socket: Socket | null = useMemo(() => {
		if (isAuthenticated) return connectToServerWebSocket()
		else return null
	}, [isAuthenticated])
	const [isConnected, setIsConnected] = useState(socket ? socket.connected : false)
	const [onlineUsers, setOnlineUsers] = useState<IUserSocket[]>([])

	useEffect(() => {
		if (socket) {
			socket.on("connect", () => {
				setIsConnected(true)
			})

			socket.on("disconnect", () => {
				setIsConnected(false)
			})

			socket.on("onlineUsers", (data) => {
				setOnlineUsers(data)
			})
		}
		return () => {
			if (socket){
				socket.off("connect")
				socket.off("disconnect")
			}
		}
	}, [socket])

	const values: ISocketIoContext = { socket, isConnected, onlineUsers }
	return <SocketIoContext.Provider value={values}>{children}</SocketIoContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useSocketIo = () => useContext(SocketIoContext)!
