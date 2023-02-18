import React from "react"
import ErrorPage from "Pages/ErrorPage"
import { RouteObject } from "react-router-dom"
import styles from "./feed.module.css"
import OnlineFriendsSideBar from "Components/FriendsSideBar"
import MyProfileSideBar from "Components/MyProfileSideBar"
import Post from "Components/Post"
import { getAxiosErrorMessage, IPost } from "common"
import { useQuery } from "@tanstack/react-query"
import { getBase64FromBuffer, getUserId } from "utils"
import { toast } from "react-hot-toast"
import { API_AXIOS } from "Providers/axios"
import { useSocketIo } from "Context/SocketIoContext"
import InfiniteScroll from "react-infinite-scroll-component"
import { SlClose } from "react-icons/sl"
import ReactTextareaAutosize from "react-textarea-autosize"
import { AiFillPicture } from "react-icons/ai"
import ReactLoading from "react-loading"
import { IoClose } from "react-icons/io5"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import Avatar from "Components/Avatar"

const Feed = () => {
	//#region Function Maximize Posts
	const [currentPostToMaximize, setCurrentPostToMaximize] = React.useState<IPost | null>(null)
	const [currentPhotoNumber, setCurrentPhotoNumber] = React.useState(0)

	const getAvatarBuffer = () => {
		const { buffer, type } = currentPostToMaximize?.Profile.Avatar as { buffer: Buffer; type: string }
		return { buffer, type }
	}
	const [showPostMaximize, setShowPostMaximize] = React.useState(false)

	React.useEffect(() => {
		if (currentPostToMaximize)
			console.log(currentPhotoNumber + " / " + currentPostToMaximize.Attachments.length + " / " + (currentPhotoNumber !== currentPostToMaximize.Attachments.length - 1) )
	}, [currentPhotoNumber])

	const MaximizePost = currentPostToMaximize && (
		<div className={styles.MaximizePost}>
			<IoClose color="white" onClick={() => handleMaximizePost(false)} size={50} className={styles.MaximizePost__leftSide__icon__closePost} />
			<div className={styles.MaximizePost__leftSide}>
				{currentPhotoNumber !== 0 ? <IoIosArrowBack size={50} color="white" className={styles.MaximizePost__leftSide__arrow} onClick={() => setCurrentPhotoNumber(currentPhotoNumber - 1)} /> : null}
				<div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
					<img className={styles.MaximizePost__leftSide__img} src={`data:${currentPostToMaximize.Attachments[currentPhotoNumber].type};base64, ${getBase64FromBuffer(currentPostToMaximize.Attachments[currentPhotoNumber].buffer)}`} />
				</div>
				{currentPhotoNumber !== currentPostToMaximize.Attachments.length - 1 ? <IoIosArrowForward size={50} color="white" className={styles.MaximizePost__leftSide__arrow} onClick={() => setCurrentPhotoNumber(currentPhotoNumber + 1)} /> : null}				
			</div>
			<div className={styles.MaximizePost__rightSide}>
				<div className={styles.MaximizePost__rightSide__header}>
					<Avatar base64={getBase64FromBuffer(getAvatarBuffer().buffer)} type={getAvatarBuffer().type} size={50} />
					<div>
						<span className={styles.MaximizePost__rightSide__header__nickName}>{currentPostToMaximize.Profile.Nickname}</span>
						<br />
						<span className={styles.MaximizePost__rightSide__header__date}>{new Date(currentPostToMaximize.CreateAt).toLocaleString()}</span>
					</div>
				</div>
				<div className={styles.MaximizePost__rightSide__body}>
					<span>{currentPostToMaximize.Text}</span>
				</div>
			</div>
		</div>
	)

	const handleMaximizePost = (show: boolean, photoNumber = 0, post: IPost | null = null) => {		
		document.body.style.overflow = show ? "hidden" : "auto"
		setShowPostMaximize(show)
		setCurrentPostToMaximize(post)
		setCurrentPhotoNumber(photoNumber)
	}
	//#endregion

	//#region function to infinitescroll
	const [jsxPosts, setJsxPosts] = React.useState<JSX.Element[]>([])
	const [allPosts, setAllPosts] = React.useState<IPost[]>([])
	const [Posts, setPosts] = React.useState<IPost[]>([])
	const infiniteScrollRef = React.useRef(null)
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

	const [hasMore, setHasMore] = React.useState<boolean>(true)
	const NewPost = (post: IPost) => <Post post={post} key={"Post -> - " + Math.random()} handleMaximizePost={handleMaximizePost} />

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

	const InfiniteScrollComponent = (
		<InfiniteScroll
			ref={infiniteScrollRef}
			className={styles.body__midSide__infiniteScroll}
			style={{ padding: "0px 5px", overflow: "hidden" /*display: showPostMaximize && currentPostToMaximize ? "none" : "block" */}}
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

	//#region function to write an post
	const textAreaWritePost = React.useRef<HTMLTextAreaElement>(null)
	const [attachments, setAttachments] = React.useState<File[]>([])
	const [textPost, setTextPost] = React.useState<string>("")

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
			{ showPostMaximize && currentPostToMaximize ? MaximizePost : null }
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
				{isSuccess && allPosts.length === 0 && data.length === 0 ? <h1 style={{ textAlign: "center" }}>Nothing to show</h1> : InfiniteScrollComponent}				
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
