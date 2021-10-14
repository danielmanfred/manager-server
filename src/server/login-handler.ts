import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES, HTTP_METHODS } from "../shared/model";
import { BaseRequestHandler } from "./base-request-handler";
import { Account, TokenGenerator } from "./model";

export class LoginHander extends BaseRequestHandler {
    private tokenGenerator: TokenGenerator;

    constructor(request: IncomingMessage, response: ServerResponse, tokenGenerator: TokenGenerator) {
        super(request, response);
        this.tokenGenerator = tokenGenerator;
    }

    public async handleRequest(): Promise<void> {
        switch (this.request.method) {
            case HTTP_METHODS.POST:
                await this.handlePost();
                break;
            default:
                this.handleNotFound();
                break;
        }
    }

    private async handlePost() {
        try {
            const body: Account = await this.getRequestBody();
            const sessionToken = await this.tokenGenerator.generateToken(body);
            if (sessionToken) {
                this.response.statusCode = HTTP_CODES.CREATED;
                this.response.writeHead(HTTP_CODES.CREATED, { 'Content-Type': 'application/json' });
                this.response.write(JSON.stringify(sessionToken));
                console.log(sessionToken);
            } else {
                this.response.statusCode = HTTP_CODES.NOT_FOUND;
                this.response.write('wrong username or password');
                console.log('wrong username or password');
            }
        } catch (error) {
            this.response.write(`error: ${ error }`);
        }
    }
}
