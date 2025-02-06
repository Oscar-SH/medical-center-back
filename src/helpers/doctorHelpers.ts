import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../utils/dbKnex';
// import { setRegistroBitacora } from './bitacoraHelper';
import { createPersonQuery, updatePersonQuery } from './personHelpers';
import { CreateDoctorInterface, UpdateDoctorInterface } from '../interfaces/doctorsInterface';

export const findAllDoctorsQuery = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctors = await knexMedical('cmp_doctors as d')
                .select('d.*', knexMedical.raw('CONCAT_WS(" ", p.second_surname, p.first_surname, p.fullname) as fullperson'))
                .leftJoin('cmp_persons as p', 'd.id_person', '=', 'p.id')
            // .whereNull('d.deleted_at');
            resolve(doctors);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const findOneDoctorQuery = (id: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctor = await knexMedical('cmp_doctors as d')
                .select('d.*', 'p.*', 'p.id as id_person')
                .leftJoin('cmp_persons as p', 'd.id_person', '=', 'p.id')
                // .whereNull('d.deleted_at')
                .first();
            resolve(doctor);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createDoctorQuery = (data: CreateDoctorInterface, id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;
            const person = await createPersonQuery(data, id_usuario);
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    [new_id] = await trx('cmp_doctors').insert({
                        observations: data.observations ?? null,
                        professional_license: data.professional_license,
                        id_person: person.id,
                        created_at: moment().format('YYYY-MM-DD'),
                        updated_at: moment().format('YYYY-MM-DD')
                    }).transacting(trx);
                } catch (error) {
                    trx.rollback()
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

export const updateDoctorQuery = (data: UpdateDoctorInterface, id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;
            await updatePersonQuery({ ...data, id: data.id_person }, id_usuario);
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    new_id = await trx('cmp_doctors').where('id', '=', data.id).update({
                        observations: data.observations ?? null,
                        professional_license: data.professional_license,
                        updated_at: moment().format('YYYY-MM-DD')
                    }).transacting(trx);
                } catch (error) {
                    trx.rollback();
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

export const deleteDoctorQuery = (id: number, id_usuario: number, is_delete: boolean) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('cmp_doctors').where('id', '=', id)
                        .update({ 
                            deleted_at: is_delete ? moment().format('YYYY-MM-DD HH:mm:ss') : null
                        }).transacting(trx);
                } catch (error) {
                    trx.rollback();
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