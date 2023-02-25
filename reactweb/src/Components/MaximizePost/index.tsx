import React from "react"
import { IFiles } from "common"
import Avatar from "Components/Avatar"
import PostComments from "Components/PostComments"
import WriteAComment from "Components/WriteAComment"
import { usePostContext } from "Context/PostContext"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { IoClose } from "react-icons/io5"
import styles from "./MaximizePost.module.css"

const MaximizePost = () => {
	const { photoNumber, post, handleMaximizePost, setPhotoNumber } = usePostContext()
	const  {base64: avatarBase64, type: avatarType } = post.Profile.Avatar as IFiles
	return (
		<div className={styles.MaximizePost}>
			<IoClose color="white" onClick={() => handleMaximizePost(false)} size={50} className={styles.MaximizePost__leftSide__icon__closePost} />
			<div className={styles.MaximizePost__leftSide}>
				{photoNumber !== 0 ? <IoIosArrowBack size={50} color="white" className={styles.MaximizePost__leftSide__arrow} onClick={() => setPhotoNumber(photoNumber - 1)} /> : null}
				<div style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}>
					<img className={styles.MaximizePost__leftSide__img} src={`data:${post.Attachments[photoNumber].type};base64, ${post.Attachments[photoNumber].base64}`} />
				</div>
				{photoNumber !== post.Attachments.length - 1 ? <IoIosArrowForward size={50} color="white" className={styles.MaximizePost__leftSide__arrow} onClick={() => setPhotoNumber(photoNumber + 1)} /> : null}
			</div>
			<div className={styles.MaximizePost__rightSide}>
				<div className={styles.MaximizePost__rightSide__header}>
					<Avatar base64={avatarBase64} type={avatarType} size={50} />
					<div>
						<span className={styles.MaximizePost__rightSide__header__nickName}>{post.Profile.Nickname}</span>
						<br />
						<span className={styles.MaximizePost__rightSide__header__date}>{new Date(post.CreateAt).toLocaleString()}</span>
					</div>
				</div>
				<hr style={{ margin: "10px " }} />
				<div className={styles.MaximizePost__rightSide__body}>
					<p className={styles.MaximePost__rightSide__body__postText}>{post.Text}</p>
					<WriteAComment />
					<PostComments />
				</div>
			</div>
		</div>
	)
}

export default MaximizePost
