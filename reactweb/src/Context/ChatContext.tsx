import { IFriend, IMessage } from "common"
import React, { ReactNode, useContext } from "react"
import { createContext, useState } from "react"
import { getIsAuthenticated } from "utils"
import { v4 as uuid4 } from "uuid"
import { useProtected } from "./ProtectedContext"
import { useSocketIo } from "./SocketIoContext"

interface IChatContext {
	openChatByFriend: (friend: IFriend) => void
	openChatByIdFriend: (idFriendship: number) => void
	closeChat: (chatId: string) => void
	chats: IChat[]
	toggleMinimizeChat: (chatId: string, value: boolean) => void
}

const ChatContext = createContext<IChatContext | null>(null)
export interface IChat {
	targetNickname: string
	targetUserId: number
	friendshipId: number
	chatId: string
	isMinimized: boolean
}

export const ChatProvider = ({ children }: { children: ReactNode }) => {
	const chatInicialize = JSON.parse(localStorage.getItem("chats") ?? "[]")
	const [chats, setChats] = useState<IChat[]>(chatInicialize)
	const handlerChats = (chats: IChat[]) => {
		setChats(chats)
		localStorage.removeItem("chats")
		localStorage.setItem("chats", JSON.stringify(chats))
	}
	const { socket } = useSocketIo()
	const { friendList } = useProtected()

	React.useEffect(() => {
		if (socket !== null)
			socket.on("message", (data: IMessage) => {
				openChatByIdFriend(data.FriendshipId)
			})
		return () => {
			console.log("Desligou no context")
			if (socket !== null && !getIsAuthenticated()) socket.off("message")
		}
	}, [friendList])

	const openChatByIdFriend = (idFriendship: number) => {
		const friend = friendList.find((friend: IFriend) => friend.FriendshipId === idFriendship)
		if (friend) openChatByFriend(friend)
	}

	const openChatByFriend = (friend: IFriend) => {
		if (chats.find((chat: IChat) => chat.targetUserId === friend.FriendProfile.id)) return
		const newChat: IChat = {
			friendshipId: friend.FriendshipId,
			targetNickname: friend.FriendProfile.Nickname,
			targetUserId: friend.FriendProfile.id,
			chatId: uuid4(),
			isMinimized: false,
		}
		chats.push(newChat)
		handlerChats([...chats])
	}

	const closeChat = (chatId: string) => {
		const newChats = chats.filter((chat: IChat) => chat.chatId !== chatId)
		handlerChats([...newChats])
	}

	const toggleMinimizeChat = (chatId: string, value: boolean) => {
		const newChats = chats.map((chat: IChat) => {
			if (chat.chatId === chatId) chat.isMinimized = value
			return chat
		})
		handlerChats([...newChats])
	}

	const values = { closeChat, openChatByFriend, chats, toggleMinimizeChat, openChatByIdFriend }
	return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useChat = () => useContext(ChatContext)!
