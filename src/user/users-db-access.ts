import * as Nedb from 'nedb';
import { User } from '../shared/model';

export class UsersDBAccess {
    private nedb: Nedb;

    constructor() {
        this.nedb = new Nedb('database/users.db');
        this.nedb.loadDatabase();
    }

    public async putUser(user: User) {
        return new Promise((resolve, reject) => {
            this.nedb.insert(user, err => {
                if (err) reject(err);
                else resolve(user);
            });
        });
    }
}
