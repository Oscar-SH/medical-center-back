import { Knex } from 'knex';
import { knexMedical } from '../Utils/dbKnex';
import { RegistroBitacora } from '../Classes/bitacoraClass';

export const registerBitacoraQuery = (data: RegistroBitacora) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('bitacora').insert(data).transacting(trx);
                } catch (error) {
                    console.error('Error en insert bitacora:', error);
                    throw error;
                }
            });
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const registerCatBitacoraQuery = (data: RegistroBitacora) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('cat_bitacora').insert(data).transacting(trx);
                } catch (error) {
                    console.error('Error en insert cat_bitacora:', error);
                    throw error;
                }
            });
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};