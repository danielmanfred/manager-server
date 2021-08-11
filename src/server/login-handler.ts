import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES, HTTP_METHODS } from "../shared/model";
import { Account, Handler, TokenGenerator } from "./model";

export class LoginHander implements Handler {
    private request: IncomingMessage;
    private response: ServerResponse;
    private tokenGenerator: TokenGenerator;

    constructor(request: IncomingMessage, response: ServerResponse, tokenGenerator: TokenGenerator) {
        this.request = request;
        this.response = response;
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
            const body = await this.getRequestBody();
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
            this.response.write('error: ', error.message);
        }
    }

    private async handleNotFound() {
        this.response.statusCode = HTTP_CODES.NOT_FOUND;
        this.response.write('not found');
    }

    private async getRequestBody(): Promise<Account> {
        return new Promise((resolve, reject) => {
            let body = '';
            this.request.on('data', (data: string) => {
                body += data;
            });
            this.request.on('end', () => {
                try {
                    resolve(JSON.parse(body));
                } catch (error) {
                    reject(error);
                }
            });
            this.request.on('error', (error: any) => {
                reject(error);
            });
        });
    }
}
