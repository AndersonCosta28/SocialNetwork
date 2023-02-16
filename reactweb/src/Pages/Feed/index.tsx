import React from "react"
import ErrorPage from "Pages/ErrorPage"
import { RouteObject } from "react-router-dom"
import styles from "./feed.module.css"
import OnlineFriendsSideBar from "Components/FriendsSideBar"
import MyProfileSideBar from "Components/MyProfileSideBar"
import Post from "Components/Post"
import { getAxiosErrorMessage, IPost } from "common"
import { useQuery } from "@tanstack/react-query"
import { getUserId } from "utils"
import { toast } from "react-hot-toast"
import { API_AXIOS } from "Providers/axios"
import { useSocketIo } from "Context/SocketIoContext"
import InfiniteScroll from "react-infinite-scroll-component"
import { SlClose } from "react-icons/sl"
import ReactTextareaAutosize from "react-textarea-autosize"
import { AiFillPicture } from "react-icons/ai"
import ReactLoading from "react-loading"

const Feed = () => {
	const [jsxPosts, setJsxPosts] = React.useState<JSX.Element[]>([])
	const [allPosts, setAllPosts] = React.useState<IPost[]>([])
	const [Posts, setPosts] = React.useState<IPost[]>([])
	const { socketId } = useSocketIo()
	const { isSuccess, data } = useQuery<IPost[]>({
		queryKey: ["posts_feed", socketId],
		queryFn: () => API_AXIOS.get("/post/findAllFromFriends/" + getUserId()).then((res) => res.data),
		onError: (error: unknown) => toast.error(getAxiosErrorMessage(error)),
		onSuccess: (data: IPost[]) => setAllPosts(data),
		enabled: !!socketId,
		// initialData: [],
		refetchOnMount: true,
	})

	const textAreaWritePost = React.useRef<HTMLTextAreaElement>(null)
	const [textPost, setTextPost] = React.useState<string>("")
	const [attachments, setAttachments] = React.useState<File[]>([])

	React.useEffect(() => {
		if (data)
			if (data.length > 0 && allPosts.length === 0) setAllPosts(data)
			else if (allPosts.length > 0) updatePosts([...allPosts], [...Posts])
	}, [allPosts, data])

	const updatePosts = (_allPosts: IPost[], _oldPosts: IPost[]) => {
		if (Posts.length === 0 && jsxPosts.length === 0) {
			const newPosts = _allPosts.splice(_oldPosts.length, _allPosts.length - _oldPosts.length)
			React.startTransition(() => {
				setPosts([..._oldPosts, ...newPosts])
				getMorePosts(newPosts)
			})
		}
		else {
			jsxPosts.unshift(NewPost(_allPosts[0]))
			setJsxPosts([...jsxPosts])
		}
	}
	//#region function to infinitescroll
	const [hasMore, setHasMore] = React.useState<boolean>(true)
	const NewPost = (post: IPost) => <Post post={post} key={"Post -> - " + Math.random()} />

	const next = () => {
		if (Posts.length === 0 && data != null && data.length > 0) setHasMore(false)
		else getMorePosts(Posts)
	}

	const getMorePosts = (posts: IPost[]) => {
		setTimeout(() => {
			const numberOfPostsToGet = posts.length >= 10 ? 10 : posts.length
			const newPosts = posts.splice(posts.length - numberOfPostsToGet, numberOfPostsToGet)
			React.startTransition(() => {
				setPosts([...posts])
				setJsxPosts([...jsxPosts.concat(newPosts.map(NewPost).reverse())])
			})
		}, 1000)
	}

	//#endregion

	//#region function to write an post
	const handlerTextPost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		React.startTransition(() => {
			const { value } = e.target
			setTextPost(value)
		})
		const textPost = textAreaWritePost.current as HTMLTextAreaElement
		const scrollHeigth = textPost.scrollHeight
		textPost.scrollTop = scrollHeigth
	}

	const handlerAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
		React.startTransition(() => {
			const { files } = e.target
			if (files === null) {
				toast.error("Nothing file selected")
				return
			}

			const newFiles = [].slice.call(files)
			if (newFiles.some((file: File) => file.size > 1000000)) toast.error("The maximum file size is 1MB")
			else setAttachments([...attachments, ...newFiles])
		})
	}

	const removeAttachment = (index: number) => {
		const _attachments = attachments
		_attachments.splice(index, 1)
		setAttachments([..._attachments])
	}

	const sendPost = () => {
		const formData = new FormData()
		const content = {
			Text: textPost,
		}
		for (const attachment of attachments) formData.append("Attachments", attachment)
		formData.append("Content", new Blob([JSON.stringify(content)], { type: "application/json" }))
		API_AXIOS({
			url: "/post/create/" + getUserId(),
			method: "post",
			headers: { "Content-Type": "multipart/form-data" },
			data: formData,
		})
			.then((res) => {
				const _allPosts = allPosts
				_allPosts.unshift(res.data)
				setAllPosts([..._allPosts])
			})
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
		setAttachments([])
		setTextPost("")
	}

	const ListOfAttachments = attachments.map((attachment: File, index: number) => (
		<div style={{ border: "1px solid black", width: 100, height: 100, position: "relative" }} key={"attachament-" + index}>
			<SlClose id={styles.WritePost__Attachments__RemoveAttachemnt} onClick={() => removeAttachment(index)} />
			<img src={URL.createObjectURL(attachment)} alt={"attachament-" + index} width={100} height={100} />
		</div>
	))
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
				<div id={styles.WritePost} style={{ margin: "20px 5px 0px 5px" }}>
					<ReactTextareaAutosize maxRows={10} id={styles.WritePost__TextArea} ref={textAreaWritePost} placeholder="Share your thoughts" value={textPost} onChange={handlerTextPost} />
					{/* <textarea style={{maxHeight: 100}} id={styles.WritePost__TextArea} ref={textAreaWritePost} placeholder="Share your thoughts" value={textPost} onChange={handlerTextPost} /> */}
					<div id={styles.WritePost_Attachments}>{ListOfAttachments}</div>
					<div id={styles.WritePost__Options}>
						<label htmlFor="attach_photo">
							<AiFillPicture size={30} />
						</label>
						<input type="file" style={{ display: "none" }} id="attach_photo" accept="image/*" multiple onChange={handlerAttachments} />
						{/* <label htmlFor="attach_video">
						<RiMovieFill size={30} />
					</label>
					<input type="file" style={{ display: "none" }} id="attach_video" accept="video/*" multiple /> */}
						<input type="button" value="send" className="blueButtonActive" onClick={sendPost} />
					</div>
				</div>
				{/* <div style={{ width: "30%", margin: "auto" }}>
					<ReactLoading color="red" type="bubbles" height={100} width={100} />
				</div> */}
				{isSuccess && allPosts.length === 0 && data.length === 0 ? (
					<h1 style={{ textAlign: "center" }}>Nothing to show</h1>
				) : (
					<InfiniteScroll
						className={styles.body__midSide__infiniteScroll}
						style={{ padding: "0px 5px", overflowY: "hidden" }}
						dataLength={Posts.length}
						hasMore={hasMore}
						next={next}
						loader={
							<div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
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
