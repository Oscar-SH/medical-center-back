import { Response } from 'express';
import { CustomRequest, ParamsPermissionsInterface, PermissionInterface, PrivilegesInterface, UpdatePermissionInterface } from '../../Interfaces';
import { createPermissionQuery, getAllPermissionsQuery, findPermissionQuery, updatePermissionQuery, deletePermissionQuery, getPermissionsUserQuery } from '../../Services';
import { getPrivilegesUserQuery, setPrivilegesUserQuery } from '../../Services/Admin/privilegesService';

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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
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
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to delete user."
        });
    }
};

export const getPrivilegesUserController = async (req: CustomRequest<{ id_user: string }, {}>, res: Response) => {
    try {
        const params = req.query;
        const data = await getPrivilegesUserQuery(params);

        return res.status(200).json({
            ok: true,
            msg: "Get priviliges to user was successfully.",
            data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't get priviliges to user."
        });
    }
};

export const setPrivilegesUserController = async (req: CustomRequest<{}, PrivilegesInterface>, res: Response) => {
    try {
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await setPrivilegesUserQuery(req.body, jwt);

        return res.status(200).json({
            ok: true,
            msg: "Set priviliges to user was successfully.",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to set privileges to user."
        });
    }
};

export const getPermissionsUserController = async (req: CustomRequest<{ id: number; id_clinic: number; }, {}>, res: Response) => {
    try {
        const params = req.query;
        const data = await getPermissionsUserQuery(params.id, params.id_clinic);

        return res.status(200).json({
            ok: true,
            msg: "Get permissions to user was successfully.",
            data
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't get permissions to user."
        });
    }
};