import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../utils/dbKnex';
// import { setRegistroBitacora } from './bitacoraHelper';
import { DoctorInterface, UpdateDoctorInterface } from '../interfaces/employeesInterface';

export const findAllDoctorsQuery = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctors = await knexMedical('cmp_doctors').select().whereNull('deleted_at');
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
            const doctors = await knexMedical('cmp_doctors').select().where('id', '=', id).whereNull('deleted_at').first();
            resolve(doctors);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createDoctorQuery = (data: DoctorInterface, id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;

            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                // try {
                    [new_id] = await trx('cmp_doctors').insert(data).transacting(trx);
                // } catch (error) {
                //     trx.rollback()
                // }
            });

            const response = findOneDoctorQuery(new_id);

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
            // await knexMedical.transaction(async (trx: Knex.Transaction) => {
            //     await trx('cmp_doctors').where('id', '=', data.id).update(data).transacting(trx);
            // });
            resolve(data);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const deleteDoctorQuery = (id: number, id_usuario: number) => {
    return new Promise(async (resolve, reject) => {
        try {
            // await knexMedical.transaction(async (trx: Knex.Transaction) => {
            //     await trx('cmp_doctors').where('id', '=', id).update({ deleted_at: moment().format('YYYY-MM-DD HH:mm:ss') }).transacting(trx);
            // });
            resolve(id);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};