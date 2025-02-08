import { Response } from 'express';
import { CustomRequest } from '../interfaces/generalInterface';
import { ParamsPersonInterface, PersonInterface, UpdatePersonInterface } from '../interfaces/personsInterface';
import { createPersonQuery, changeStatusPersonQuery, findAllPersonsQuery, findOnePersonQuery, updatePersonQuery } from '../helpers/personHelpers';

export const findAllPersonsController = async (req: CustomRequest<ParamsPersonInterface, {}>, res: Response) => {
    try {
        const params = req.query;
        const { count, data } = await findAllPersonsQuery(params);

        return res.status(200).json({
            ok: true,
            msg: "Find all persons was successfully.",
            data,
            count
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find all persons."
        });
    }
};

export const findOnePersonController = async (req: CustomRequest<{ id: string }, {}>, res: Response) => {
    try {
        const { id } = req.params;
        const response = await findOnePersonQuery(parseInt(id));

        return res.status(200).json({
            ok: true,
            msg: "Find person was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find person."
        });
    }
};

export const createPersonController = async (req: CustomRequest<{}, PersonInterface>, res: Response) => {
    try {
        const body = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await createPersonQuery(body, parseInt(id_usuario));

        return res.status(200).json({
            ok: true,
            msg: "Person created was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to create person."
        });
    }
};

export const updatePersonController = async (req: CustomRequest<{}, UpdatePersonInterface>, res: Response) => {
    try {
        const body = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await updatePersonQuery(body, parseInt(id_usuario));

        return res.status(200).json({
            ok: true,
            msg: "Person updated was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to update person."
        });
    }
};

export const deletePersonController = async (req: CustomRequest<{}, { id: number }>, res: Response) => {
    try {
        const { id } = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await changeStatusPersonQuery(id, parseInt(id_usuario), true);

        return res.status(200).json({
            ok: true,
            msg: "Person deleted was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to delete person."
        });
    }
};

export const restorePersonController = async (req: CustomRequest<{}, { id: number }>, res: Response) => {
    try {
        const { id } = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await changeStatusPersonQuery(id, parseInt(id_usuario), false);

        return res.status(200).json({
            ok: true,
            msg: "Person restored was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to restore person."
        });
    }
};