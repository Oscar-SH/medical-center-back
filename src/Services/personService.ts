import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../Utils/dbKnex';
import { RegistroBitacora } from '../Classes/bitacoraClass';
import { ParamsPersonInterface, PersonInterface, ReponsePersonInterface, ResponsePersonTableInterface, UpdatePersonInterface } from '../Interfaces';

export const findAllPersonsQuery = ({
    text = '',
    page = '1',
    page_size = '10',
    isActives = 'true'
}: ParamsPersonInterface) => {
    return new Promise<ResponsePersonTableInterface>(async (resolve, reject) => {
        try {
            const lastRow = (parseInt(page) - 1) * parseInt(page_size);
            let query = knexMedical('cmp_persons as p')
                .leftJoin('cmp_doctors as d', 'p.id', '=', 'd.id_person')
                .select('p.*', knexMedical.raw('d.id as id_doctor'));
            let query_count = knexMedical('cmp_persons as p').select();

            if (text) {
                const sentence = "CONCAT_WS(' ', p.second_surname, p.first_surname, p.fullname)"
                query = query.where(knexMedical.raw(sentence), 'LIKE', `%${text}%`).orWhere('p.curp', 'LIKE', `%${text}%`).orWhere('p.rfc', 'LIKE', `%${text}%`);
                query_count = query_count.where(knexMedical.raw(sentence), 'LIKE', `%${text}%`).orWhere('p.curp', 'LIKE', `%${text}%`).orWhere('p.rfc', 'LIKE', `%${text}%`);
            }

            query = isActives === 'true' ? query.whereNull('p.deleted_at') : query.whereNotNull('p.deleted_at');
            query_count = isActives === 'true' ? query_count.whereNull('p.deleted_at') : query_count.whereNotNull('p.deleted_at');

            const [count] = await query_count.count('p.id as total');
            const data = await query.limit(parseInt(page_size)).offset(lastRow);

            resolve({ data, count: parseInt(String(count.total)) });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const findOnePersonQuery = (id: number = -1) => {
    return new Promise<ReponsePersonInterface>(async (resolve, reject) => {
        try {
            let person = null;
            if (id > 0)
                person = await knexMedical('cmp_persons').select().where('id', '=', id).whereNull('deleted_at').first();
            resolve(person);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createPersonQuery = (data: PersonInterface, jwt: string) => {
    return new Promise<ReponsePersonInterface | null>(async (resolve, reject) => {
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
                    console.error('Error in create person:', error);
                    throw error;
                }
            });

            const bitacora = new RegistroBitacora('PERSONAS', 'CREAR PERSONA', `PERSONA CREADA CON ID ${new_id}`, jwt);
            await bitacora.insert();

            const response = await findOnePersonQuery(new_id);

            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const updatePersonQuery = (data: UpdatePersonInterface, jwt: string) => {
    return new Promise<ReponsePersonInterface | null>(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('cmp_persons').where('id', '=', data.id).update({
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
                    console.error('Error in update person:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('PERSONAS', 'EDITAR PERSONA', `PERSONA EDITADA CON ID ${data.id}`, jwt);
            await bitacora.insert();
            const response = await findOnePersonQuery(data.id);
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const changeStatusPersonQuery = (id: number, jwt: string, is_delete: boolean) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('cmp_persons').where('id', '=', id)
                        .update({ deleted_at: is_delete ? moment().format('YYYY-MM-DD') : null })
                        .transacting(trx);
                } catch (error) {
                    console.error('Error in change status person:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('PERSONAS', `${is_delete ? 'ELIMINAR' : 'RECUPERAR'} PERSONA`, `PERSONA ${is_delete ? 'ELIMINADA' : 'RECUPERADA'} CON ID ${id}`, jwt);
            await bitacora.insert();
            const response = await findOnePersonQuery(id);
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};