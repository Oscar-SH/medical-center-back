import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { RowUserInterface } from '../Interfaces/Admin/usersInterface';

const SECRET_KEY = process.env.SECRET_KEY || 'secreto';

export const generateToken = (user: RowUserInterface) => {
    return jwt.sign({ id: user.id, name: user.username }, SECRET_KEY, { expiresIn: '1d' });
};

export const decodeToken = (token: string) => {
    try {
        const decoded = jwt.decode(token);
        return decoded;
    } catch (error) {
        return null;
    }
};

export const validateToken = (token: string) => {
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (error) {
        return null;
    }
};

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('x-access-jwt');
    if (!token) {
        return res.status(401).json({ message: 'Acceso denegado, token requerido' });
    }
    try {
        const decoded = validateToken(token);
        req.body.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};