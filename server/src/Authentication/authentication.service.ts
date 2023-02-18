import { StatusCode } from "status-code-enum"
import { IUserLogin, UserStates } from "common/Types/User"
import bcrypt from "bcrypt"
import { IResponseLogin } from "common/Types/Response"
import { IUserService } from "User/User.service"
import * as jwt from "jsonwebtoken"
import { CustomErrorAPI } from "common"

export interface IAuthenticationService {
	login: (usuarioLogin: IUserLogin) => Promise<IResponseLogin>
}

export default class AuthenticationService implements IAuthenticationService {

	constructor(private readonly userService: IUserService) { }

	login = async (usuarioLogin: IUserLogin): Promise<IResponseLogin> => {
		const user = (await this.userService.findOneByName(usuarioLogin.Login, true))
		const secret: string | undefined = process.env.JWT_SECRET

		if (!user)
			throw new CustomErrorAPI("User doesn't exist", StatusCode.ClientErrorNotFound)

		if (!(await bcrypt.compare(usuarioLogin.Password, user.Password)))
			throw new CustomErrorAPI("Incorrect password", StatusCode.ClientErrorBadRequest)

		if (user.State !== UserStates.Active && user.State !== UserStates.WaitingForActivation)
			throw new CustomErrorAPI(`Your username is ${user.State.toString()}`, StatusCode.ClientErrorForbidden)

		if (!secret)
			throw new CustomErrorAPI("JWT Secret is undefined", StatusCode.ServerErrorInternal)

		const token = jwt.sign({ login: user.Login, id: user.id }, secret)
		return { code: StatusCode.SuccessAccepted, idUser: user.id, message: "Successfully authenticated user", token, nickname: user.Login }
	}
}
