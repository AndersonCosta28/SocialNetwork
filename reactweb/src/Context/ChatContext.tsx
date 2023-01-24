import { IFriend } from "common"
import React, { ReactNode, useContext } from "react"
import { createContext, useState } from "react"
import { v4 as uuid4 } from "uuid"

interface IChatContext {
	openChat: (friend: IFriend) => void
	closeChat: (chatId: string) => void
	chats: IChat[]
	toggleMinimizeChat: (chatId: string, value: boolean) => void	
}

const ChatContext = createContext<IChatContext | null>(null)
export interface IChat {
	targetNickname: string
	targetUserId: number
	chatId: string
	isMinimized: boolean
}

export const ChatProvider = ({ children }: { children: ReactNode }) => {
	const chatInicialize = JSON.parse(localStorage.getItem("chats") ?? "[]")
	const [chats, setChats] = useState<IChat[]>(chatInicialize)

	React.useEffect(() => {
		localStorage.removeItem("chats")
		localStorage.setItem("chats", JSON.stringify(chats))
	}, [chats])

	// React.useEffect(() => {
	// 	if (socket)
	// 		socket.on("message", (data: IMessage) => {
	// 			// É quando estou com o chat fechado e a origem não é essa instância (isso equivale é !isLocalPlayer)
	// 			// Não faz sentido ter que verificar junto com o data.ToId, pois de qualquer forma, preciso do chat aberto para enviar a mensagem
	// 			const idToCompare = data.FromId === getUserId() ? data.ToId : data.FromId
	// 			console.log("ID para comparação -> " + idToCompare)
	// 			const chat = chats.find((chat: IChat) => chat.targetUserId === idToCompare)
	// 			if (!chat) {
	// 				const friend = friendList.find((_friend: IFriend) => _friend.FriendId === idToCompare)
	// 				if (!friend) throw new Error("Friend not Found to open a chat")
	// 				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	// 				openChat(friend)
	// 			}
	// 			const _chats = chats.map((chat: IChat) => {
	// 				if (chat.targetUserId === idToCompare)
	// 					chat?.messages?.push(data)
	// 				return chat
	// 			})
	// 			setChats(_chats)
	// 		})

	// 	return () => {
	// 		if (socket) socket.off("message")
	// 	}
	// }, [socket])

	const openChat = (friend: IFriend) => {
		if (chats.find((chat: IChat) => chat.targetUserId === friend.FriendId)) return
		const newChat: IChat = {
			targetNickname: friend.FriendNickname,
			targetUserId: friend.FriendId,
			chatId: uuid4(),
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
