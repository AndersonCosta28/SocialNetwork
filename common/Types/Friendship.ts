export enum TypeOfFriendship {
  "Requested",
  "Friend",
  "Blocked"
}

export interface ICreateBodyRequest {
  SourceId: number
  TargetName: string
}

export interface IFindAllByUserBodyRequest {
  UserId: number
}

export type IReactToFriendRequestBodyRequest = {
  UserId: number
  FriendshipId: number
  React: boolean
}

export interface IMessage {
  fromId: string
  toId: string
  message: string
  id:string
}