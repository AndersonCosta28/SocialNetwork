import { IProfileInfo } from "./User"

export interface IPost {
    id: number
    Attachments: {
        buffer: Buffer
        id: number,
        type: string
    }
    Profile: IProfileInfo
}