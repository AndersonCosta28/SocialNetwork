import { StatusCode } from "status-code-enum"

import { UserStates } from "./User"

export default interface IResponse {
  code: StatusCode
  message: string
}

export interface IResponseLogin extends IResponse {
  idUser?: number
  idPlayer?: number
  nickname?: string
  token: string
  exp?: number
  level?: number,
}
