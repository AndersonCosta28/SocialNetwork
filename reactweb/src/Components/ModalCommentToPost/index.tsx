
import PostComments from "Components/PostComments"
import WriteAComment from "Components/WriteAComment"
import { usePostContext } from "Context/PostContext"
import React from "react"
import { IoClose } from "react-icons/io5"
import styles from "./ModalCommentToPost.module.css"

const ModalCommentToPost = () => {
	const { handleModalPostComment } = usePostContext()
	
	return (
		<div className={`${styles.Modal__curtain}`}>
			<IoClose color="black" onClick={() => handleModalPostComment(false)} size={30} className={styles.Modal__PostComment__Close} />
			<div className={`${styles.Modal__PostComment} compenentDefault`}>
				<WriteAComment />
				<PostComments />
			</div>
		</div>
	)
}

export default ModalCommentToPost
