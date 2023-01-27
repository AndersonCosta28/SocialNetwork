import { userService } from "User"
import AuthenticationController, { IAuthenticationController } from "./authentication.controller"
import AuthenticationService, { IAuthenticationService } from "./authentication.service"

const authenticationService: IAuthenticationService = new AuthenticationService(userService)
const authenticationController: IAuthenticationController = new AuthenticationController(authenticationService)

export { authenticationService, authenticationController }
