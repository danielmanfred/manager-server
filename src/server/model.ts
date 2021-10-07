import { AccessRight } from "../shared/model";

export interface Account {
    username: string,
    password: string
}

export interface SessionToken {
    tokenId: string,
    username: string,
    valid: boolean,
    expirationTime: Date,
    accessRights: AccessRight[]
}

export enum TokenState {
    VALID,
    INVALID,
    EXPIRED
}

export interface TokenRights {
    accessRights: AccessRight[],
    state: TokenState
}

export interface TokenGenerator {
    generateToken(account: Account): Promise<SessionToken | undefined>
}

export interface TokenValidator {
    validatorToken(tokenId: string): Promise<TokenRights>
}
