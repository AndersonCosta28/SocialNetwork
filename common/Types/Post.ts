import { IProfile } from "./User"

export interface IPost {
    id: number
    Attachments: {
        buffer: Buffer
        id: number,
        type: string,
    }[]
    Text: string
    Profile: IProfile
    CreateAt: Date
    UpdateAt: Date,
    Reactions: IPostReactions[],
    Comments: IPostComments[]
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
