export * from "./Types/Friendship"
export * from "./Types/Response"
export * from "./Types/User"
export * from "./Types/Email"
export * from './Types/CustomErrors'
export * from "./Types/Post"

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
        return error.response.data.message ?? error.response.data
    else
        return error instanceof Error ? error.message : error
}

export const regexPassword: RegExp = /[\w\d\s]{8,}/