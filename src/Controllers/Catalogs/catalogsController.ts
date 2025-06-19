import { Response } from 'express';
import { CustomRequest } from '../../Interfaces';
import { getCatMunicipalitiesQuery, getCatStatesQuery } from '../../Services';

export const getCatStatesController = async (_req: CustomRequest<{}, {}>, res: Response) => {
    try {
        const data = await getCatStatesQuery();

        return res.status(200).json({
            ok: true,
            msg: "Get states was successfully.",
            data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't get states."
        });
    }
};

export const getCatMunicipalitiesController = async (req: CustomRequest<{ id_state: string }, {}>, res: Response) => {
    try {
        const data = await getCatMunicipalitiesQuery(req.query.id_state);

        return res.status(200).json({
            ok: true,
            msg: "Get municipalities was successfully.",
            data
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            error: error,
            msg: "Can't get municipalities."
        });
    }
};