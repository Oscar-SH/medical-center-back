require('colors');
require('dotenv').config();

import Server from './Models/Server';

const server = new Server();

(BigInt.prototype as any).toJSON = function () {
    return parseInt(this.toString());
};

server.execute();
