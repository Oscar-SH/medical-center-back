import fs from 'fs';
import cors from 'cors';
import path from 'path';
import colors from 'colors';
import express, { Express } from 'express';
import usersRouter from '../routes/usersRouter';
import http, { Server as HTTPServer } from 'http';
import personRouter from '../routes/personRouter';
import https, { Server as HTTPSServer } from 'https';
import doctorsRouter from '../routes/doctorsRouter';

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
        this.app.use('/users', usersRouter);
        this.app.use('/persons', personRouter);
        this.app.use('/doctors', doctorsRouter);
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