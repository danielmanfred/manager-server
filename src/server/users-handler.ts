import { IncomingMessage, ServerResponse } from "http";
import { AccessRight, HTTP_CODES, HTTP_METHODS } from "../shared/model";
import { UsersDBAccess } from "../user/users-db-access";
import { BaseRequestHandler } from "./base-request-handler";
import { TokenValidator } from "./model";
import { Utils } from "./utils";

export class UserHandler extends BaseRequestHandler {
    private usersDBAccess: UsersDBAccess = new UsersDBAccess();
    private tokenValidator: TokenValidator;

    public constructor(request: IncomingMessage, response: ServerResponse, tokenValidator: TokenValidator) {
        super(request, response);
        this.tokenValidator = tokenValidator;
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
        const operationAuthorized = await this.operationAuthorized(AccessRight.READ);
        if (operationAuthorized) {
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
        } else {
            this.respondUnauthorized('missing or invalid authentication');
        }
    }

    private async operationAuthorized(operation: AccessRight): Promise<boolean> {
        const tokenId = this.request.headers.authorization;

        if (tokenId) {
            const tokenRights = await this.tokenValidator.validatorToken(tokenId);
            return tokenRights.accessRights.includes(operation);
        } else {
            return false;
        }
    }
}
