import React from "react"
import ErrorPage from "../ErrorPage"
import { RouteObject } from "react-router-dom"
import styles from "./feed.module.css"
import TextareaAutosize from "react-textarea-autosize"
import OnlineFriendsSideBar from "../../Components/OnlineFriendsSideBar"
import MyProfileSideBar from "../../Components/MyProfileSideBar"

const Feed = () => {
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
					<TextareaAutosize maxRows={10} id={styles.WritePost__TextArea} ref={textAreaWritePost} placeholder="Write a post..." onChange={handlerTextPost} />
					<div id={styles.WritePost__Options}>
						<input type="button" value="send" className="blueButton" />
					</div>
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
