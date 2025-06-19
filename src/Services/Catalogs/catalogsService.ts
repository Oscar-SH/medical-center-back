import { knexMedical } from '../../Utils/dbKnex';

export const getCatStatesQuery = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await knexMedical('cat_states');
            resolve(data);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};


export const getCatMunicipalitiesQuery = (id_state: string = '-1') => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await knexMedical('cat_municipalities').where('id_state', '=', parseInt(id_state));
            resolve(data);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};