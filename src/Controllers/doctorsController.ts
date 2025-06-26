import { Response } from 'express';
import { findAllDoctorsQuery, findOneDoctorQuery, updateDoctorQuery } from '../Services';
import { CustomRequest, ParamsDoctorInterface, UpdateDoctorInterface } from '../Interfaces';

export const findAllDoctorsController = async (req: CustomRequest<ParamsDoctorInterface, {}>, res: Response) => {
    try {
        const params = req.query;
        const { count, data } = await findAllDoctorsQuery(params);

        return res.status(200).json({
            ok: true,
            msg: "Find all doctors was successfully.",
            data,
            count
        });
    } catch (error) {
        console.error(error);
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
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find doctor."
        });
    }
};

export const updateDoctorController = async (req: CustomRequest<{}, UpdateDoctorInterface>, res: Response) => {
    try {
        const body = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await updateDoctorQuery(body, jwt);

        return res.status(200).json({
            ok: true,
            msg: "Doctor updated was successfully.",
            data: response
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to update doctor."
        });
    }
};