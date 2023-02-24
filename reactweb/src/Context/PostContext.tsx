import { useQuery, UseQueryResult } from "@tanstack/react-query"
import { getAxiosErrorMessage, IPost } from "common"
import { postDefault } from "consts"
import { API_AXIOS } from "Providers/axios"
import React from "react"
import { toast } from "react-hot-toast"
import { useProtected } from "./ProtectedContext"
import { useSocketIo } from "./SocketIoContext"

interface IPostProvider {
	allPosts: IPost[]
	setAllPosts: React.Dispatch<React.SetStateAction<IPost[]>>
	queryAllPosts: UseQueryResult<IPost[], unknown>
	post: IPost
	setPost: React.Dispatch<React.SetStateAction<IPost>>
	photoNumber: number
	setPhotoNumber: React.Dispatch<React.SetStateAction<number>>
	handleMaximizePost: (show: boolean, photoNumber?: number, post?: IPost) => void
	handleModalPostComment: (show: boolean, post?: IPost) => void
	showPostMaximize: boolean
	showModalPostComment: boolean
}

const PostContext = React.createContext<IPostProvider | null>(null)

export const PostProvider = ({ children }: { children: React.ReactNode }) => {
	const [post, setPost] = React.useState<IPost>(postDefault)
	//#region Function Maximize Posts
	const [photoNumber, setPhotoNumber] = React.useState(0)
	const [showPostMaximize, setShowPostMaximize] = React.useState(false)
	const handleMaximizePost = (show: boolean, photoNumber = 0, post: IPost = postDefault) => {
		document.body.style.overflow = show ? "hidden" : "auto"
		setShowPostMaximize(show)
		setPost(post)
		setPhotoNumber(photoNumber)
	}
	//#endregion

	//#region ModalPostComment

	const [showModalPostComment, setShowModalPostComment] = React.useState(false)
	const handleModalPostComment = (show: boolean, post: IPost = postDefault) => {
		document.body.style.overflow = show ? "hidden" : "auto"
		setShowModalPostComment(show)
		setPost(post)
	}
	//#endregion

	//#region allPosts
	const { socketId } = useSocketIo()
	const { myProfile } = useProtected()
	const [allPosts, setAllPosts] = React.useState<IPost[]>([])

	const queryAllPosts = useQuery<IPost[]>({
		queryKey: [socketId],
		queryFn: () => API_AXIOS.get("/post/findAllFromFriends/" + myProfile.id).then((res) => res.data),
		onError: (error: unknown) => toast.error(getAxiosErrorMessage(error)),
		onSuccess: (data) => {
			console.log("CHamou a query de todos os posts")
			setAllPosts(data)
		},
		enabled: !!socketId && allPosts.length === 0,
		cacheTime: 0
	})
	//#endregion

	const values = { allPosts, setAllPosts, queryAllPosts, post, setPost, handleMaximizePost, handleModalPostComment, photoNumber, showPostMaximize, showModalPostComment, setPhotoNumber }
	return <PostContext.Provider value={values}>{children}</PostContext.Provider>
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const usePostContext = () => React.useContext(PostContext)!
