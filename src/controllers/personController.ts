import { Response } from 'express';
import { CustomRequest } from '../interfaces/generalInterface';
import { PersonInterface, UpdatePersonInterface } from '../interfaces/personsInterface';
import { createPersonQuery, deletePersonQuery, findAllPersonsQuery, findOnePersonQuery, updatePersonQuery } from '../helpers/personHelpers';

export const findAllPersonsController = async (req: CustomRequest<{}, {}>, res: Response) => {
    try {
        const response = await findAllPersonsQuery();

        return res.status(200).json({
            ok: true,
            msg: "Find all persons was successfully.",
            data: response
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
        const { id } = req.query;
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
        const response = await deletePersonQuery(id, parseInt(id_usuario));

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