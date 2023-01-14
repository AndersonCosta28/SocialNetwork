export enum TypeOfFriendship {
  "Requested",
  "Friend",
  "Blocked",
  "Removed"
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
  FromId: number
  ToId: number
  Message: string
  Id: number
}

export interface IFriend {
  FriendshipId: number
  FriendId: number 
  Type: TypeOfFriendship | string
  FriendNickname: string
}