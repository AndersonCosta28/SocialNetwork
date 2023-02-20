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
    Reactions: IReactionsPost[]
}

export enum TypePostReactions {
    Like
}

export interface IReactionsPost {
    id: number,
    Profile: IProfile,
    TypePostReaction: TypePostReactions        
}