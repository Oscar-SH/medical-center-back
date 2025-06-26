import { Response } from 'express';
import { CustomRequest, ParamsUserInterface, CreateUserInterface, UpdateUserInterface } from '../../Interfaces';
import { findAllUsersQuery, findOneUserQuery, createUserQuery, updateUserQuery, deleteUserQuery, resetPasswordQuery } from '../../Services';

export const findAllUsersController = async (req: CustomRequest<ParamsUserInterface, {}>, res: Response) => {
    try {
        const params = req.query;
        const { data, count } = await findAllUsersQuery(params);

        return res.status(200).json({
            ok: true,
            msg: "Find all users was successfully.",
            data,
            count
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find all users."
        });
    }
};

export const findOneUserController = async (req: CustomRequest<{ id_usuario: string }, {}>, res: Response) => {
    try {
        const { id } = req.params;
        const response = await findOneUserQuery(parseInt(id));

        return res.status(200).json({
            ok: true,
            msg: "Find user was successfully.",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find user."
        });
    }
};

export const createUserController = async (req: CustomRequest<{}, CreateUserInterface>, res: Response) => {
    try {
        const body = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await createUserQuery(body, jwt);

        return res.status(200).json({
            ok: true,
            msg: "User created was successfully.",
            data: response
        });
    } catch (error) {
        console.error(error);
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
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await updateUserQuery(body, jwt);

        return res.status(200).json({
            ok: true,
            msg: "User updated was successfully.",
            data: response
        });
    } catch (error) {
        console.error(error);
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
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await deleteUserQuery(id, jwt);

        return res.status(200).json({
            ok: true,
            msg: "User deleted was successfully.",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to delete user."
        });
    }
};

export const resetPasswordController = async (req: CustomRequest<{}, { id: number }>, res: Response) => {
    try {
        const { id } = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await resetPasswordQuery(id, jwt);

        return res.status(200).json({
            ok: true,
            msg: "User password reset was successfully.",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to reset password user."
        });
    }
};