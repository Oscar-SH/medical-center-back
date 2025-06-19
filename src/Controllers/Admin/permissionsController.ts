import { Response } from 'express';
import { CustomRequest, ParamsPermissionsInterface, PermissionInterface, UpdatePermissionInterface } from '../../Interfaces';
import { createPermissionQuery, getAllPermissionsQuery, findPermissionQuery, updatePermissionQuery, deletePermissionQuery } from '../../Services';

export const findAllPermissionsController = async (req: CustomRequest<ParamsPermissionsInterface, {}>, res: Response) => {
    try { 
        const params = req.query;
        const { data, count } = await getAllPermissionsQuery(params);

        return res.status(200).json({
            ok: true,
            msg: "Find all permissions was successfully.",
            data,
            count
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find all permissions."
        });
    }
};

export const findOnePermissionController = async (req: CustomRequest<{}, {}>, res: Response) => {
    try {
        const { id } = req.params;
        const response = await findPermissionQuery(parseInt(id));

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

export const createPermissionController = async (req: CustomRequest<{}, PermissionInterface>, res: Response) => {
    try {
        const body = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await createPermissionQuery(body, jwt);

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

export const updatePermissionController = async (req: CustomRequest<{}, UpdatePermissionInterface>, res: Response) => {
    try {
        const body = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await updatePermissionQuery(body, jwt);

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

export const deletePermissionController = async (req: CustomRequest<{}, { id: number }>, res: Response) => {
    try {
        const { id } = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await deletePermissionQuery(id, jwt);

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