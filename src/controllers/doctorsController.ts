import { Response } from 'express';
import { CustomRequest } from '../interfaces/generalInterface';
import { CreateDoctorInterface, UpdateDoctorInterface } from '../interfaces/doctorsInterface';
import { findAllDoctorsQuery, findOneDoctorQuery, createDoctorQuery, updateDoctorQuery, deleteDoctorQuery } from '../helpers/doctorHelpers';

export const findAllDoctorsController = async (req: CustomRequest<{}, {}>, res: Response) => {
    try {
        const response = await findAllDoctorsQuery();

        return res.status(200).json({
            ok: true,
            msg: "Find all doctors was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find all doctors."
        });
    }
};

export const findOneDoctorController = async (req: CustomRequest<{ id: string }, {}>, res: Response) => {
    try {
        const { id } = req.params;
        const response = await findOneDoctorQuery(parseInt(id));

        return res.status(200).json({
            ok: true,
            msg: "Find doctor was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find doctor."
        });
    }
};

export const createDoctorController = async (req: CustomRequest<{}, CreateDoctorInterface>, res: Response) => {
    try {
        const body = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await createDoctorQuery(body, parseInt(id_usuario));

        return res.status(200).json({
            ok: true,
            msg: "Doctor created was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to create doctor."
        });
    }
};

export const updateDoctorController = async (req: CustomRequest<{}, UpdateDoctorInterface>, res: Response) => {
    try {
        const body = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await updateDoctorQuery(body, parseInt(id_usuario));

        return res.status(200).json({
            ok: true,
            msg: "Doctor updated was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to update doctor."
        });
    }
};

export const deleteDoctorController = async (req: CustomRequest<{}, { id: number }>, res: Response) => {
    try {      
        const { id } = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await deleteDoctorQuery(id, parseInt(id_usuario), true);

        return res.status(200).json({
            ok: true,
            msg: "Doctor deleted was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to delete doctor."
        });
    }
};

export const restoreDoctorController = async (req: CustomRequest<{}, { id: number }>, res: Response) => {
    try {      
        const { id } = req.body;
        const headers = req.headers;
        let id_usuario = headers['x-access-id-user'] ?? '-1';
        const response = await deleteDoctorQuery(id, parseInt(id_usuario), false);

        return res.status(200).json({
            ok: true,
            msg: "Doctor deleted was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to delete doctor."
        });
    }
};