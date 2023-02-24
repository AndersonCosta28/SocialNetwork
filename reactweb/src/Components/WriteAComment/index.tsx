import { getAxiosErrorMessage, IFiles } from "common"
import Avatar from "Components/Avatar"
import { usePostContext } from "Context/PostContext"
import { useProtected } from "Context/ProtectedContext"
import { API_AXIOS } from "Providers/axios"
import React from "react"
import { toast } from "react-hot-toast"
import ReactTextareaAutosize from "react-textarea-autosize"
import styles from "./WriteAComment.module.css"

const WriteAComment = (props: { style?: React.CSSProperties; }) => {
	const { myProfile } = useProtected()
	const { post, setPost } = usePostContext()
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
		if (!buttonSubmitMessageElementRef.current) {
			toast.error("Button to send comment is undefined")
			return
		}

		const button = buttonSubmitMessageElementRef.current
		button.disabled = true
		API_AXIOS.post("/postComments", {
			idPost: post.id,
			idProfileSource: myProfile.id,
			text: comment,
		})
			.then((res) => {
				toast.success("Comentário adicionado")
				const _post = post
				_post.Comments.push({ ...res.data, ProfileSource: {...myProfile} })
				React.startTransition(() => {
					setComment("")
					setPost({..._post})
				})
			})
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
			.finally(() => (button.disabled = false))
	}
	return (
		<div style={{ ...props.style }} className={styles.WriteAComment}>
			<Avatar base64={(myProfile.Avatar as IFiles).base64} type={(myProfile.Avatar as IFiles).type} size={20} />
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
				value={comment}
			/>
			<input ref={buttonSubmitMessageElementRef} type="button" style={{ display: "none" }} onClick={SendComment} />
		</div>
	)
}

export default WriteAComment
