import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../utils/dbKnex';
// import { setRegistroBitacora } from './bitacoraHelper';
import { PersonInterface, UpdatePersonInterface } from '../interfaces/personsInterface';

export const findAllPersonsQuery = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await knexMedical('cmp_persons').select().whereNull('deleted_at');
            resolve(users);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const findOnePersonQuery = (id: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await knexMedical('cmp_persons').select().where('id', '=', id).whereNull('deleted_at').first();
            resolve(user);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createPersonQuery = (data: PersonInterface, id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;

            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                // try {
                    [new_id] = await trx('cmp_persons').insert(data).transacting(trx);
                // } catch (error) {
                //     trx.rollback()
                // }
            });

            const response = findOnePersonQuery(new_id);

            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const updatePersonQuery = (data: UpdatePersonInterface, id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            // await knexMedical.transaction(async (trx: Knex.Transaction) => {
            //     await trx('cmp_persons').where('id', '=', data.id).update(data).transacting(trx);
            // });
            resolve(data);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const deletePersonQuery = (id: number, id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            // await knexMedical.transaction(async (trx: Knex.Transaction) => {
            //     await trx('cmp_persons').where('id', '=', id).update({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss') }).transacting(trx);
            // });
            resolve(id);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};