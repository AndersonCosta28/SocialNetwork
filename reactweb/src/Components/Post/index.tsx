import { IProfileInfo } from "common"
import Avatar from "Components/Avatar"
import React from "react"
import styles from "./Post.module.css"
import { BiLike } from "react-icons/bi"
import { BsChatLeft } from "react-icons/bs"
import { RiShareForwardLine } from "react-icons/ri"

const Post = (props: { profile: IProfileInfo }) => (
	<div className={`${styles.post}`}>
		<div className={`${styles.post__header}`}>
			<Avatar base64={props.profile.AvatarBase64} size={30} type={props.profile.AvatarType} />
			<div>
				<span className={styles.post__header__nickname}>{props.profile.Nickname}</span>
				{" - "}
				<span className={styles.post__header__time}>Há uma hora</span>
			</div>
		</div>
		<div className={`${styles.post__body} flex_column_center_center`} style={{ backgroundColor: "black", borderRadius: 10 }}>
			<img style={{ width: "auto", maxHeight: "400px" }} src={require("../../Assets/bonfire.jfif")} alt="" />
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

export default Post
