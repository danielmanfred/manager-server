import * as Nedb from 'nedb';
import { SessionToken } from '../server/model';

export class SessionTokenDBAccess {
    private nedb: Nedb;

    constructor() {
        this.nedb = new Nedb('database/session_token.db');
        this.nedb.loadDatabase();
    }

    public async storeSessionToken(token: SessionToken): Promise<void> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(token, err => {
                if (err) {
                    reject(err);
                } else { 
                    resolve();
                }
            });
        });
    }

    public async getToken(tokenId: string): Promise<SessionToken | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ tokenId }, (err: Error, docs: any) => {
                if (err) {
                    reject(err);
                }
                if (!docs.length) {
                    resolve(undefined);
                } else {
                    resolve(docs[0]);
                }
            });
        });
    }
}
