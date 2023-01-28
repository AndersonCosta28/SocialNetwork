import React from "react"
import { BsPersonCircle } from "react-icons/bs"

interface IProps {
    size: number,
    base64: string,
    type: string
}

const Avatar = (props: IProps) => 
	props.base64 ? 
		<img style={{width: props.size, height: props.size, borderRadius: "50%"}} src={`data:${props.type};base64, ${props.base64}`} alt="avatar_profile" /> 
		: 
		<BsPersonCircle size={props.size} />

export default Avatar