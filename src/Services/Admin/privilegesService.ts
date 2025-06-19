import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../../Utils/dbKnex';
import { RegistroBitacora } from '../../Classes/bitacoraClass';
import { ParamsUserInterface, PrivilegesInterface, PrivilegesParamsInterface, ResponseUserTableInterface } from '../../Interfaces';

export const findAllUsersQuery = ({
    text = '',
    page = '1',
    page_size = '10',
    isActives = 'true'
}: ParamsUserInterface) => {
    return new Promise<ResponseUserTableInterface>(async (resolve, reject) => {
        try {
            const lastRow = (parseInt(page) - 1) * parseInt(page_size);
            let query = knexMedical('users as u')
                .leftJoin('cmp_doctors as d', 'u.id_doctor', '=', 'd.id')
                .leftJoin('cmp_persons as p', 'd.id_person', '=', 'p.id')
                .select(
                    'u.*',
                    knexMedical.raw('CONCAT_WS(" ", p.first_surname, p.second_surname, p.fullname) as persona'),
                    'd.matricula'
                );
            if (text.length > 0) {
                query = query.where(knexMedical.raw("CONCAT_WS(' ', p.second_surname, p.first_surname, p.fullname)"), 'LIKE', `%${text}%`)
                    .orWhere('d.matricula', 'LIKE', `%${text}%`)
                    .orWhere('u.email', 'LIKE', `%${text}%`);
            }
            query = isActives === 'true' ? query.whereNull('u.deleted_at') : query.whereNotNull('u.deleted_at');
            const [count] = await query.clone().count('u.id as total');
            const data = await query.clone().limit(parseInt(page_size)).offset(lastRow);
            resolve({ data, count: parseInt(String(count.total)) });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const setClinicRoles = (data: PrivilegesParamsInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const exist = knexMedical('')
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createClinicRoles = (data: PrivilegesInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    [new_id] = await trx('users').insert({
                        // username: newuser.username,
                        // email: data.email,
                        // password: newuser.password.hash,
                        // id_doctor: doctor.id,
                        // created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                        // updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error(error, 'Error en create user.');
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('USUARIOS', 'CREAR USUARIO', `USUARIO CREADO CON ID ${new_id}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const setPrivilegesUser = (data: PrivilegesInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            for (const clinic of data.privileges) {
                await setClinicRoles(clinic, jwt);
            }
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

// export const updateUserQuery = (data: UpdateUserInterface, jwt: string) => {
//     return new Promise(async (resolve, reject) => {
//         try {
//             await knexMedical.transaction(async (trx: Knex.Transaction) => {
//                 try {
//                     await trx('users').where('id', '=', data.id).update({
//                         email: data.email,
//                         updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
//                     }).transacting(trx);
//                 } catch (error) {
//                     console.error(error, 'Error en update user.');
//                     throw error;
//                 }
//             });
//             resolve('OK');
//         } catch (error) {
//             console.error(error);
//             reject(error);
//         }
//     });
// };