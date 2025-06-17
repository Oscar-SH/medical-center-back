import fs from 'fs';
import cors from 'cors';
import path from 'path';
import colors from 'colors';
import express, { Express } from 'express';
import http, { Server as HTTPServer } from 'http';
import personRouter from '../Routes/personRouter';
import authRouter from '../Routes/Admin/authRouter';
import doctorsRouter from '../Routes/doctorsRouter';
import { verifyToken } from '../Helpers/authHelper';
import https, { Server as HTTPSServer } from 'https';
import rolesRouter from '../Routes/Admin/rolesRouter';
import usersRouter from '../Routes/Admin/usersRouter';
import permissionsRouter from '../Routes/Admin/permissionsRouter';

class Server {
    public port: number;
    private app: Express;
    private server: HTTPServer | HTTPSServer;

    constructor() {
        this.app = express();
        this.port = parseInt(`${process.env.PORT_API}`);
        this.server = process.env.ENVIRONMENT == 'productivo' ?
            https.createServer({
                cert: fs.readFileSync('/cert/medicalcenter.com.crt'),
                key: fs.readFileSync('/cert/medicalcenter.com.key')
            }, this.app)
            : http.createServer(this.app);
    };

    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(express.json());
        this.app.use(cors({ origin: '*' }));
        this.app.use('/', authRouter);
        this.app.use('/roles', verifyToken, rolesRouter);
        this.app.use('/users', verifyToken, usersRouter);
        this.app.use('/persons', verifyToken, personRouter);
        this.app.use('/doctors', verifyToken, doctorsRouter);
        this.app.use('/permissions', verifyToken, permissionsRouter);
    };

    execute() {
        this.middlewares();
        this.server.listen(this.port, () => {
            process.env.ENVIRONMENT == 'productivo'
                ? console.log(`Server Settings ready in https://medicalcenter.com:${this.port}`.america)
                : console.log(`Server Settings ready in http://localhost:${this.port}`.rainbow);
        });
    };
};

export default Server;