import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../utils/dbKnex';
// import { setRegistroBitacora } from './bitacoraHelper';
import { UpdateUserInterface, UserInterface } from '../interfaces/usersInterface';

export const findAllUsersQuery = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const users = await knexMedical('users as u').select(
                'u.*',
            )
            .whereNull('deleted_at');
            resolve(users);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const findOneUserQuery = (id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await knexMedical('users').select().where('id', '=', id_usuario).whereNull('deleted_at').first();
            resolve(user);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createUserQuery = (data: UserInterface, id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;

            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                // try {
                    [new_id] = await trx('users').insert(data).transacting(trx);
                // } catch (error) {
                //     trx.rollback()
                // }
            });

            const response = findOneUserQuery(new_id);

            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const updateUserQuery = (data: UpdateUserInterface, id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            // await knexMedical.transaction(async (trx: Knex.Transaction) => {
            //     await trx('users').where('id', '=', data.id).update(data).transacting(trx);
            // });
            resolve(data);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const deleteUserQuery = (id: number, id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            // await knexMedical.transaction(async (trx: Knex.Transaction) => {
            //     await trx('users').where('id', '=', id).update({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss') }).transacting(trx);
            // });
            resolve(id);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};