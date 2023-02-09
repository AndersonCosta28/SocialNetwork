import React from "react"
import ErrorPage from "Pages/ErrorPage"
import { RouteObject } from "react-router-dom"
import styles from "./feed.module.css"
import TextareaAutosize from "react-textarea-autosize"
import OnlineFriendsSideBar from "Components/FriendsSideBar"
import MyProfileSideBar from "Components/MyProfileSideBar"
import Avatar from "Components/Avatar"
import { useProtected } from "Context/ProtectedContext"

const Feed = () => {
	const { myProfile } = useProtected()
	//#region Arrow options

	const textAreaWritePost = React.useRef<HTMLTextAreaElement>(null)
	const [, setTextPost] = React.useState<string>("")

	const handlerTextPost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target
		setTextPost(value)

		const textPost = textAreaWritePost.current as HTMLTextAreaElement
		const scrollHeigth = textPost.scrollHeight
		textPost.scrollTop = scrollHeigth
	}

	//#endregion
	return (
		<div id={styles.body}>
			<div id={styles.body__leftSide}>
				<div>
					<MyProfileSideBar />
					{/* <h2 className={styles.body__leftSide__list__title}>Menu</h2>
				<p className={styles.body__leftSide__list__item}>
					<AiFillHome size={20} className={styles.body__leftSide__list__item__icon} />
					<span className={styles.body__leftSide__list__item__text}>Home</span>
				</p>
				<p className={styles.body__leftSide__list__item}>
					<IoPerson size={20} className={styles.body__leftSide__list__item__icon} />
					<span className={styles.body__leftSide__list__item__text}>Profile</span>
				</p> */}
				</div>
			</div>

			<div id={styles.body__midSide}>
				<div id={styles.WritePost}>
					<TextareaAutosize maxRows={10} id={styles.WritePost__TextArea} ref={textAreaWritePost} placeholder="Share your thoughts" onChange={handlerTextPost} />
					<div id={styles.WritePost__Options}>
						<input type="button" value="send" className="blueButtonActive" />
					</div>
				</div>
				<div className={`${styles.post}`}>
					<div className={`${styles.post__header}`}>
						<Avatar base64={myProfile.AvatarBase64} size={30} type={myProfile.AvatarType} />
						<div>
							<span className={styles.post__header__nickname}>{myProfile.Nickname}</span>
							{" - "}
							<span className={styles.post__header__time}>Há uma hora</span>
						</div>
					</div>
					<div className={`${styles.post__body} flex_column_center_center`} style={{backgroundColor: "black", borderRadius: 10}}>
						<img style={{ width: "auto", maxHeight: "700px" }} src={require("../../Assets/bonfire.jfif")} alt="" />
					</div>
					<div className={styles.post__footer}></div>
				</div>
			</div>

			<div id={styles.body__rigthSide}>
				<OnlineFriendsSideBar />
			</div>
		</div>
	)
}

export const FeedRoute: RouteObject = {
	path: "",
	element: <Feed />,
	errorElement: <ErrorPage />,
}

export default Feed
