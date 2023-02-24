import { IPost } from "common"
import Post from "Components/Post"
import { usePostContext } from "Context/PostContext"
import React from "react"
import ReactLoading from "react-loading"
import InfiniteScroll from "react-infinite-scroll-component"

const InfniteScrollComponent = () => {
	//#region function to infinitescroll
	const { queryAllPosts, allPosts } = usePostContext()
	const { isSuccess } = queryAllPosts

	const [jsxPosts, setJsxPosts] = React.useState<JSX.Element[]>([])
	const [Posts, setPosts] = React.useState<IPost[]>([])
	const infiniteScrollRef = React.useRef(null)
	React.useEffect(() => {
		if (allPosts && allPosts.length > 0) {
			const localAllPost: IPost[] = []
			allPosts.forEach((_allpost) => {
				_allpost.Posts.forEach((post) => {
					localAllPost.push({ ...post, Profile: _allpost.Profile })
				})
			})
			updatePosts([...localAllPost], [...Posts])
		}
	}, [allPosts])

	const updatePosts = (_allPosts: IPost[], _oldPosts: IPost[]) => {
		if (Posts.length === 0 && jsxPosts.length === 0) {
			const newPosts = _allPosts.splice(_oldPosts.length, _allPosts.length - _oldPosts.length)
			setPosts([..._oldPosts, ...newPosts])
			getMorePosts(newPosts)
		}
		else
			React.startTransition(() => {
				jsxPosts.unshift(NewPost(_allPosts[0]))
				setJsxPosts([...jsxPosts])
			})
	}

	const [hasMore, setHasMore] = React.useState<boolean>(true)
	const NewPost = (post: IPost) => <Post post={post} key={"Post -> - " + Math.random()} />

	const next = () => {
		if (Posts.length === 0) setHasMore(false)
		else getMorePosts(Posts)
	}

	const getMorePosts = (posts: IPost[]) => {
		React.startTransition(() => {
			setTimeout(() => {
				const numberOfPostsToGet = posts.length >= 10 ? 10 : posts.length
				const newPosts = posts.splice(posts.length - numberOfPostsToGet, numberOfPostsToGet)
				setPosts([...posts])
				setJsxPosts([...jsxPosts.concat(newPosts.map(NewPost).reverse())])
			}, 1000)
		})
	}

	const Render = (
		<InfiniteScroll
			ref={infiniteScrollRef}
			style={{ padding: "0px 10px", overflow: "hidden" /*display: showPostMaximize && currentPostToMaximize ? "none" : "block" */ }}
			dataLength={Posts.length}
			hasMore={hasMore}
			next={next}
			loader={
				<div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
					<ReactLoading color="red" type="bubbles" height={100} width={100} />
				</div>
			}
			endMessage={
				<p style={{ textAlign: "center" }}>
					<b>Yay! You have seen it all</b>
				</p>
			}
		>
			{jsxPosts}
		</InfiniteScroll>
	)

	//#endregion

	return <>{isSuccess && allPosts.length === 0 ? <h1 style={{ textAlign: "center" }}>Nothing to show</h1> : Render}</>
}

export default InfniteScrollComponent
