import { createServer, IncomingMessage, ServerResponse } from 'http';
import { Authorizer } from '../authorization/authorizer';
import { LoginHander } from './login-handler';
import { Utils } from './utils';

export class Server {
    private authorizer: Authorizer = new Authorizer();

    public createServer() {
        createServer(
            (req: IncomingMessage, res: ServerResponse) => {
                console.log('got request from: ', req.url);
                const basePath = Utils.getUrlBasePath(req.url);

                switch (basePath) {
                    case 'login':
                        new LoginHander(req, res, this.authorizer).handleRequest();
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
 