import { IFiles, IPostComments } from "common"
import Avatar from "Components/Avatar"
import { usePostContext } from "Context/PostContext"
import React from "react"

const PostComments = (): JSX.Element => {
	const { post } = usePostContext()
	const [showFullComment, setShowFullComment] = React.useState(false)
	return (
		<div>
			{post.Comments.map((comment: IPostComments) => {
				const { base64: avatarBase64, type: avatarType } = comment.ProfileSource.Avatar as IFiles
				const handleShowFullComment = () => setShowFullComment(!showFullComment)
				const maxLengthText = 200
				const Text = (
					<span style={{ whiteSpace: "pre-line" }}>
						{comment.Text.trim().length > maxLengthText && showFullComment ? comment.Text.trim() : comment.Text.trim().slice(0, maxLengthText)} <br />{" "}
						{comment.Text.trim().length > maxLengthText ? (
							<span className="span__ExpandText" onClick={handleShowFullComment}>
								{showFullComment ? "Read less..." : "Read more..."}
							</span>
						) : null}
					</span>
				)
				return (
					<div style={{ margin: 10, display: "flex", alignItems: "baseline" }} key={`comment ${comment.id}`}>
						<Avatar base64={avatarBase64} type={avatarType} size={20} />
						<div style={{ backgroundColor: "#F0F2F5", padding: 10, margin: 10, borderRadius: 15, width: "max-content" }}>{Text}</div>
					</div>
				)
			})}
		</div>
	)
}

export default PostComments
