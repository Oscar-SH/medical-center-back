import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../../Utils/dbKnex';
import { RegistroBitacora } from '../../Classes/bitacoraClass';
import { CatClinicsInterface, ParamsCatClinicInterface, ResponseCatClinicTableInterface, RowCatClinicInterface, UpdateCatClinicsInterface } from '../../Interfaces';

export const getAllClinicsQuery = ({
    text = '',
    page = '1',
    page_size = '10'
}: ParamsCatClinicInterface) => {
    return new Promise<ResponseCatClinicTableInterface>(async (resolve, reject) => {
        try {
            const lastRow = (parseInt(page) - 1) * parseInt(page_size);
            let query = knexMedical('cat_clinics as c').whereNull('c.deleted_at')
                .leftJoin('cat_municipalities as m', 'c.id_municipality', '=', 'm.id')
                .leftJoin('cat_states as s', 'm.id_state', '=', 's.id')
                .select('c.*', knexMedical.raw('CONCAT_WS(", ", m.name, s.name) as municipality'));

            if (text.length > 0) query = query.where(function () {
                this.whereLike('c.name', `%${text}%`)
                    .orWhereLike('c.fullname', `%${text}%`)
                    .orWhereLike('c.postal_code', `%${text}%`)
                    .orWhereLike('c.rfc', `%${text}%`)
                    .orWhereLike('c.address', `%${text}%`)
                    .orWhere(knexMedical.raw('CONCAT_WS(", ", m.name, s.name)'), 'LIKE', `%${text}%`);
            });

            const [count] = await query.clone().count('c.id as total');
            const data = parseInt(page_size) === 0
                ? await query.clone()
                : await query.clone().limit(parseInt(page_size)).offset(lastRow);
            resolve({ data, count: parseInt(String(count.total)) });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const findClinicQuery = (id_clinic: number = -1) => {
    return new Promise<RowCatClinicInterface | null>(async (resolve, reject) => {
        try {
            let clinic = await knexMedical('cat_clinics as c')
                .leftJoin('cat_municipalities as m', 'c.id_municipality', '=', 'm.id')
                .leftJoin('cat_states as s', 'm.id_state', '=', 's.id')
                .select('c.*', 'm.id_state', knexMedical.raw('CONCAT_WS(", ", m.name, s.name) as municipality'))
                .where('c.id', '=', id_clinic).first();
            resolve(clinic);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createClinicQuery = (data: CatClinicsInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    [new_id] = await trx('cat_clinics').insert({
                        name: data.name,
                        fullname: data.fullname,
                        postal_code: data.postal_code,
                        rfc: data.rfc,
                        address: data.address,
                        id_municipality: data.id_municipality,
                        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error('Error en create clinic:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('CLINICAS', 'CREAR CLINICA', `CLINICA CREADA CON ID ${new_id}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const updateClinicQuery = (data: UpdateCatClinicsInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('cat_clinics').where('id', '=', data.id).update({
                        name: data.name,
                        fullname: data.fullname,
                        postal_code: data.postal_code,
                        rfc: data.rfc,
                        address: data.address,
                        id_municipality: data.id_municipality,
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error('Error en edit clinic:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('CLINICAS', 'EDITAR CLINICA', `CLINICA EDITADA CON ID ${data.id}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const deleteClinicQuery = (id: number, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('cat_clinics').where('id', '=', id).update({
                        deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error('Error en delete clinic:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('CLINICAS', 'ELMINAR CLINICA', `CLINICA ELIMINADA CON ID ${id}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};