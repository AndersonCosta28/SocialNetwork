import React, { useState, useEffect, useRef, FormEvent } from "react"
import styles from "./ChatBox.module.css"
import { IMessage } from "common/Types/Friendship"
import { useSocketIo } from "../../Context/SocketIoContext"
import { BiSend } from "react-icons/bi"
import { GrClose } from "react-icons/gr"
import { IChat, useChat } from "../../Context/ChatContext"
import { getUserId } from "../../utils"
import { API_AXIOS } from "../../Providers/axios"
import { toast } from "react-hot-toast"
import { getAxiosErrorMessage } from "common"

const ChatBox = (props: IChat) => {
	//#region Hooks
	const [message, setMessage] = useState<string>("")
	const [messages, setMessages] = useState<IMessage[]>([])
	const [textAreaFocused, setTextAreaFocused] = useState<boolean>(false)
	const [isMinimized, setIsMinimized] = useState<boolean>(props.isMinimized)

	const { socket } = useSocketIo()
	const { closeChat, toggleMinimizeChat } = useChat()

	const headerElementRef = useRef<HTMLDivElement>(null)
	const closeElementRef = useRef<HTMLDivElement>(null)
	const chatBodyRef = useRef<HTMLDivElement>(null)
	const textAreaElementRef = useRef<HTMLTextAreaElement>(null)
	const buttonSubmitMessageElementRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		API_AXIOS.get("/message/findByFriendship/" + props.friendshipId)
			.then(res => {
				console.log(res.data)
				setMessages(res.data)
			})
			.catch(error => {
				toast.error(getAxiosErrorMessage(error))
			})

		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		const chatContainer = chatBodyRef.current!
		if (socket)
			socket.on("message", (data: IMessage) => {
				if ((data.FromId === props.targetUserId && data.ToId === getUserId()) || (data.ToId === props.targetUserId && data.FromId === getUserId())) {
					setMessages((prevState: IMessage[]) => ([ ...prevState, data ]))
					setTimeout(() => {
						chatContainer.scrollTop = chatContainer.scrollHeight
					}, 500)
				}
			})

		return () => {
			console.log("Desligou")
			if (socket) socket.off("message")
		}
	}, [socket])
	//#endregion

	//#region Functions
	const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const userId = Number(getUserId())
		console.log("O id do usuário local é:" + userId)
		if (!socket || !userId) return

		const messageToSend: IMessage = {
			FromId: userId,
			ToId: props.targetUserId,
			Message: message.trim(),
			id: 0,
			FriendshipId: props.friendshipId
		}

		socket.timeout(4000).emit("message", messageToSend, (error: unknown, response: unknown) => {
			if (error) console.log(error)
			else console.log(response)
		})
		setMessage("")
	}

	const close = () => {
		console.log("Fechando o chat")
		closeChat(props.chatId)
	}

	const minimize = () => {
		console.log("Minimizando o chat")
		const value = !isMinimized
		toggleMinimizeChat(props.chatId, value)
		setIsMinimized(value)
	}

	const onClickOnHeaderElement = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		console.log(isMinimized)
		if (closeElementRef.current?.contains(e.target as Node)) close()
		else minimize()
	}
	const onFocusTextArea = () => setTextAreaFocused(true)
	const onBlurTextArea = () => setTextAreaFocused(false)

	const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && e.shiftKey === false && textAreaFocused) buttonSubmitMessageElementRef.current?.click()
	}

	//#endregion
	return (
		<div className={styles.content} id={props.chatId}>
			<div className={styles.content__header} onClick={onClickOnHeaderElement} ref={headerElementRef}>
				<span>{props.targetNickname}</span>
				<div ref={closeElementRef}>
					<GrClose />
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
