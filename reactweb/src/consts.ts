import { IPost, IPosts, IProfile } from "common"

export const profileDefault: IProfile = {
	Avatar: null,
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

export const postsDefault: IPosts = {
	Posts: [],
	Profile: profileDefault
}