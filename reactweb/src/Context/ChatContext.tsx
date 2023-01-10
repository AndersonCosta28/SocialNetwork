import React, { ReactNode, useContext } from "react"
import { createContext, useState } from "react"
import { ISocketUser } from "./SocketIoContext"
import { v4 as uuid4 } from "uuid"

interface IChatContext {
	openChat: (socketUser: ISocketUser) => void
	closeChat: (chatId: string) => void
	chats: IChat[]
	toggleMinimizeChat: (chatId: string, value: boolean) => void
}

const ChatContext = createContext<IChatContext | null>(null)
export interface IChat {
	targetNickname: string
	targetSocketId: string
	chatId: string
	userId: string
	isMinimized: boolean
}

export const ChatProvider = ({ children }: { children: ReactNode }) => {
	const chatInicialize = JSON.parse(sessionStorage.getItem("chats") ?? "[]")
	const [chats, setChats] = useState<IChat[]>(chatInicialize)

	React.useEffect(() => {
		sessionStorage.removeItem("chats")
		sessionStorage.setItem("chats", JSON.stringify(chats))
	}, [chats])

	const openChat = (socketUser: ISocketUser) => {
		if (chats.find((chat: IChat) => chat.userId === socketUser.UserId)) return
		const newChat: IChat = {
			targetNickname: socketUser.Nickname,
			targetSocketId: socketUser.SocketID,
			chatId: uuid4(),
			userId: socketUser.UserId,
			isMinimized: false,
		}
		setChats((prevState: IChat[]) => [...prevState, newChat])
	}

	const closeChat = (chatId: string) => {
		const newChats = chats.filter((chat: IChat) => chat.chatId !== chatId)
		setChats(newChats)
	}

	const toggleMinimizeChat = (chatId: string, value: boolean) => {
		const newChats = chats.map((chat: IChat) => {
			if (chat.chatId === chatId) chat.isMinimized = value
			return chat
		})
		setChats(newChats)
	}

	const values = { closeChat, openChat, chats, toggleMinimizeChat }
	return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useChat = () => useContext(ChatContext)!