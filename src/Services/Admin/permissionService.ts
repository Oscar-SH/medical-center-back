import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../../Utils/dbKnex';
import { RegistroBitacora } from '../../Classes/bitacoraClass';
import { ParamsPermissionsInterface, PermissionInterface, ResponsePermissionTableInterface, RowPermissionInterface, UpdatePermissionInterface } from '../../Interfaces';

export const getAllPermissionsQuery = ({
    text = '',
    page = '1',
    page_size = '10'
}: ParamsPermissionsInterface) => {
    return new Promise<ResponsePermissionTableInterface>(async (resolve, reject) => {
        try {
            const lastRow = (parseInt(page) - 1) * parseInt(page_size);
            let query = knexMedical('permissions');

            if (text.length > 0) query = query.where('name', 'LIKE', `%${text}%`);

            const [count] = await query.clone().count('id as total');
            const data = parseInt(page_size) === 0
                ? await query.clone().whereNull('deleted_at')
                : await query.clone().limit(parseInt(page_size)).offset(lastRow).whereNull('deleted_at');
            resolve({ data, count: parseInt(`${count.total}`) });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const findPermissionQuery = (id_permission: number = -1) => {
    return new Promise<RowPermissionInterface | null>(async (resolve, reject) => {
        try {
            let permission = await knexMedical('permissions').where('id', '=', id_permission).first();
            resolve(permission);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createPermissionQuery = (data: PermissionInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    [new_id] = await trx('permissions').insert({
                        name: data.name,
                        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error('Error en create permission:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('PERMISOS', 'CREAR PERMISO', `PERMISO CREADO CON ID ${new_id}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error, 'error_permiso');
            reject(error);
        }
    });
};

export const updatePermissionQuery = (data: UpdatePermissionInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('permissions').where('id', '=', data.id).update({
                        name: data.name,
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error('Error en edit permission:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('PERMISOS', 'EDITAR PERMISO', `PERMISO EDITADO CON ID ${data.id}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const deletePermissionQuery = (id: number, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('permissions').where('id', '=', id).update({
                        deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                } catch (error) {
                    console.error('Error en delete permission:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('PERMISOS', 'ELMINAR PERMISO', `PERMISO ELIMINADO CON ID ${id}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};