import { Request, Response, Router } from "express"

export default interface IController {    
    routers: () => Router;
}

export interface IControllerCrud extends IController {    
    findAll : (request: Request, response: Response) => Promise<Response | null>
    findOneById : (request: Request, response: Response) => Promise<Response | null>
    create : (request: Request, response: Response) => Promise<Response | null>
    update : (request: Request, response: Response) => Promise<Response | null>
    delete : (request: Request, response: Response) => Promise<Response | null>
}