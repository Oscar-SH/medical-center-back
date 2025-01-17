import { Response } from 'express';
import { CustomRequest } from '../interfaces/generalInterface';
import { UpdateUserInterface, UserInterface } from '../interfaces/usersInterface';
import { createUserQuery, deleteUserQuery, findAllUsersQuery, findOneUserQuery, updateUserQuery } from '../helpers/usersHelpers';

export const findAllUsersController = async (req: CustomRequest<{}, {}>, res: Response) => {
    try {
        const response = await findAllUsersQuery();

        return res.status(200).json({
            ok: true,
            msg: "Find all users was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find all users."
        });
    }
};

export const findOneUserController = async (req: CustomRequest<{ id_usuario: string }, {}>, res: Response) => {
    try {
        const { id_usuario } = req.query;
        const response = await findOneUserQuery(parseInt(id_usuario));

        return res.status(200).json({
            ok: true,
            msg: "Find user was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find user."
        });
    }
};

export const createUserController = async (req: CustomRequest<{}, UserInterface>, res: Response) => {
    try {
        const body = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await createUserQuery(body, parseInt(id_usuario));

        return res.status(200).json({
            ok: true,
            msg: "User created was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to create user."
        });
    }
};

export const updateUserController = async (req: CustomRequest<{}, UpdateUserInterface>, res: Response) => {
    try {
        const body = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await updateUserQuery(body, parseInt(id_usuario));

        return res.status(200).json({
            ok: true,
            msg: "User updated was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to update user."
        });
    }
};

export const deleteUserController = async (req: CustomRequest<{}, { id: number }>, res: Response) => {
    try {
        const { id } = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await deleteUserQuery(id, parseInt(id_usuario));

        return res.status(200).json({
            ok: true,
            msg: "User deleted was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to delete user."
        });
    }
};