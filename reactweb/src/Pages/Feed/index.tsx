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
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const Feed = () => {
	const { allPosts } = useProtected()
	const [Posts, setPosts] = React.useState<IPost[]>([])
	const [jsxPosts, jsxSetPosts] = React.useState<JSX.Element[]>([])

	React.useEffect(() => {
		if (allPosts.length > 0) updatePosts([...allPosts], [...Posts], [...jsxPosts])
	}, [allPosts])

	const updatePosts = (_allPosts: IPost[], _oldPosts: IPost[], _oldJsxPosts: JSX.Element[]) => {
		const newPosts = _allPosts.splice(0, _allPosts.length - _oldPosts.length)
		newPosts.forEach((post: IPost, index: number) => {
			const element = <Post post={post} key={"Post -> " + index + " - " + Math.random()} />
			if (_oldPosts.length === 0) _oldJsxPosts.push(element)
			else _oldJsxPosts.unshift(element)
		})
		setPosts([..._oldPosts, ...newPosts])
		jsxSetPosts(_oldJsxPosts)
	}

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
				{jsxPosts.length > 0 ? jsxPosts : <Skeleton count={20} />}
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
