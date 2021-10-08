import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../authorization/authorizer';
import { LoginHander } from './login-handler';
import { UserHandler } from './users-handler';
import { Utils } from './utils';

export class Server {
    private authorizer: Authorizer = new Authorizer();

    public createServer() {
        createServer(
            async (req: IncomingMessage, res: ServerResponse) => {
                const basePath = Utils.getUrlBasePath(req.url);

                switch (basePath) {
                    case 'login':
                        await new LoginHander(req, res, this.authorizer).handleRequest();
                        break;
                    case 'users':
                        await new UserHandler(req, res, this.authorizer).handleRequest();
                        break;
                    default:
                        break;
                }
                res.end();
            }
        ).listen(8080);
        console.log('server started');
    }
}
