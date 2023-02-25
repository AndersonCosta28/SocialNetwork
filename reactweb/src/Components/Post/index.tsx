import Avatar from "Components/Avatar"
import React from "react"
import styles from "./Post.module.css"
import { BiLike } from "react-icons/bi"
import { BsChatLeft } from "react-icons/bs"
import { RiShareForwardLine } from "react-icons/ri"
import { IFiles, getAxiosErrorMessage, IPost, TypePostReactions, IPostReactions } from "common"
import { timeSince } from "utils"
import { API_AXIOS } from "Providers/axios"
import { useProtected } from "Context/ProtectedContext"
import { toast } from "react-hot-toast"
import { usePostContext } from "Context/PostContext"
import ReactLoading from "react-loading"
import { postDefault } from "consts"
import Skeleton from "react-loading-skeleton"
import "react-loading-skeleton/dist/skeleton.css"

const Post = (props: { post: IPost }) => {
	const { myProfile } = useProtected()
	const { handleMaximizePost, handleModalPostComment, post: postOnContext } = usePostContext()
	const [post, setPost] = React.useState<IPost>(postDefault)
	const [show, setShow] = React.useState(false)

	React.useEffect(() => {
		API_AXIOS.get<IPost>("/post/" + props.post.id)
			.then((res) => {
				setPost(res.data)
				updateInfo(res.data)
				setShow(true)
			})
			.catch((error) => {
				toast.error(getAxiosErrorMessage(error))
			})
	}, [])

	React.useEffect(() => {
		if (postOnContext.id === post.id) updateInfo(post)
	}, [postOnContext])

	const updateInfo = (_post: IPost) => {
		setNumberOfComments(_post.Comments.length)
		setNumberOfReactions(_post.Reactions.length)
		setIWasReact(_post.Reactions.some((react) => react.Profile.id === myProfile.id))
	}

	const Images = (): JSX.Element => {
		const attachamentsLength = post.Attachments.length
		let Component: JSX.Element = <></>
		const subComponents: JSX.Element[] = []
		if (attachamentsLength > 2) {
			for (let index = 1; index < attachamentsLength; index++) {
				let element = <></>
				if (index === 3 && attachamentsLength > 3) {
					element = (
						<div key={`More photos from post ${post.id} `} style={{ width: "100%", height: "33%", display: "flex", justifyContent: "center", alignItems: "center" }}>
							<span> {`+${attachamentsLength - 3} photos`}</span>
						</div>
					)
					subComponents.push(element)
					break
				}

				element = (
					<div key={`Post ${post.id} attachament ${index}`} style={{ maxWidth: "100%", height: attachamentsLength === 3 ? "50%" : "33%", overflow: "hidden" }}>
						<img onClick={() => handleMaximizePost(true, index, post)} className={styles.post__body__image} src={`data:${post.Attachments[index].type};base64, ${post.Attachments[index].base64}`} alt="" />
					</div>
				)
				subComponents.push(element)
			}

			Component = (
				<div style={{ height: 500, overflow: "hidden", display: "flex", alignItems: "center", flexDirection: "row", width: "100%" }}>
					<div style={{ width: "50%" }}>
						<img
							key={`Post ${post.id} attachament ${0}`}
							style={{ width: "100%" }}
							onClick={() => handleMaximizePost(true, 0, post)}
							className={styles.post__body__image}
							src={`data:${post.Attachments[0].type};base64, ${post.Attachments[0].base64}`}
							alt=""
						/>
					</div>
					<div style={{ width: "50%", display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>{subComponents}</div>
				</div>
			)
			return Component
		}
		else if (attachamentsLength === 2)
			return (
				<div className="flex_row_center_center">
					<img
						key={`Post ${post.id} attachament ${0}`}
						style={{ width: "50%" }}
						onClick={() => handleMaximizePost(true, 0, post)}
						className={styles.post__body__image}
						src={`data:${post.Attachments[0].type};base64, ${post.Attachments[0].base64}`}
						alt=""
					/>
					<img
						key={`Post ${post.id} attachament ${1}`}
						style={{ width: "50%" }}
						onClick={() => handleMaximizePost(true, 1, post)}
						className={styles.post__body__image}
						src={`data:${post.Attachments[1].type};base64, ${post.Attachments[1].base64}`}
						alt=""
					/>
				</div>
			)
		else if (attachamentsLength === 1) return <img onClick={() => handleMaximizePost(true, 0, post)} className={styles.post__body__image} src={`data:${post.Attachments[0].type};base64, ${post.Attachments[0].base64}`} alt="" />
		else return <></>
	}
	//#region Reactions

	const [numberOfReactions, setNumberOfReactions] = React.useState(post.Reactions.length)

	const [iWasReact, setIWasReact] = React.useState<boolean>(false)
	const reactAnPost = (unReact = false) => {
		const body: {
			idPost: number,
			idProfile: number,
			typeReact?: TypePostReactions
		} = { idPost: post.id, idProfile: myProfile.id }
		if (!unReact) body.typeReact = TypePostReactions.Like
		API_AXIOS.post<IPostReactions[]>("/postreactions", {
			idPost: post.id,
			typeReact: TypePostReactions.Like,
			idProfile: myProfile.id,
		})
			.then((res) => {
				setIWasReact(!unReact)
				post.Reactions = res.data
				setPost(post)
				updateInfo(post)
			})
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
	}

	//#endregion

	//#region Comments
	const [numberOfComments, setNumberOfComments] = React.useState(post.Comments.length)

	//#endregion

	//#region Description
	const [showFullDescription, setShowFullDescription] = React.useState(false)
	const handleShowFullDescription = () => setShowFullDescription(!showFullDescription)
	const maxLengthText = 200
	const Description = (
		<span style={{ whiteSpace: "pre-line" }}>
			{post.Text.length > maxLengthText && showFullDescription ? post.Text.trim() : post.Text.slice(0, maxLengthText).trim()} <br />{" "}
			{post.Text.length > maxLengthText ? (
				<span className="span__ExpandText" onClick={handleShowFullDescription}>
					{showFullDescription ? "Read less..." : "Read more..."}
				</span>
			) : null}
		</span>
	)

	//#endregion

	return (
		//style={{ opacity: show ? 1 : 0, height: show ? "auto" : "none" }}
		<div className={styles.post}>
			<div className={styles.post__header}>
				{!show ? (
					<>
						<Skeleton circle={true} height={30} width={30}></Skeleton>
					</>
				) : (
					<>
						<Avatar base64={(post.Profile.Avatar as IFiles).base64} size={30} type={(post.Profile.Avatar as IFiles).type} />
						<div>
							<span className={styles.post__header__nickname}>{post.Profile.Nickname}</span>
							{" - "}
							<span className={styles.post__header__time}>{timeSince(new Date(post.CreateAt))}</span>
						</div>
					</>
				)}
			</div>
			{!show ? (
				<div className="flex_column_center_center" style={{ borderRadius: 10, width: "100%" }}>
					<ReactLoading type={"spinningBubbles"} color={"red"} />
				</div>
			) : (
				<>
					<div className={styles.post__body}>
						{post.Text.trim().length > 0 ? <p className={styles.post__body__text}>{Description}</p> : null}
						{post.Attachments.length > 0 && (
							<div className="flex_column_center_center" style={{ borderRadius: 10, width: "100%" }}>
								<Images />
							</div>
						)}
					</div>
					<div className={styles.post__footer}>
						<div className={`${styles.post__footer__numbers}`}>
							<div>
								<BiLike />
								<span>{`${numberOfReactions} Likes`}</span>
							</div>
							<div>
								<BsChatLeft />
								<span>{`${numberOfComments} Comments`}</span>
							</div>
							<div>
								<RiShareForwardLine />
								<span>x Shared</span>
							</div>
						</div>
						<hr style={{ margin: 10 }} />

						<div className={styles.post__footer__buttons}>
							{iWasReact ? (
								<div className={styles.post__footer__buttons__react__unlike} onClick={() => reactAnPost(true)}>
									<BiLike />
									<span>Like</span>
								</div>
							) : (
								<div className={styles.post__footer__buttons__react__like} onClick={() => reactAnPost()}>
									<BiLike />
									<span>Like</span>
								</div>
							)}
							<div onClick={() => handleModalPostComment(true, post)} className={styles.post__footer__buttons__comments}>
								<BsChatLeft />
								<span>Comments</span>
							</div>
							<div className={styles.post__footer__buttons__share}>
								<RiShareForwardLine />
								<span>Share</span>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	)
}

export default Post
