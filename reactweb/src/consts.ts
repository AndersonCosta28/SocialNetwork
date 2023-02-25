import { IPost, IProfile } from "common"

export const profileDefault: IProfile = {
	Avatar: {
		base64: "",
		id: 0,
		type: ""
	},
	Description: "",
	id: 0,
	Local: "",
	Nickname: "",
}

export const postDefault: IPost = {
	Attachments: [],
	CreateAt: new Date(),
	id: 0,
	Profile: profileDefault,
	Text: "",
	UpdateAt: new Date(),
	Reactions: [],
	Comments: []
}