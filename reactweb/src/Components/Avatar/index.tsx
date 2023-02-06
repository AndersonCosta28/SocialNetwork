import React from "react"

interface IProps {
    size: number,
    base64: string,
    type: string
}

const Avatar = (props: IProps) => {
	const source = props.base64 ? `data:${props.type};base64, ${props.base64}` : require("../../Assets/avatar.png")
	return <img style={{width: props.size, height: props.size, borderRadius: "50%"}} src={source} alt="avatar_profile" /> 		
}

export default Avatar