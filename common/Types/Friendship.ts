export enum TypeOfFriendship {
  "Requested",
  "Friend",
  "Blocked",
  "Removed"
}

export enum TypesOfApplicants { Me, Other }

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
  FriendshipId: number
  FromId: number
  ToId: number
  Message: string
  id: number
}

export interface IFriend {
  FriendshipId: number
  FriendId: number
  Type: TypeOfFriendship | string
  FriendNickname: string
  WhoRequested: TypesOfApplicants
}