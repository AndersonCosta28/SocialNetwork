import React from "react"
import ErrorPage from "Pages/ErrorPage"
import { RouteObject } from "react-router-dom"
import styles from "./feed.module.css"
import OnlineFriendsSideBar from "Components/FriendsSideBar"
import MyProfileSideBar from "Components/MyProfileSideBar"
import Post from "Components/Post"
import WriteAnPost from "Components/WriteAnPost"
import { getAxiosErrorMessage, IPost } from "common"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"
import { useQuery } from "@tanstack/react-query"
import { getUserId } from "utils"
import { toast } from "react-hot-toast"
import { API_AXIOS } from "Providers/axios"
import { useSocketIo } from "Context/SocketIoContext"
import InfiniteScroll from "react-infinite-scroll-component"

const Feed = () => {
	const [allPosts, setAllPosts] = React.useState<IPost[]>([])
	const [Posts, setPosts] = React.useState<IPost[]>([])

	const { socketId } = useSocketIo()
	const { isLoading } = useQuery({
		queryKey: ["posts_feed", socketId],
		queryFn: () => API_AXIOS.get("/post/findAllFromFriends/" + getUserId()).then((res) => res.data),
		onError: (error: unknown) => toast.error(getAxiosErrorMessage(error)),
		onSuccess: (data: IPost[]) => setAllPosts(data),
		enabled: !!socketId,
	})

	React.useEffect(() => {
		if (allPosts.length > 0) updatePosts([...allPosts], [...Posts])
	}, [allPosts])

	const updatePosts = (_allPosts: IPost[], _oldPosts: IPost[]) => {		
		if (Posts.length === 0 && jsxPosts.length === 0) {
			const newPosts = _allPosts.splice(_oldPosts.length, _allPosts.length - _oldPosts.length)
			setPosts([..._oldPosts, ...newPosts])
			getMorePosts(newPosts)
		}
		else {
			jsxPosts.unshift(NewPost(_allPosts[0]))
			setJsxPosts([...jsxPosts])
		}
		console.log(jsxPosts.length)
	}
	//#region function to infinitescroll
	const [jsxPosts, setJsxPosts] = React.useState<JSX.Element[]>([])
	const [hasMore, setHasMore] = React.useState<boolean>(true)
	const NewPost = (post: IPost) => <Post post={post} key={"Post -> - " + Math.random()} />

	const next = () => {
		if (Posts.length === 0) setHasMore(false)
		else getMorePosts(Posts)
	}

	const getMorePosts = (posts: IPost[]) => {		
		setTimeout(() => {
			const numberOfPostsToGet = posts.length >= 10 ? 10 : posts.length
			const newPosts = posts.splice(posts.length - numberOfPostsToGet, numberOfPostsToGet)
			setPosts([...posts])
			setJsxPosts([...jsxPosts.concat(newPosts.map(NewPost).reverse())])
		}, 1000)
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
				<WriteAnPost allPosts={allPosts} setAllPosts={setAllPosts} />
				{isLoading ? (
					<div style={{ padding: 20 }} className={styles.body__midSide__Skeleton}>
						<Skeleton count={20} />
					</div>
				) : Posts.length === 0 && jsxPosts.length === 0 ? (
					<h1 style={{ textAlign: "center" }}>Nothing to show</h1>
				) : (
					<InfiniteScroll
						className={styles.body__midSide__infiniteScroll}
						style={{ padding: "0px 5px", overflow: "hidden auto" }}
						dataLength={Posts.length}
						hasMore={hasMore}
						next={next}
						loader={<h4>Loading...</h4>}
						endMessage={
							<p style={{ textAlign: "center" }}>
								<b>Yay! You have seen it all</b>
							</p>
						}
					>
						{jsxPosts}
					</InfiniteScroll>
				)}
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
