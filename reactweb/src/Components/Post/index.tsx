import Avatar from "Components/Avatar"
import React from "react"
import styles from "./Post.module.css"
import { BiLike } from "react-icons/bi"
import { BsChatLeft } from "react-icons/bs"
import { RiShareForwardLine } from "react-icons/ri"
import { IPost } from "common"
import { getBase64FromBuffer, timeSince } from "utils"
import { Buffer } from "buffer"

const Post = (props: { post: IPost }) => {
	const { buffer: avatarBuffer, type: avatarType } = props.post.Profile.Avatar as { buffer: Buffer; type: string }
	const [show, setShow] = React.useState(false)
	React.useEffect(() => {
		setTimeout(() => setShow(true), 1000)
	}, [])

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
				<div className="flex_column_center_center" style={{ backgroundColor: "black", borderRadius: 10, width: "100%" }}>
					{props.post.Attachments.length > 0 && <img className={styles.post__body__image} src={`data:${props.post.Attachments[0].type};base64, ${getBase64FromBuffer(props.post.Attachments[0].buffer)}`} alt="" />}
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
