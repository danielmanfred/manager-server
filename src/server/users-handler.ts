import { IncomingMessage, ServerResponse } from "http";
import { AccessRight, HTTP_CODES, HTTP_METHODS, User } from "../shared/model";
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
            case HTTP_METHODS.PUT:
                await this.handlePut();
                break;
            case HTTP_METHODS.DELETE:
                await this.handleDelete();
                break;
            default:
                this.handleNotFound();
        }
    }

    private async handleDelete() {
        const operationAuthorized = await this.operationAuthorized(AccessRight.DELETE);
        if (operationAuthorized) {
            const parseUrl = Utils.getUrlParameters(this.request.url);
            if (parseUrl) {
                const userId = parseUrl.query.id;
                if (userId) {
                    const deletedUser = await this.usersDBAccess.deleteUser(userId as string);
                    if (deletedUser) {
                        this.respondeText(HTTP_CODES.OK, `user ${userId} deleted`);
                    } else {
                        this.respondeText(HTTP_CODES.NOT_FOUND, `user ${userId} was not found`);
                    }
                } else {
                    this.respondBadRequest('missing id in the request');
                }
            }
        } else {
            this.respondUnauthorized(`missing or invalid authentication`);
        }
    }

    private async handlePut() {
        const operationAuthorized = await this.operationAuthorized(AccessRight.CREATE);
        if (operationAuthorized) {
            try {
                const user: User = await this.getRequestBody();
                await this.usersDBAccess.putUser(user);
                this.respondeText(HTTP_CODES.CREATED, `user ${user.name} created`);
            } catch (err) {
                console.log('This error ACONTECENDO: ', err);
                this.respondBadRequest('PROBLEMÃO ACONTECENDO');
            }
        } else {
            this.respondUnauthorized(`missing or invalid authentication`);
        }
    }

    private async handleGet() {
        const operationAuthorized = await this.operationAuthorized(AccessRight.READ);
        if (operationAuthorized) {
            const parseUrl = Utils.getUrlParameters(this.request.url);
            if (parseUrl) {
                const { id, name } = parseUrl.query;
                if (id) {
                    const user = await this.usersDBAccess.getUserById(id as string);
                    if (user) {
                        this.respondJsonObject(HTTP_CODES.OK, user);
                    } else {
                        this.handleNotFound();
                    }
                } else if (name) {
                    const users = await this.usersDBAccess.getUsersByName(name as string);
                    this.respondJsonObject(HTTP_CODES.OK, users);
                } else {
                    this.respondBadRequest('userId or name are not present in request');
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
