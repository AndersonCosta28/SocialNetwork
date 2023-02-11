import React from "react"
import ErrorPage from "Pages/ErrorPage"
import { RouteObject } from "react-router-dom"
import styles from "./feed.module.css"
import OnlineFriendsSideBar from "Components/FriendsSideBar"
import MyProfileSideBar from "Components/MyProfileSideBar"
import { useProtected } from "Context/ProtectedContext"
import Post from "Components/Post"
import WriteAnPost from "Components/WriteAnPost"
import { IPost } from "common"

const Feed = () => {
	const { myProfile, allPosts } = useProtected()
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
				<WriteAnPost />
				{allPosts.map((post: IPost, index: number) => <Post post={post} key={"Post -> " + index} />)

				}
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
