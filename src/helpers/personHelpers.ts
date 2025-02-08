import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../utils/dbKnex';
// import { setRegistroBitacora } from './bitacoraHelper';
import { ParamsPersonInterface, PersonInterface, ReponsePersonInterface, ResponsePersonTableInterface, UpdatePersonInterface } from '../interfaces/personsInterface';

export const findAllPersonsQuery = ({
    text = '',
    page = '1',
    page_size = '10',
    isActives = 'true'
}: ParamsPersonInterface) => {
    return new Promise<ResponsePersonTableInterface>(async (resolve, reject) => {
        try {
            const lastRow = (parseInt(page) - 1) * parseInt(page_size);
            let query = knexMedical('cmp_persons').select();
            let query_count = knexMedical('cmp_persons').select();

            if (text) {
                const sentence = "CONCAT_WS(' ', second_surname, first_surname, fullname)"
                query = query.where(knexMedical.raw(sentence), 'LIKE', `%${text}%`);
                query_count = query_count.where(knexMedical.raw(sentence), 'LIKE', `%${text}%`);
            }

            if (isActives === 'true') {
                query = query.whereNull('deleted_at');
                query_count = query_count.whereNull('deleted_at');

            } else {
                query = query.whereNotNull('deleted_at');
                query_count = query_count.whereNotNull('deleted_at');
            }

            const [count] = await query_count.count('id as total');
            const data = await query.limit(parseInt(page_size)).offset(lastRow);

            resolve({ data, count: parseInt(String(count.total)) });
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
                        birthdate: moment(data.birthdate).format('YYYY-MM-DD'),
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

export const changeStatusPersonQuery = (id: number, id_usuario: number, is_delete: boolean) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                await trx('cmp_persons').where('id', '=', id)
                    .update({ deleted_at: is_delete ? moment().format('YYYY-MM-DD') : null })
                    .transacting(trx);
            });
            const response = await findOnePersonQuery(id);
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};