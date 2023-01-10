import StatusCode from "status-code-enum";
import { getErrorMessage } from "..";

export class CustomErrorAPI extends Error {
    message: string
    statusCode: StatusCode

    constructor(error: unknown, code: StatusCode = StatusCode.ClientErrorBadRequest) {
        super()
        Object.setPrototypeOf(this, CustomErrorAPI.prototype);
        this.stack = ""
        this.name = "CustomErrorAPI"
        this.message = getErrorMessage(error) ?? "uncataloged error"
        this.statusCode = code;
        

        if (error instanceof CustomErrorAPI) this.statusCode = error.statusCode            

        else if (error instanceof Error) this.stack = error.stack

        else console.log(error)
            
    }

    static throwError(error: unknown): CustomErrorAPI{
        if (error instanceof CustomErrorAPI) return error
        else return new CustomErrorAPI(error)
    }
}