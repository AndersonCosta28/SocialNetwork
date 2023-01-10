import { ICreateBodyRequest, IFindAllByUserBodyRequest, IReactToFriendRequestBodyRequest, TypeOfFriendship } from "./Types/Friendship"
import IResponse, {IResponseLogin} from "./Types/Response"
import { IUserLogin, IUserSocket, IUserRegister, UserStates } from "./Types/User"
import { EmailTypes, IAddress, IEmailMessage } from "./Types/Email"
import { CustomErrorAPI } from './Types/CustomErrors'

export {
    ICreateBodyRequest,
    IFindAllByUserBodyRequest,
    IReactToFriendRequestBodyRequest,
    TypeOfFriendship,
    IResponseLogin,
    IUserLogin,
    IUserSocket,
    IUserRegister,
    UserStates,
    EmailTypes,
    IAddress,
    IEmailMessage,
    CustomErrorAPI,
    IResponse
}

export const addHours = (date: Date, hours: number) => {
    var copiedDate = new Date(date.getTime());
    copiedDate.setHours(copiedDate.getHours() + hours);
    return copiedDate;
}

export const getErrorMessage = (error: unknown): string => {
    return error instanceof Error ? error.message : error as string
}

export const getAxiosErrorMessage = (error: unknown | any): string => {
    if ((error as Object).hasOwnProperty("response"))
        return error.response.data.message ?? error.response.data.Message
    else
        return error instanceof Error ? error.message : error
}

export const regexPassword: RegExp = /[\w\d\s]{8,}/