import { StatusCode } from "status-code-enum"
import { IUserLogin, UserStates } from "common/Types/User"
import bcrypt from "bcrypt"
import {IResponseLogin} from "common/Types/Response"
import { IUserService } from "User/User.service"

export interface IAuthenticationService {
	login : (usuarioLogin: IUserLogin) => Promise<IResponseLogin>
}

export default class AuthenticationService implements IAuthenticationService {

	constructor(private readonly userService: IUserService) {}

	login = async (usuarioLogin: IUserLogin): Promise<IResponseLogin> => {
		const user = (await this.userService.findOneByName(usuarioLogin.Login, true))
		if (!user) 
			return { code: StatusCode.ClientErrorNotFound, message: "User doesn't exist", authenticated: false }		

		if (!(await bcrypt.compare(usuarioLogin.Password, user.Password))) 
			return { code: StatusCode.ClientErrorBadRequest, message: "Incorrect password", authenticated: false }

		if (user.State !== UserStates.Active && user.State !== UserStates.WaitingForActivation) 
			return {code: StatusCode.ClientErrorForbidden, message: `Your username is ${user.State.toString()}`, authenticated: false}

		return { code: StatusCode.SuccessAccepted, idUser: user.id, message: "Successfully authenticated user", authenticated: true, nickname: user.Login }
	}
}
