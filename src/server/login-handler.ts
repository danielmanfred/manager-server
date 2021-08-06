import { IncomingMessage, ServerResponse } from "http";
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
        try {
            const body = await this.getRequestBody();
            const sessionToken = await this.tokenGenerator.generateToken(body);
            if (sessionToken) {
                this.response.writeHead(200, 'valid credentials');
                console.log('valid credentials');
            } else {
                this.response.writeHead(400, 'wrong credentials');
                console.log('wrong credentials');
            }
        } catch (error) {
            this.response.write('error: ', error.message);
        }
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
