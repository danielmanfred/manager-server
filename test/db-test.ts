import { UserCredentialsDBAccess } from "../src/authorization/user-credentials-db-access";
import { UsersDBAccess } from "../src/user/users-db-access";

class DbTest {
    public dbAccess: UserCredentialsDBAccess = new UserCredentialsDBAccess();
    public userDbAccess: UsersDBAccess = new UsersDBAccess();
}

new DbTest().dbAccess.putUserCredential({
    username: 'user1',
    password: 'password1',
    accessRights: [1, 2, 3]
});
