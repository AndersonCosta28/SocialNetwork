export interface IUserLogin {
  Login: string
  Password: string
}

export interface IUserSocket {
  SocketID: string,
  UserId: number,
  Nickname: string
}

export interface IUserInfo {
  id: number,
  Nickname: string,
  Email: string,
  State: string,
  Profile: {
    Description: string
  }
}

export interface IUserRegister {
  Login: string
  Password: string
  Email: string
  Nickname: string
}

export enum UserStates {
  WaitingForActivation = "Waiting for activation",
  Active = "Active",
  Blocked = "Blocked",
  Banned = "Banned"
}