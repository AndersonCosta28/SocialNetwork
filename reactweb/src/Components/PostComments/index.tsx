import { IPostComments } from "common"
import Avatar from "Components/Avatar"
import { usePostContext } from "Context/PostContext"
import React from "react"
import { getAvatarFromProfile } from "utils"

const PostComments = (): JSX.Element => {
	const { post } = usePostContext()
	const [showFullComment, setShowFullComment] = React.useState(false)
	return (
		<div>
			{post.Comments.map((comment: IPostComments) => {
				const avatarProfileSource = getAvatarFromProfile(comment.ProfileSource)
				const handleShowFullComment = () => setShowFullComment(!showFullComment)
				const maxLengthText = 200
				const Text = (
					<span style={{ whiteSpace: "pre-line" }}>
						{comment.Text.length > maxLengthText && showFullComment ? comment.Text : comment.Text.slice(0, maxLengthText)} <br />{" "}
						{comment.Text.length > maxLengthText ? (
							<span className="span__ExpandText" onClick={handleShowFullComment}>
								{showFullComment ? "Read less..." : "Read more..."}
							</span>
						) : null}
					</span>
				)
				return (
					<div style={{ margin: 10, display: "flex", alignItems: "baseline" }} key={`comment ${comment.id}`}>
						<Avatar base64={avatarProfileSource.base64} type={avatarProfileSource.type} size={20} />
						<div style={{ backgroundColor: "#F0F2F5", padding: 10, margin: 10, borderRadius: 15, width: "max-content" }}>{Text}</div>
					</div>
				)
			})}
		</div>
	)
}

export default PostComments
