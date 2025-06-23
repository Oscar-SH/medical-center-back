import { Response } from 'express';
import { CustomRequest, ParamsRoleInterface, RoleInterface, UpdateRoleInterface } from '../../Interfaces';
import { createRoleQuery, deleteRoleQuery, getAllRolesQuery, findRoleQuery, updateRoleQuery } from '../../Services';

export const findAllRolesController = async (req: CustomRequest<ParamsRoleInterface, {}>, res: Response) => {
    try {
        const params = req.query;
        const { data, count } = await getAllRolesQuery(params);

        return res.status(200).json({
            ok: true,
            msg: "Find all roles was successfully.",
            data,
            count
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find all roles."
        });
    }
};

export const findOneRoleController = async (req: CustomRequest<{}, {}>, res: Response) => {
    try {
        const { id } = req.params;
        const response = await findRoleQuery(parseInt(id));

        return res.status(200).json({
            ok: true,
            msg: "Find role was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find role."
        });
    }
};

export const createRoleController = async (req: CustomRequest<{}, RoleInterface>, res: Response) => {
    try {
        const body = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await createRoleQuery(body, jwt);

        return res.status(200).json({
            ok: true,
            msg: "Role created was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to create role."
        });
    }
};

export const updateRoleController = async (req: CustomRequest<{}, UpdateRoleInterface>, res: Response) => {
    try {
        const body = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await updateRoleQuery(body, jwt);

        return res.status(200).json({
            ok: true,
            msg: "Role updated was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to update role."
        });
    }
};

export const deleteRoleController = async (req: CustomRequest<{}, { id: number }>, res: Response) => {
    try {
        const { id } = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await deleteRoleQuery(id, jwt);

        return res.status(200).json({
            ok: true,
            msg: "Role deleted was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to delete role."
        });
    }
};