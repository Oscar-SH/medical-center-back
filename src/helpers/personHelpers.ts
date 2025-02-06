import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../utils/dbKnex';
// import { setRegistroBitacora } from './bitacoraHelper';
import { PersonInterface, ReponsePersonInterface, UpdatePersonInterface } from '../interfaces/personsInterface';

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
    return new Promise<ReponsePersonInterface>(async (resolve, reject) => {
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
    return new Promise<ReponsePersonInterface>(async (resolve, reject) => {
        try {
            let new_id = 0;
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    [new_id] = await trx('cmp_persons').insert({
                        fullname: data.fullname,
                        first_surname: data.first_surname,
                        second_surname: data.second_surname,
                        birthdate: data.birthdate,
                        curp: data.curp,
                        rfc: data.rfc,
                        sex: data.sex,
                        state_birth: data.state_birth,
                        created_at: moment().format('YYYY-MM-DD'),
                        updated_at: moment().format('YYYY-MM-DD')
                    }).transacting(trx);
                } catch (error) {
                    trx.rollback();
                }
            });

            const response = await findOnePersonQuery(new_id);

            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const updatePersonQuery = (data: UpdatePersonInterface, id_usuario: number) => {
    return new Promise<ReponsePersonInterface>(async (resolve, reject) => {
        try {
            let new_id = 0;
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    new_id = await trx('cmp_persons').where('id', '=', data.id).update({
                        fullname: data.fullname,
                        first_surname: data.first_surname,
                        second_surname: data.second_surname,
                        birthdate: data.birthdate,
                        curp: data.curp,
                        rfc: data.rfc,
                        sex: data.sex,
                        state_birth: data.state_birth,
                        updated_at: moment().format('YYYY-MM-DD')
                    }).transacting(trx);
                } catch (error) {
                    trx.rollback();
                }
            });
            const response = await findOnePersonQuery(new_id);
            resolve(response);
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