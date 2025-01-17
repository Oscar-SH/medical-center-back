import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../utils/dbKnex';

export const setRegistroBitacora = (action: string, message: string, id_user: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            // const user = await knexSica('users').select().where('id_empleado', '=', id_user).first();
            // await knexSiem.transaction(async (trx: Knex.Transaction) => {
            //     await trx('siem_bitacora').insert({
            //         nick: user.username,
            //         modulo: 'SIEM',
            //         datos: action + '-' + message,
            //         idUsuario: id_user,
            //         created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            //         updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
            //     }).transacting(trx);
            // });
            resolve(message);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};