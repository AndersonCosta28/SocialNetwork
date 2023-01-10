import React, { ReactNode } from "react"
import { onClickOutSideComponent } from "../../utils"
import { MdOutlineNotificationsNone } from "react-icons/md"
import { IoIosArrowDown } from "react-icons/io"
import ModalArrowOptions from "../../Components/ModalArrowOptions" 
import DataList from "../../Components/DataList"
import styles from "./HomePage.module.css"
import ChatBox from "../../Components/ChatBox"
import { IChat, useChat } from "../../Context/ChatContext"

const HomePage = ({ children }: { children: ReactNode }) => {

	//#region Hooks
	const [showArrowOptions, setShowArrowOptions] = React.useState<boolean>(false)
	const handlerShowArrowOptions = () => setShowArrowOptions(!showArrowOptions)
	const arrowOptionsRef = React.useRef<HTMLDivElement>(null)
	const { chats } = useChat()

	React.useEffect(() => {
		if (arrowOptionsRef.current) {
			const arrowOptions = arrowOptionsRef.current as HTMLElement
			arrowOptions.style.backgroundColor = showArrowOptions ? "rgb(205, 205, 205)" : "inherit"
		}
	}, [showArrowOptions])
	//#endregion
    
	
	const onClickPage = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		onClickOutSideComponent(arrowOptionsRef.current, e.target as Node, () => showArrowOptions && handlerShowArrowOptions())
	}

	return (
        
		<div id={styles.feed} onClick={onClickPage}>
			<div id={styles.header} className={`shadow_white`}>
				<div id={styles.header__leftSide}>
					<h1>Social Network</h1>
				</div>
				<div id={styles.header__midSide}>
					<DataList />
				</div>
				<div id={styles.header__rightSide}>
					<MdOutlineNotificationsNone size={30} />
					{/* <BiMessage size={25} /> */}
					{/* <FiSettings size={25} /> */}
					{/* <IoPersonCircleOutline size={40} /> */}
					<div ref={arrowOptionsRef} onClick={handlerShowArrowOptions} id={styles.ArrowOptions} className="flex_row_center_center">
						<IoIosArrowDown size={25} color={showArrowOptions ? "blue" : "black"} />
					</div>
				</div>
			</div>
			{showArrowOptions ? <ModalArrowOptions /> : null}
			{children}
			<div id="chatContainer">
				{chats.map((chat: IChat, index: number) => <ChatBox isMinimized={chat.isMinimized} chatId={chat.chatId} userId={chat.userId} targetNickname={chat.targetNickname} targetSocketId={chat.targetSocketId} key={`${index}-chat`}/>)}
			</div>
		</div>
	)
}

export default HomePage