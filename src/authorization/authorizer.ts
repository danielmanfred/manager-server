import { Account, SessionToken, TokenGenerator } from "../server/model";
import { SessionTokenDBAccess } from "./session-token-db-access";
import { UserCredentialsDBAccess } from "./user-credentials-db-access";

export class Authorizer implements TokenGenerator {
    private userCredDBAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
    private sessionTokenDBAccess: SessionTokenDBAccess = new SessionTokenDBAccess();

    async generateToken(account: Account): Promise<SessionToken | undefined> {
        const resultAccount = await this.userCredDBAccess.getUserCredential(account);

        if (!resultAccount) {
            return undefined;
        }

        const token: SessionToken = {
            accessRights: resultAccount.accessRights,
            expirationTime: this.generateExpirationTime(),
            username: resultAccount.username,
            valid: true,
            tokenId: this.generateRandomTokenid()
        }
        await this.sessionTokenDBAccess.storeSessionToken(token);
        return token;
    }

    private generateExpirationTime() {
        return new Date(Date.now() + 60 * 60 * 1000);
    }

    private generateRandomTokenid() {
        return Math.random().toString(36).slice(2);
    }
}
