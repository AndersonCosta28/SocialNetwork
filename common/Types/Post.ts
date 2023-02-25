import { IFiles } from "./Files"
import { IProfile } from "./User"

export interface IPost {
    id: number
    Attachments: IFiles[]
    Text: string
    CreateAt: Date
    UpdateAt: Date,
    Reactions: IPostReactions[],
    Comments: IPostComments[]
    Profile: IProfile
}

export enum TypePostReactions {
    Like
}

export interface IPostReactions {
    id: number,
    Profile: IProfile,
    TypePostReaction: TypePostReactions
}

export interface IPostComments {
    id: number,
    Text: string,
    ProfileSource: IProfile
}
