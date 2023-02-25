import React from "react"
import styles from "./ChatBox.module.css"
import { IMessage } from "common/Types/Friendship"
import { useSocketIo } from "Context/SocketIoContext"
import { BiSend } from "react-icons/bi"
import { GrClose } from "react-icons/gr"
import { IChat, useChat } from "Context/ChatContext"
import { getIsAuthenticated, getUserId } from "utils"
import { API_AXIOS } from "Providers/axios"
import { toast } from "react-hot-toast"
import { getAxiosErrorMessage } from "common"

const ChatBox = (props: IChat) => {
	//#region Hooks
	const [message, setMessage] = React.useState<string>("")
	const [messages, setMessages] = React.useState<IMessage[]>([])
	const [textAreaFocused, setTextAreaFocused] = React.useState<boolean>(false)
	const [isMinimized, setIsMinimized] = React.useState<boolean>(props.isMinimized)

	const { socket } = useSocketIo()
	const { closeChat, toggleMinimizeChat } = useChat()

	const headerElementRef = React.useRef<HTMLDivElement>(null)
	const closeElementRef = React.useRef<HTMLDivElement>(null)
	const chatBodyRef = React.useRef<HTMLDivElement>(null)
	const textAreaElementRef = React.useRef<HTMLTextAreaElement>(null)
	const buttonSubmitMessageElementRef = React.useRef<HTMLInputElement>(null)

	const scrollToTheEnd = () => {
		const chatContainer = chatBodyRef.current
		if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight
	}

	React.useEffect(() => {
		API_AXIOS.get("/message/findByFriendship/" + props.friendshipId)
			.then((res) => {
				setMessages(res.data)
				setTimeout(() => {
					scrollToTheEnd()
				}, 500)
			})
			.catch((error) => {
				toast.error(getAxiosErrorMessage(error))
			})

		if (socket)
			socket.on("message", (data: IMessage) => {
				if ((data.FromId === props.targetUserId && data.ToId === getUserId()) || (data.ToId === props.targetUserId && data.FromId === getUserId())) {
					setMessages((prevState: IMessage[]) => [...prevState, data])
					setTimeout(() => {
						scrollToTheEnd()
					}, 500)
				}
			})

		return () => {
			if (socket && !getIsAuthenticated()) {
				console.log("Desligou no chatbox")
				socket.off("message")
			}
		}
	}, [socket])
	//#endregion

	//#region Functions
	const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const userId = Number(getUserId())
		if (!socket || !userId) return

		const messageToSend: IMessage = {
			FromId: userId,
			ToId: props.targetUserId,
			Message: message.trim(),
			id: 0,
			FriendshipId: props.friendshipId,
		}

		socket.timeout(4000).emit("message", messageToSend, (error: unknown, response: unknown) => {
			if (error) console.log(error)
			else console.log(response)
		})
		setMessage("")
	}

	const close = () => {
		closeChat(props.chatId)
	}

	const minimize = () => {
		const value = !isMinimized
		toggleMinimizeChat(props.chatId, value)
		setIsMinimized(value)
		scrollToTheEnd()
	}

	const onClickOnHeaderElement = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		if (closeElementRef.current?.contains(e.target as Node)) close()
		else minimize()
	}
	const onFocusTextArea = () => setTextAreaFocused(true)
	const onBlurTextArea = () => setTextAreaFocused(false)

	const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && e.shiftKey === false && textAreaFocused) buttonSubmitMessageElementRef.current?.click()
	}

	React.useEffect(() => scrollToTheEnd(), [isMinimized])

	//#endregion
	return (
		<div className={styles.content} id={props.chatId}>
			<div className={styles.content__header} onClick={onClickOnHeaderElement} ref={headerElementRef}>
				<span>{props.targetNickname}</span>
				<div ref={closeElementRef}>
					<GrClose className={styles.content__header__closeChat} />
				</div>
			</div>
			{isMinimized ? null : (
				<>
					<div className={styles.content__body} ref={chatBodyRef}>
						<ul>
							{messages.map(({ Message, FromId, id }: IMessage, index: number) => {
								if (FromId === getUserId())
									return (
										<li className={styles.message_mine} key={`message-${index}-${id}`}>
											<span className={styles.message}>{Message}</span>
										</li>
									)
								else
									return (
										<li className={styles.message_other} key={`message-${index}-${id}`}>
											<span className={styles.message}>{Message}</span>
										</li>
									)
							})}
						</ul>
					</div>
					<form className={styles.content__footer} onSubmit={handleSendMessage}>
						<textarea
							name="message"
							id="message"
							value={message}
							onChange={(e) => setMessage(e.target.value)}
							placeholder="Type your message"
							ref={textAreaElementRef}
							onBlur={onBlurTextArea}
							onFocus={onFocusTextArea}
							onKeyDown={onEnterPress}
						/>
						<BiSend className={styles.content__footer__iconSendMessage} onClick={() => buttonSubmitMessageElementRef.current?.click()} />
						<input type="submit" disabled={message.trim() === ""} style={{ display: "none" }} ref={buttonSubmitMessageElementRef} />
					</form>
				</>
			)}
		</div>
	)
}

export default ChatBox
