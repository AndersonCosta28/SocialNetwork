import Avatar from "Components/Avatar"
import React from "react"
import styles from "./Post.module.css"
import { BiLike } from "react-icons/bi"
import { BsChatLeft } from "react-icons/bs"
import { RiShareForwardLine } from "react-icons/ri"
import { getAxiosErrorMessage, IPost, TypePostReactions } from "common"
import { getAvatarFromProfile, getBase64FromBuffer, timeSince } from "utils"
import { API_AXIOS } from "Providers/axios"
import { useProtected } from "Context/ProtectedContext"
import { toast } from "react-hot-toast"
import { usePostContext } from "Context/PostContext"

interface PropsPost {
	post: IPost
}

const Post = (props: PropsPost) => {
	const { myProfile } = useProtected()
	const { handleMaximizePost, handleModalPostComment } = usePostContext()
	const { base64: avatarBase64, type: avatarType } = getAvatarFromProfile(props.post.Profile)
	const [show, setShow] = React.useState(false)

	React.useEffect(() => {
		setTimeout(() => setShow(true), 1000)
	}, [])

	const Images = (): JSX.Element => {
		const attachamentsLength = props.post.Attachments.length
		let Component: JSX.Element = <></>
		const subComponents: JSX.Element[] = []
		if (attachamentsLength > 2) {
			for (let index = 1; index < attachamentsLength; index++) {
				if (index === 3) break
				const element = (
					<div key={`Post ${props.post.id} attachament ${index}`} style={{ maxWidth: "100%", height: attachamentsLength === 3 ? "50%" : "33%", overflow: "hidden" }}>
						<img
							onClick={() => handleMaximizePost(true, index, props.post)}
							className={styles.post__body__image}
							src={`data:${props.post.Attachments[index].type};base64, ${getBase64FromBuffer(props.post.Attachments[index].buffer)}`}
							alt=""
						/>
					</div>
				)
				subComponents.push(element)
			}
			if (attachamentsLength > 3)
				subComponents.push(
					<div key={`More photos from post ${props.post.id} `} style={{ width: "100%", height: "33%", display: "flex", justifyContent: "center", alignItems: "center" }}>
						<span> {`+${attachamentsLength - 3} photos`}</span>
					</div>
				)
			Component = (
				<div style={{ height: 500, overflow: "hidden", display: "flex", alignItems: "center", flexDirection: "row", width: "100%" }}>
					<div style={{ width: "50%" }}>
						<img
							key={`Post ${props.post.id} attachament ${0}`}
							style={{ width: "100%" }}
							onClick={() => handleMaximizePost(true, 0, props.post)}
							className={styles.post__body__image}
							src={`data:${props.post.Attachments[0].type};base64, ${getBase64FromBuffer(props.post.Attachments[0].buffer)}`}
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
						key={`Post ${props.post.id} attachament ${0}`}
						style={{ width: "50%" }}
						onClick={() => handleMaximizePost(true, 0, props.post)}
						className={styles.post__body__image}
						src={`data:${props.post.Attachments[0].type};base64, ${getBase64FromBuffer(props.post.Attachments[0].buffer)}`}
						alt=""
					/>
					<img
						key={`Post ${props.post.id} attachament ${1}`}
						style={{ width: "50%" }}
						onClick={() => handleMaximizePost(true, 1, props.post)}
						className={styles.post__body__image}
						src={`data:${props.post.Attachments[1].type};base64, ${getBase64FromBuffer(props.post.Attachments[1].buffer)}`}
						alt=""
					/>
				</div>
			)
		else if (attachamentsLength === 1)
			return <img onClick={() => handleMaximizePost(true, 0, props.post)} className={styles.post__body__image} src={`data:${props.post.Attachments[0].type};base64, ${getBase64FromBuffer(props.post.Attachments[0].buffer)}`} alt="" />
		else return <></>
	}
	//#region Reactions

	const [numberOfReactions, setNumberOfReactions] = React.useState(props.post.Reactions.length)
	const [iWasReact, setIWasReact] = React.useState<boolean>(props.post.Reactions.some((react) => react.Profile.id === myProfile.id))
	const reactAnPost = (unReact = false) => {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const body = { idPost: props.post.id, idProfile: myProfile.id } as any
		if (!unReact) body.typeReact = TypePostReactions.Like
		API_AXIOS.post("/postreactions", {
			idPost: props.post.id,
			typeReact: TypePostReactions.Like,
			idProfile: myProfile.id,
		})
			.then(() => {
				if (unReact) {
					setIWasReact(false)
					setNumberOfReactions(numberOfReactions - 1)
				}
				else {
					setIWasReact(true)
					setNumberOfReactions(numberOfReactions + 1)
				}
			})
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
	}

	//#endregion

	//#region Comments
	const [numberOfComments /*, setNumberOfComments*/] = React.useState(props.post.Comments.length)

	//#endregion

	//#region Description
	const [showFullDescription, setShowFullDescription] = React.useState(false)
	const handleShowFullDescription = () => setShowFullDescription(!showFullDescription)
	const maxLengthText = 200
	const Description = (
		<span style={{ whiteSpace: "pre-line" }}>
			{props.post.Text.length > maxLengthText && showFullDescription ? props.post.Text.trim() : props.post.Text.slice(0, maxLengthText).trim()} <br />{" "}
			{props.post.Text.length > maxLengthText ? (
				<span className="span__ExpandText" onClick={handleShowFullDescription}>
					{showFullDescription ? "Read less..." : "Read more..."}
				</span>
			) : null}
		</span>
	)

	//#endregion

	//#region

	//#endregion

	return (
		<div className={styles.post} style={{ opacity: show ? 1 : 0, height: show ? "auto" : "none" }}>
			<div className={styles.post__header}>
				<Avatar base64={avatarBase64} size={30} type={avatarType} />
				<div>
					<span className={styles.post__header__nickname}>{props.post.Profile.Nickname}</span>
					{" - "}
					<span className={styles.post__header__time}>{timeSince(new Date(props.post.CreateAt))}</span>
				</div>
			</div>
			<div className={styles.post__body}>
				{props.post.Text.trim().length > 0 ? <p className={styles.post__body__text}>{Description}</p> : null}
				{props.post.Attachments.length > 0 && (
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
						<div className={styles.post__footer__buttons__react2} onClick={() => reactAnPost(true)}>
							<BiLike />
							<span>Like</span>
						</div>
					) : (
						<div className={styles.post__footer__buttons__react1} onClick={() => reactAnPost()}>
							<BiLike />
							<span>Like</span>
						</div>
					)}
					<div onClick={() => handleModalPostComment(true, props.post)} className={styles.post__footer__buttons__comments}>
						<BsChatLeft />
						<span>Comments</span>
					</div>
					<div className={styles.post__footer__buttons__share}>
						<RiShareForwardLine />
						<span>Share</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Post
