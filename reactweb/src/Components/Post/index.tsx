import Avatar from "Components/Avatar"
import React from "react"
import styles from "./Post.module.css"
import { BiLike } from "react-icons/bi"
import { BsChatLeft } from "react-icons/bs"
import { RiShareForwardLine } from "react-icons/ri"
import { IPost } from "common"
import { getBase64FromBuffer, timeSince } from "utils"
import { Buffer } from "buffer"

const Post = (props: { post: IPost; handleMaximizePost: (show: boolean, photoNumber: number, post: IPost | null) => void }) => {
	const { buffer: avatarBuffer, type: avatarType } = props.post.Profile.Avatar as { buffer: Buffer; type: string }
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
						<img onClick={() => props.handleMaximizePost(true, index, props.post)} className={styles.post__body__image} src={`data:${props.post.Attachments[index].type};base64, ${getBase64FromBuffer(props.post.Attachments[index].buffer)}`} alt="" />
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
		else if (attachamentsLength === 1) return <img onClick={() => props.handleMaximizePost(true, 0, props.post)} className={styles.post__body__image} src={`data:${props.post.Attachments[0].type};base64, ${getBase64FromBuffer(props.post.Attachments[0].buffer)}`} alt="" />
		else return <></>
	}

	return (
		<div className={styles.post} style={{ opacity: show ? 1 : 0, height: show ? "auto" : "none" }}>
			<div className={styles.post__header}>
				<Avatar base64={getBase64FromBuffer(avatarBuffer)} size={30} type={avatarType} />
				<div>
					<span className={styles.post__header__nickname}>{props.post.Profile.Nickname}</span>
					{" - "}
					<span className={styles.post__header__time}>{timeSince(new Date(props.post.CreateAt))}</span>
				</div>
			</div>
			<div className={styles.post__body}>
				<p className={styles.post__body__text}>{props.post.Text}</p>
				<div className="flex_column_center_center" id="teste" style={{ borderRadius: 10, width: "100%" }}>
					<Images />
				</div>
			</div>
			<div className={styles.post__footer}>
				<div className={`${styles.post__footer__numbers}`}>
					<div>
						<BiLike />
						<span>x Likes</span>
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
				<div className={styles.post__footer__buttons}>
					<div>
						<BiLike />
						<span>Like</span>
					</div>
					<div>
						<BsChatLeft />
						<span>Comments</span>
					</div>
					<div>
						<RiShareForwardLine />
						<span>Share</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Post
