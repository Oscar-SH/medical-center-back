import { Response } from 'express';
import { CatClinicsInterface, CustomRequest, ParamsCatClinicInterface, UpdateCatClinicsInterface } from '../../Interfaces';
import { getAllClinicsQuery, findClinicQuery, createClinicQuery, updateClinicQuery, deleteClinicQuery } from '../../Services';

export const getAllClinicsQueryController = async (req: CustomRequest<ParamsCatClinicInterface, {}>, res: Response) => {
    try {
        const params = req.query;
        const { data, count } = await getAllClinicsQuery(params);

        return res.status(200).json({
            ok: true,
            msg: "Find clinic was successfully.",
            data,
            count
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find clinics."
        });
    }
};

export const findClinicController = async (req: CustomRequest<{}, {}>, res: Response) => {
    try {
        const data = await findClinicQuery(parseInt(req.params.id ?? '0'));

        return res.status(200).json({
            ok: true,
            msg: "Find clinic was successfully.",
            data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't find clinic."
        });
    }
};

export const createClinicController = async (req: CustomRequest<{}, CatClinicsInterface>, res: Response) => {
    try {
        const body = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await createClinicQuery(body, jwt);

        return res.status(200).json({
            ok: true,
            msg: "Clinic created was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to create clinic."
        });
    }
};

export const updateClinicController = async (req: CustomRequest<{}, UpdateCatClinicsInterface>, res: Response) => {
    try {
        const body = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await updateClinicQuery(body, jwt);

        return res.status(200).json({
            ok: true,
            msg: "Clinic updated was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to update clinic."
        });
    }
};

export const deleteClinicController = async (req: CustomRequest<{}, { id: number }>, res: Response) => {
    try {
        const { id } = req.body;
        const jwt = req.header('x-access-jwt') ?? '';
        const response = await deleteClinicQuery(id, jwt);

        return res.status(200).json({
            ok: true,
            msg: "Clinic deleted was successfully.",
            data: response
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Error to delete clinic."
        });
    }
};