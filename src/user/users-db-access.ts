import * as Nedb from 'nedb';
import { User } from '../shared/model';

export class UsersDBAccess {
    private nedb: Nedb;

    constructor() {
        this.nedb = new Nedb('database/users.db');
        this.nedb.loadDatabase();
    }

    public async putUser(user: User) {
        if (!user.id) {
            user.id = this.generateUserId();
        }
        return new Promise((resolve, reject) => {
            this.nedb.insert(user, err => {
                if (err) reject(err);
                else resolve(user);
            });
        });
    }

    public async getUserById(userId: string): Promise<User | undefined> {
        return new Promise((resolve, reject) => {
            this.nedb.find({ id: userId }, (err: Error, docs: any[]) => {
                if (err) {
                    reject(err);
                } else {
                    if (!docs.length) {
                        resolve(undefined);
                    } else {
                        resolve(docs[0]);
                    }
                }
            });
        });
    }

    private generateUserId() {
        return Math.random().toString(36).slice(2);
    }
}
