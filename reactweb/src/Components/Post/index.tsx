import Avatar from "Components/Avatar"
import React from "react"
import styles from "./Post.module.css"
import { BiLike } from "react-icons/bi"
import { BsChatLeft } from "react-icons/bs"
import { RiShareForwardLine } from "react-icons/ri"
import { IPost } from "common"
import { getBase64FromBuffer } from "utils"
import { Buffer } from "buffer"


const Post = (props: { post: IPost }) => {
	const { buffer: avatarBuffer, type: avatarType } = props.post.Profile.Avatar as { buffer: Buffer, type: string }
	return (
		<div className={`${styles.post}`}>
			<div className={`${styles.post__header}`}>
				<Avatar base64={getBase64FromBuffer(avatarBuffer)} size={30} type={avatarType} />
				<div>
					<span className={styles.post__header__nickname}>{props.post.Profile.Nickname}</span>
					{" - "}
					<span className={styles.post__header__time}>Há uma hora</span>
				</div>
			</div>
			<div className={styles.post__body}>
				<span>{props.post.Text}</span>
				<div className="flex_column_center_center" style={{ backgroundColor: "black", borderRadius: 10, width: "100%" }}>
					{
						props.post.Attachments.length > 0 &&
						<img className={styles.post__body__image} src={`data:${props.post.Attachments[0].type};base64, ${getBase64FromBuffer(props.post.Attachments[0].buffer)}`} alt="" />
					}
				</div>
			</div>
			<div className={styles.post__footer}>
				<div className={`${styles.post__footer__numbers}`}>
					<div>
						<BiLike size={20} />
						<span>x Likes</span>
					</div>
					<div>
						<BsChatLeft size={20} />
						<span>x Comments</span>
					</div>
					<div>
						<RiShareForwardLine size={20} />
						<span>x Shared</span>
					</div>
				</div>
				<hr style={{ margin: 10 }} />
				<div className={styles.post__footer__buttons}>
					<div>
						<BiLike size={30} />
						<span>Like</span>
					</div>
					<div>
						<BsChatLeft size={30} />
						<span>Comments</span>
					</div>
					<div>
						<RiShareForwardLine size={30} />
						<span>Share</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Post
