import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES } from "../shared/model";

export abstract class BaseRequestHandler {

    public constructor(protected request: IncomingMessage, protected response: ServerResponse) {}

    abstract handleRequest(): Promise<void>;

    protected async handleNotFound() {
        this.response.statusCode = HTTP_CODES.NOT_FOUND;
        this.response.write('not found');
    }

    protected respondJsonObject(code: HTTP_CODES, object: any) {
        this.response.writeHead(code, { 'Content-Type': 'application/json' });
        this.response.write(JSON.stringify(object));
    }

    protected respondBadRequest(message: string) {
        this.response.statusCode = HTTP_CODES.BAD_REQUEST;
        this.response.write(message);
    }

    protected async getRequestBody(): Promise<any> {
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
