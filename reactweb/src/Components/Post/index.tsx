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
import ReactTextareaAutosize from "react-textarea-autosize"

const Post = (props: { post: IPost; handleMaximizePost: (show: boolean, photoNumber: number, post: IPost) => void }) => {
	const { myProfile } = useProtected()
	const { base64: avatarBase64, type: avatarType } = getAvatarFromProfile(props.post.Profile)
	const [show, setShow] = React.useState(false)
	const [numberOfReactions, setNumberOfReactions] = React.useState(props.post.Reactions.length)
	const [iWasReact, setIWasReact] = React.useState<boolean>(props.post.Reactions.some((react) => react.Profile.id === myProfile.id))

	React.useEffect(() => {
		setTimeout(() => setShow(true), 1000)
	}, [])

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
							onClick={() => props.handleMaximizePost(true, index, props.post)}
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
							onClick={() => props.handleMaximizePost(true, 0, props.post)}
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
						onClick={() => props.handleMaximizePost(true, 0, props.post)}
						className={styles.post__body__image}
						src={`data:${props.post.Attachments[0].type};base64, ${getBase64FromBuffer(props.post.Attachments[0].buffer)}`}
						alt=""
					/>
					<img
						key={`Post ${props.post.id} attachament ${1}`}
						style={{ width: "50%" }}
						onClick={() => props.handleMaximizePost(true, 1, props.post)}
						className={styles.post__body__image}
						src={`data:${props.post.Attachments[1].type};base64, ${getBase64FromBuffer(props.post.Attachments[1].buffer)}`}
						alt=""
					/>
				</div>
			)
		else if (attachamentsLength === 1)
			return <img onClick={() => props.handleMaximizePost(true, 0, props.post)} className={styles.post__body__image} src={`data:${props.post.Attachments[0].type};base64, ${getBase64FromBuffer(props.post.Attachments[0].buffer)}`} alt="" />
		else return <></>
	}

	//#region Comments
	const [comment, setComment] = React.useState("")
	const [textAreaFocused, setTextAreaFocused] = React.useState<boolean>(false)
	const onFocusTextArea = () => setTextAreaFocused(true)
	const onBlurTextArea = () => setTextAreaFocused(false)
	const buttonSubmitMessageElementRef = React.useRef<HTMLInputElement>(null)
	const textAreaElementRef = React.useRef<HTMLTextAreaElement>(null)

	const onEnterPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && e.shiftKey === false && textAreaFocused) buttonSubmitMessageElementRef.current?.click()
	}

	const SendComment = () => {
		console.log("Teste")
		API_AXIOS.post("/postComments", {
			idPost: props.post.id,
			idProfileSource: myProfile.id,
			text: comment,
		})
			.then(() => {
				toast.success("Deu bom")
				setComment("")
			})
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
	}

	//#endregion
	
	//#region Description
	const [showFullDescription, setShowFullDescription] = React.useState(false)
	const handleShowFullDescription = () => setShowFullDescription(!showFullDescription)
	const maxLengthText = 200
	const Description = (
		<span>
			{props.post.Text.length > maxLengthText && showFullDescription ? props.post.Text : props.post.Text.slice(0, maxLengthText)} <br /> {props.post.Text.length > maxLengthText ? <span className="span__ExpandText" onClick={handleShowFullDescription}>{showFullDescription ? "Read less..." : "Read more..."}</span> : null}
		</span>
	)

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
				<p className={styles.post__body__text}>{Description}</p>
				<div className="flex_column_center_center" id="teste" style={{ borderRadius: 10, width: "100%" }}>
					<Images />
				</div>
			</div>
			<div className={styles.post__footer}>
				<div className={`${styles.post__footer__numbers}`}>
					<div>
						<BiLike />
						<span>{`${numberOfReactions} Likes`}</span>
					</div>
					<div>
						<BsChatLeft />
						<span>x Comments</span>
					</div>
					<div>
						<RiShareForwardLine />
						<span>x Shared</span>
					</div>
				</div>
				<hr style={{ margin: 10 }} />
				<div className={styles.post__footer__writeAnComment}>
					<Avatar base64={myProfile.AvatarBase64} type={myProfile.AvatarType} size={20} />
					<ReactTextareaAutosize
						maxRows={10}
						name="writeAComment"
						id="writeAComment"
						placeholder="Write a comment"
						ref={textAreaElementRef}
						onBlur={onBlurTextArea}
						onFocus={onFocusTextArea}
						onKeyDown={onEnterPress}
						onChange={(e) => setComment(e.target.value)}
						defaultValue={comment}
					/>
					<input ref={buttonSubmitMessageElementRef} type="button" style={{ display: "none" }} onClick={SendComment} />
				</div>
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
					{/* <div className={styles.post__footer__buttons__comments}>
						<BsChatLeft />
						<span>Comments</span>
					</div> */}
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
