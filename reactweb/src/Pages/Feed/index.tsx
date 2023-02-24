import React from "react"
import ErrorPage from "Pages/ErrorPage"
import { RouteObject } from "react-router-dom"
import styles from "./feed.module.css"
import OnlineFriendsSideBar from "Components/FriendsSideBar"
import MyProfileSideBar from "Components/MyProfileSideBar"
import MaximizePost from "Components/MaximizePost"
import ModalCommentToPost from "Components/ModalCommentToPost"
import { usePostContext } from "Context/PostContext"
import InfniteScrollComponent from "Components/InfniteScrollComponent"
import WriteAPost from "Components/WriteAPost"

const Feed = () => {
	const { showModalPostComment, showPostMaximize } = usePostContext()

	return (
		<div id={styles.body}>
			{showPostMaximize ? <MaximizePost /> : null}
			{showModalPostComment ? <ModalCommentToPost /> : null}
			<div id={styles.body__leftSide}>
				<div className="compenentDefault">
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
				<WriteAPost />
				<InfniteScrollComponent />
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
