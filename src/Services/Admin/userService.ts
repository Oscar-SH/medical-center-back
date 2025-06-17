import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../../Utils/dbKnex';
import { RegistroBitacora } from '../../Classes/bitacoraClass';
import { createDoctorQuery, deleteDoctorQuery, sendEmail } from '..';
import { createUserParams, generateRandomPassword } from '../../Helpers/createUserProps';
import { CreateUserInterface, ParamsUserInterface, ResponseUserTableInterface, RowUserInterface, UpdateUserInterface } from '../../Interfaces';

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

export const findOneUserQuery = (id_usuario: number = -1) => {
    return new Promise<RowUserInterface | null>(async (resolve, reject) => {
        try {
            let user: RowUserInterface | null = null;
            if (id_usuario > 0) {
                user = await knexMedical('users as u')
                    .leftJoin('cmp_doctors as d', 'u.id_doctor', '=', 'd.id')
                    .leftJoin('cmp_persons as p', 'd.id_person', '=', 'p.id')
                    .select(
                        'u.*',
                        knexMedical.raw('CONCAT_WS(" ", p.first_surname, p.second_surname, p.fullname) as persona')
                    )
                    .where('u.id', '=', id_usuario).whereNull('u.deleted_at').first();
            }
            resolve(user);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const findUsernameQuery = (name: string) => {
    return new Promise<boolean>(async (resolve, reject) => {
        try {
            const user = await knexMedical('users').select().where('username', '=', name).whereNull('deleted_at').first();

            resolve(!!user);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createUserQuery = (data: CreateUserInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;
            const newuser = await createUserParams(data.id_person);
            const doctor = await createDoctorQuery(data, jwt);
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    [new_id] = await trx('users').insert({
                        username: newuser.username,
                        email: data.email,
                        password: newuser.password.hash,
                        id_doctor: doctor.id,
                        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error(error, 'Error en create user.');
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('USUARIOS', 'CREAR USUARIO', `USUARIO CREADO CON ID ${new_id}`, jwt);
            await bitacora.insert();
            const response = await findOneUserQuery(new_id);
            if (response)
                await sendEmail(response.email, 'Datos de usuario.', `Usuario: ${newuser.username}, Contraseña: ${newuser.password.plain}`);
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const updateUserQuery = (data: UpdateUserInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('users').where('id', '=', data.id).update({
                        email: data.email,
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error(error, 'Error en update user.');
                    throw error;
                }
            });
            const response = await findOneUserQuery(data.id);
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const deleteUserQuery = (id: number, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('users').where('id', '=', id).update({
                        deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error(error, 'Error en delete user.');
                    throw error;
                }
            });
            const response = await findOneUserQuery(id);
            if (response)
                await deleteDoctorQuery(response.id_doctor, jwt);
            resolve(id);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const resetPasswordQuery = (id: number, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newPassword = await generateRandomPassword();
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                await trx('users').where('id', '=', id).update({
                    password: newPassword.hash,
                    updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                }).transacting(trx);
            });
            const response = await findOneUserQuery(id);
            if (response) await sendEmail(response.email, 'Restaurar contraseña.', `Nueva contraseña: ${newPassword.plain}`);
            resolve(id);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};