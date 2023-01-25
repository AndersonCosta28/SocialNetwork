import React, { ReactNode } from "react"
import { onClickOutSideComponent } from "../../utils"
import { MdOutlineNotificationsNone } from "react-icons/md"
import { IoIosArrowDown } from "react-icons/io"
import ModalArrowOptions from "../../Components/ModalArrowOptions" 
import DataList from "../../Components/DataList"
import styles from "./HomePage.module.css"
import ChatBox from "../../Components/ChatBox"
import { IChat, useChat } from "../../Context/ChatContext"
import { useNavigate } from "react-router-dom"

const HomePage = ({ children }: { children: ReactNode }) => {

	//#region Hooks
	const [showArrowOptions, setShowArrowOptions] = React.useState<boolean>(false)
	const handlerShowArrowOptions = () => setShowArrowOptions(!showArrowOptions)
	const arrowOptionsRef = React.useRef<HTMLDivElement>(null)
	const { chats } = useChat()
	const navigate = useNavigate()

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

	const goToHomePage = () => navigate("/")

	return (
        
		<div id={styles.feed} onClick={onClickPage}>
			<div id={styles.header} className={`shadow_white`}>
				<div id={styles.header__leftSide}>
					<h1 onClick={goToHomePage} id={styles.header__leftSide__title}>Social Network</h1>
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
				{chats.map((chat: IChat, index: number) => <ChatBox friendshipId={chat.friendshipId} isMinimized={chat.isMinimized} chatId={chat.chatId} targetUserId={chat.targetUserId} targetNickname={chat.targetNickname} key={`${index}-chat`}/>)}
			</div>
		</div>
	)
}

export default HomePage