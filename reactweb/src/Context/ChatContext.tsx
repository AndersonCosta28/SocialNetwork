import { IFriend, IMessage } from "common"
import React, { ReactNode, useContext } from "react"
import { createContext, useState } from "react"
import { v4 as uuid4 } from "uuid"
import { getUserId } from "utils"
import { useFriendship } from "./FriendshipContext"
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
	const { socket } = useSocketIo()
	const { friendList } = useFriendship()

	React.useEffect(() => {
		localStorage.removeItem("chats")
		localStorage.setItem("chats", JSON.stringify(chats))
	}, [chats])

	React.useEffect(() => {
		if (socket)
			socket.on("message", (data: IMessage) => {
				const target = data.FromId === getUserId() ? data.ToId : data.FromId
				const chat = chats.find((chat: IChat) => chat.targetUserId === target)
				if (!chat) 
					openChatByIdFriend(data.FriendshipId)				
				teste()
			})
		return () => {
			console.log("Desligou")
			if (socket) socket.off("message")
		}
	}, [])

	const teste = React.useCallback(() => {
		console.log(chats.length + " - " + friendList.length)
	}, [chats, friendList])

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

	const values = { closeChat, openChatByFriend, chats, toggleMinimizeChat, openChatByIdFriend }
	return <ChatContext.Provider value={values}>{children}</ChatContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const useChat = () => useContext(ChatContext)!
