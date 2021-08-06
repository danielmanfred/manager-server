import * as Nedb from 'nedb';

import { Account } from "../server/model";
import { UserCredentials } from "../shared/model";

export class UserCredentialsDBAccess {
    private nedb: Nedb;

    constructor() {
        this.nedb = new Nedb('database/UserCredentials.db');
        this.nedb.loadDatabase();
    }

    public async putUserCredential(userCredentials: UserCredentials): Promise<any> {
        return new Promise((resolve, reject) => {
            this.nedb.insert(userCredentials, (err, docs: any) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(docs);
                }
            });
        });
    }

    public async getUserCredential(account: Account): Promise<UserCredentials | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find(account, (err: Error, docs: UserCredentials[]) => {
                if (err) reject(err)
                else {
                    if (docs.length) resolve(docs[0]);
                    else resolve(undefined);
                }
            });
        });
    }
}
