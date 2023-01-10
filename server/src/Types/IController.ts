import { Request, Response, Router } from "express"

export default interface IController {    
    routers: () => Router;
}

export interface IControllerCrud extends IController {    
    findAll : (request: Request, response: Response) => Promise<Response>
    findOneById : (request: Request, response: Response) => Promise<Response>
    create : (request: Request, response: Response) => Promise<Response>
    update : (request: Request, response: Response) => Promise<Response>
    delete : (request: Request, response: Response) => Promise<Response>
}