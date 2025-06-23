import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../Utils/dbKnex';
import { RegistroBitacora } from '../Classes/bitacoraClass';
import { DoctorInterface, ParamsDoctorInterface, ResponseDoctorInterface, ResponseDoctorTableInterface, UpdateDoctorInterface } from '../Interfaces';

export const findAllDoctorsQuery = ({ isActives = 'true', page = '1', page_size = '10', text = '' }: ParamsDoctorInterface) => {
    return new Promise<ResponseDoctorTableInterface>(async (resolve, reject) => {
        try {
            const lastRow = (parseInt(page) - 1) * parseInt(page_size);
            let query = knexMedical('cmp_doctors as d')
                .select('d.*', knexMedical.raw('CONCAT_WS(" ", p.second_surname, p.first_surname, p.fullname) as fullperson'))
                .leftJoin('cmp_persons as p', 'd.id_person', '=', 'p.id');

            let query_count = knexMedical('cmp_doctors as d')
                .leftJoin('cmp_persons as p', 'd.id_person', '=', 'p.id').select();

            if (text) {
                const sentence = "CONCAT_WS(' ', p.second_surname, p.first_surname, p.fullname)"
                query = query.where(knexMedical.raw(sentence), 'LIKE', `%${text}%`).orWhere('d.professional_license', 'LIKE', `%${text}%`).orWhere('d.matricula', 'LIKE', `%${text}%`);
                query_count = query_count.where(knexMedical.raw(sentence), 'LIKE', `%${text}%`).orWhere('d.professional_license', 'LIKE', `%${text}%`).orWhere('d.matricula', 'LIKE', `%${text}%`);
            }

            query = isActives === 'true' ? query.whereNull('d.deleted_at') : query.whereNotNull('d.deleted_at');
            query_count = isActives === 'true' ? query_count.whereNull('d.deleted_at') : query_count.whereNotNull('d.deleted_at');

            const [count] = await query_count.count('p.id as total');
            const data = await query.limit(parseInt(page_size)).offset(lastRow);

            resolve({ data, count: parseInt(String(count.total)) });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const findOneDoctorQuery = (id: number) => {
    return new Promise<ResponseDoctorInterface>(async (resolve, reject) => {
        try {
            const doctor = await knexMedical('cmp_doctors as d')
                .select('d.*', 'p.id as id_person')
                .leftJoin('cmp_persons as p', 'd.id_person', '=', 'p.id')
                .where('d.id', '=', id)
                .first();
            resolve(doctor);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createDoctorQuery = (data: DoctorInterface, jwt: string) => {
    return new Promise<ResponseDoctorInterface>(async (resolve, reject) => {
        try {
            let new_id = 0;
            const lastid = await knexMedical('cmp_doctors').select('matricula').orderBy('matricula', 'desc').limit(1);
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    [new_id] = await trx('cmp_doctors').insert({
                        matricula: (lastid[0] ?? 0) + 1,
                        observations: data.observations ?? null,
                        professional_license: data.professional_license,
                        id_person: data.id_person,
                        created_at: moment().format('YYYY-MM-DD'),
                        updated_at: moment().format('YYYY-MM-DD')
                    }).transacting(trx);
                } catch (error) {
                    trx.rollback()
                    console.log(error);
                }
            });
            const response = await findOneDoctorQuery(new_id);
            // new RegistroBitacora('CREAR DOCTOR', `NUEVO id: ${response.id}`, id_usuario).insert();
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const updateDoctorQuery = (data: UpdateDoctorInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    console.log(data);
                    new_id = await trx('cmp_doctors').where('id', '=', data.id).update({
                        observations: data.observations ?? null,
                        professional_license: data.professional_license,
                        updated_at: moment().format('YYYY-MM-DD')
                    }).transacting(trx);
                } catch (error) {
                    trx.rollback();
                    console.log(error);
                }
            });
            const response = await findOneDoctorQuery(new_id);
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const deleteDoctorQuery = (id: number, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('cmp_doctors').where('id', '=', id)
                        .update({
                            deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
                        }).transacting(trx);
                } catch (error) {
                    trx.rollback();
                    console.log(error);
                }
            });
            const response = await findOneDoctorQuery(id);
            resolve(response);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};