import { Request } from 'express';
import { IncomingHttpHeaders } from 'http';

export interface CustomRequest<T extends Record<string, any>, R extends Object> extends Request {
    body: R;
    query: T;
    headers: IncomingHttpHeaders & { 'x-access-id-user'?: string };
}

export interface HeaderExcelJSBookElement {
    header: string;
    key: string;
    width: number;
}