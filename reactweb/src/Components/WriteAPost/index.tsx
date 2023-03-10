import { getAxiosErrorMessage } from "common"
import { usePostContext } from "Context/PostContext"
import { useProtected } from "Context/ProtectedContext"
import { API_AXIOS } from "Providers/axios"
import React from "react"
import { toast } from "react-hot-toast"
import { AiFillPicture } from "react-icons/ai"
import { BiSend } from "react-icons/bi"
import { SlClose } from "react-icons/sl"
import ReactTextareaAutosize from "react-textarea-autosize"
import styles from "./WriteAPost.module.css"

const WriteAPost = () => {
	const textAreaWriteAPost = React.useRef<HTMLTextAreaElement>(null)
	const [attachments, setAttachments] = React.useState<File[]>([])
	const [textPost, setTextPost] = React.useState<string>("")
	const { allPosts, setAllPosts } = usePostContext()
	const { myProfile } = useProtected()
	const [disableButton, setDisableButton] = React.useState<boolean>(false)

	const handlerTextPost = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		React.startTransition(() => {
			const { value } = e.target
			setTextPost(value)
		})
		const textPost = textAreaWriteAPost.current as HTMLTextAreaElement
		const scrollHeigth = textPost.scrollHeight
		textPost.scrollTop = scrollHeigth
	}

	const handlerAttachments = (e: React.ChangeEvent<HTMLInputElement>) => {
		React.startTransition(() => {
			const { files } = e.target
			if (files === null) {
				toast.error("Nothing file selected")
				return
			}

			const newFiles = [].slice.call(files)
			if (newFiles.some((file: File) => file.size > 1000000)) toast.error("The maximum file size is 1MB")
			else setAttachments([...attachments, ...newFiles])
		})
	}

	const removeAttachment = (index: number) => {
		const _attachments = attachments
		_attachments.splice(index, 1)
		setAttachments([..._attachments])
	}

	const sendPost = () => {
		setDisableButton(true)
		const formData = new FormData()
		const content = {
			Text: textPost,
		}
		for (const attachment of attachments) formData.append("Attachments", attachment)
		formData.append("Content", new Blob([JSON.stringify(content)], { type: "application/json" }))
		API_AXIOS({
			url: "/post/create/" + myProfile.id,
			method: "post",
			headers: { "Content-Type": "multipart/form-data" },
			data: formData,
		})
			.then((res) => {
				allPosts.unshift({...res.data, Profile: myProfile})
				setAllPosts([...allPosts])
				setAttachments([])
				setTextPost("")
			})
			.catch((error) => toast.error(getAxiosErrorMessage(error)))
			.finally(() => setDisableButton(false))
	}

	const ListOfAttachments = attachments.map((attachment: File, index: number) => (
		<div style={{ border: "1px solid black", width: 100, height: 100, position: "relative" }} key={"attachament-" + index}>
			<SlClose id={styles.WriteAPost__Attachments__RemoveAttachemnt} onClick={() => removeAttachment(index)} />
			<img src={URL.createObjectURL(attachment)} alt={"attachament-" + index} width={100} height={100} />
		</div>
	))
	return (
		<div id={styles.WriteAPost} className="compenentDefault" style={{ margin: "20px 5px 0px 5px" }}>
			<ReactTextareaAutosize maxRows={10} id={styles.WriteAPost__TextArea} ref={textAreaWriteAPost} placeholder="Share your thoughts" value={textPost} onChange={handlerTextPost} />
			<div id={styles.WriteAPost_Attachments}>{ListOfAttachments}</div>
			<div id={styles.WriteAPost__Options}>
				
				<div>
					<label htmlFor="attach_photo" className={`flex_row_center_center ${styles.WriteAPost__Options__AttachImages}`}>
						<AiFillPicture size={30} color="white" />
						Attach images
					</label>
					<input type="file" style={{ display: "none" }} id="attach_photo" accept="image/*" multiple onChange={handlerAttachments} />
				</div>
				{/* <label htmlFor="attach_video">
						<RiMovieFill size={30} />
					</label>
					<input type="file" style={{ display: "none" }} id="attach_video" accept="video/*" multiple /> */}

				
				<BiSend className={disableButton ? "blueButtonDisable" : "blueButtonActive"} size={30} onClick={() => !disableButton && sendPost()}  />
				{/* <input type="button" value="Send" className="blueButtonActive"  /> */}
			</div>
		</div>
	)
}

export default WriteAPost
