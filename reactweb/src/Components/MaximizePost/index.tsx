import Avatar from "Components/Avatar"
import PostComments from "Components/PostComments"
import WriteAComment from "Components/WriteAComment"
import { usePostContext } from "Context/PostContext"
import React from "react"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { IoClose } from "react-icons/io5"
import { avatarProfile, getBase64FromBuffer } from "utils"
import styles from "./MaximizePost.module.css"

const MaximizePost = () => {
	const { photoNumber, post, handleMaximizePost, setPhotoNumber } = usePostContext()

	return (
		<div className={styles.MaximizePost}>
			<IoClose color="white" onClick={() => handleMaximizePost(false)} size={50} className={styles.MaximizePost__leftSide__icon__closePost} />
			<div className={styles.MaximizePost__leftSide}>
				{photoNumber !== 0 ? <IoIosArrowBack size={50} color="white" className={styles.MaximizePost__leftSide__arrow} onClick={() => setPhotoNumber(photoNumber - 1)} /> : null}
				<div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
					<img className={styles.MaximizePost__leftSide__img} src={`data:${post.Attachments[photoNumber].type};base64, ${getBase64FromBuffer(post.Attachments[photoNumber].buffer)}`} />
				</div>
				{photoNumber !== post.Attachments.length - 1 ? <IoIosArrowForward size={50} color="white" className={styles.MaximizePost__leftSide__arrow} onClick={() => setPhotoNumber(photoNumber + 1)} /> : null}
			</div>
			<div className={styles.MaximizePost__rightSide}>
				<div className={styles.MaximizePost__rightSide__header}>
					<Avatar base64={avatarProfile(post).base64} type={avatarProfile(post).type} size={50} />
					<div>
						<span className={styles.MaximizePost__rightSide__header__nickName}>{post.Profile.Nickname}</span>
						<br />
						<span className={styles.MaximizePost__rightSide__header__date}>{new Date(post.CreateAt).toLocaleString()}</span>
					</div>
				</div>
				<hr style={{ margin: "10px " }} />
				<div className={styles.MaximizePost__rightSide__body}>
					<p>{post.Text}</p>
					<WriteAComment />
					<PostComments />
				</div>
			</div>
		</div>
	)
}

export default MaximizePost
