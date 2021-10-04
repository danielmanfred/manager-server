import { IncomingMessage, ServerResponse } from "http";
import { HTTP_CODES, HTTP_METHODS } from "../shared/model";
import { UsersDBAccess } from "../user/users-db-access";
import { BaseRequestHandler } from "./base-request-handler";
import { Utils } from "./utils";

export class UserHandler extends BaseRequestHandler {
    private usersDBAccess: UsersDBAccess = new UsersDBAccess();

    public constructor(request: IncomingMessage, response: ServerResponse) {
        super(request, response);
    }

    async handleRequest(): Promise<void> {
        switch (this.request.method) {
            case HTTP_METHODS.GET:
                await this.handleGet();
                break;
            default:
                this.handleNotFound();
        }
    }

    private async handleGet() {
        const parseUrl = Utils.getUrlParameters(this.request.url);
        if (parseUrl) {
            const userId = parseUrl.query.id;
            if (userId) {
                const user = await this.usersDBAccess.getUserById(userId as string);
                if (user) {
                    this.respondJsonObject(HTTP_CODES.OK, user);
                } else {
                    this.handleNotFound();
                }
            } else {
                this.respondBadRequest('userId not present in request');
            }
        }
        console.log('queryId: ', parseUrl?.query.id);
        const a = '5';
    }

}
