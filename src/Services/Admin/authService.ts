import { Knex } from 'knex';
import moment from 'moment';
import { findOneUserQuery } from '..';
import { knexMedical } from '../../Utils/dbKnex';
import { validatePassword } from '../../Helpers/createUserProps';
import { generateToken, decodeToken, validateToken } from '../../Helpers/authHelper';
import { InsertTokenInterface, LoginInterface, RowUserInterface } from '../../Interfaces';

export const insertTokenQuery = ({ id = 0, jwt = '' }: InsertTokenInterface) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('users').where('id', '=', id).update({
                        jwt: jwt ? jwt : null,
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error(error, 'Error en insert token.');
                    throw error;
                }
            });
            const response = await findOneUserQuery(id);
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const loginQuery = ({ password = '', user = '' }: LoginInterface) => {
    return new Promise(async (resolve, reject) => {
        try {
            const aux_user = await knexMedical('users').select().where('username', '=', user).first();
            if (aux_user && await validatePassword(password, aux_user.password)) {
                const jwt = generateToken(aux_user);
                const response = await insertTokenQuery({ id: aux_user.id, jwt });
                resolve(response);
            } else {
                reject('Credenciales invalidas.')
            }
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const logoutQuery = (id: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await insertTokenQuery({ id, jwt: '' });
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const verifyInLine = (jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let response: RowUserInterface | null = null;
            const jwt_decoded = decodeToken(jwt);
            const is_active = validateToken(jwt);
            if (is_active && typeof (is_active) === 'object') {
                response = await findOneUserQuery(is_active.id);
            } else if (!is_active && (jwt_decoded && typeof (jwt_decoded) === 'object')) {
                await logoutQuery(jwt_decoded.id);
            }
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};