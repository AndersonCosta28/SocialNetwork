import { IFriend } from "./Friendship"
import { Buffer } from "buffer"
import { IFiles } from "./Files"

export interface IUserLogin {
  Login: string
  Password: string
}

export interface IUserSocket {
  SocketID: string,
  UserId: number,
  Nickname: string
}

export interface IProfile {
  id: number,
  Nickname: string,
  Avatar: string | File | IFiles | null,
  Description: string,
  Local: string,
}

export interface IUserRegister {
  Login: string
  Password: string
  Email: string
  Profile: {
    Nickname: string
  }
}

export enum UserStates {
  WaitingForActivation = "Waiting for activation",
  Active = "Active",
  Blocked = "Blocked",
  Banned = "Banned"
}