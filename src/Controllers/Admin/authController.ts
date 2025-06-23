import { Response } from 'express';
import { verifyInLine, loginQuery } from '../../Services';
import { CustomRequest, LoginInterface } from '../../Interfaces';

export const userInfoController = async (req: CustomRequest<{}, {}>, res: Response) => {
    try {
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await verifyInLine(jwt);

        return res.status(200).json({
            ok: true,
            msg: 'Get user info succesfully.',
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to get user info."
        });
    }
};

export const loginController = async (req: CustomRequest<{}, LoginInterface>, res: Response) => {
    try {
        const body = req.body;
        const response = await loginQuery(body);

        return res.status(200).json({
            ok: true,
            msg: "Login succesfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to try login."
        });
    }
};