import React from "react"
import { AiFillPicture } from "react-icons/ai"
import { SlClose } from "react-icons/sl"
import { toast } from "react-hot-toast"
import styles from "./WriteAnPost.module.css"
import TextareaAutosize from "react-textarea-autosize"
import { API_AXIOS } from "Providers/axios"
import { getUserId } from "utils"
import { getAxiosErrorMessage } from "common"
import { useProtected } from "Context/ProtectedContext"

const WriteAnPost = () => {
	const { setAllPosts, allPosts } = useProtected()
	const textAreaWritePost = React.useRef<HTMLTextAreaElement>(null)
	const [textPost, setTextPost] = React.useState<string>("")
	const [attachments, setAttachments] = React.useState<File[]>([])

	const handlerTextPost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target
		setTextPost(value)

		const textPost = textAreaWritePost.current as HTMLTextAreaElement
		const scrollHeigth = textPost.scrollHeight
		textPost.scrollTop = scrollHeigth
	}

	const handlerAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target
		if (files === null) {
			toast.error("Nothing file selected")
			return
		}

		const newFiles = [].slice.call(files)
		if (newFiles.some((file: File) => file.size > 1000000)) toast.error("The maximum file size is 1MB")
		else setAttachments([...attachments, ...newFiles])
	}

	const removeAttachment = (index: number) => {
		const _attachments = attachments
		_attachments.splice(index, 1)
		setAttachments([..._attachments])
	}

	const sendPost = () => {
		const formData = new FormData()
		const content = {
			Text: textPost,
		}
		for (const attachment of attachments) formData.append("Attachments", attachment)
		formData.append("Content", new Blob([JSON.stringify(content)], { type: "application/json" }))
		API_AXIOS({
			url: "/post/create/" + getUserId(),
			method: "post",
			headers: { "Content-Type": "multipart/form-data" },
			data: formData,
		})
			.then((res) => {
				const _allPosts = allPosts
				_allPosts.unshift(res.data)				
				setAllPosts([..._allPosts])
			})
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
		setAttachments([])
		setTextPost("")
	}

	const ListOfAttachments = React.useMemo(
		() =>
			attachments.map((attachment: File, index: number) => (
				<div style={{ border: "1px solid black", width: 100, height: 100, position: "relative" }} key={"attachament-" + index}>
					<SlClose id={styles.WritePost__Attachments__RemoveAttachemnt} onClick={() => removeAttachment(index)} />
					<img src={URL.createObjectURL(attachment)} alt={"attachament-" + index} width={100} height={100} />
				</div>
			)), [attachments]
	)

	return (
		<>
			<div id={styles.WritePost}>
				<TextareaAutosize maxRows={10} id={styles.WritePost__TextArea} ref={textAreaWritePost} placeholder="Share your thoughts" value={textPost} onChange={handlerTextPost} />
				<div id={styles.WritePost_Attachments}>{ListOfAttachments}</div>
				<div id={styles.WritePost__Options}>
					<label htmlFor="attach_photo">
						<AiFillPicture size={30} />
					</label>
					<input type="file" style={{ display: "none" }} id="attach_photo" accept="image/*" multiple onChange={handlerAttachments} />
					{/* <label htmlFor="attach_video">
						<RiMovieFill size={30} />
					</label>
					<input type="file" style={{ display: "none" }} id="attach_video" accept="video/*" multiple /> */}
					<input type="button" value="send" className="blueButtonActive" onClick={sendPost} />
				</div>
			</div>
		</>
	)
}

export default WriteAnPost
