import { CustomErrorAPI } from "common"
import { ErrorRequestHandler, NextFunction, Request, Response } from "express"

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const MiddlewareError = (error: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
	const { statusCode, message } = CustomErrorAPI.throwError(error)	
	console.debug(error)
	res.status(statusCode).json({ message })
}

export const MiddlewareVerifyIds = (request: Request, response: Response, next: NextFunction) => {
	const { id } = response.locals
	if (id !== Number(request.params.id)) throw new CustomErrorAPI("Ids User doens't match")
	else next()
}