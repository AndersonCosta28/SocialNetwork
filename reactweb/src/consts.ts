import { IPost, IProfile } from "common"

export const profileDefault: IProfile = {
	Avatar: null,
	AvatarBase64: "",
	AvatarId: 0,
	AvatarType: "",
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