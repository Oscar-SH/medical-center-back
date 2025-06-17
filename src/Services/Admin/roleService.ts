import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../../Utils/dbKnex';
import { RegistroBitacora } from '../../Classes/bitacoraClass';
import { createRolePermissionQuery, deleteRolePermissionQuery, findRolePermissionQuery, updateRolePermissionQuery } from '..';
import { ParamsRoleInterface, ResponseRoleTableInterface, RoleInterface, RowRoleInterface, UpdateRoleInterface } from '../../Interfaces';

export const findAllRolesQuery = ({
    text = '',
    page = '1',
    page_size = '10'
}: ParamsRoleInterface) => {
    return new Promise<ResponseRoleTableInterface>(async (resolve, reject) => {
        try {
            let response: RowRoleInterface[] = [];
            const lastRow = (parseInt(page) - 1) * parseInt(page_size);
            let query = knexMedical('roles');
            if (text.length > 0) query = query.where('name', 'LIKE', `%${text}%`);
            const [count] = await query.clone().count('id as total');
            let data = await query.clone().limit(parseInt(page_size)).offset(lastRow);
            for (let row of data) {
                row['permissions'] = await findRolePermissionQuery(row.id);
                response.push(row);
            }
            resolve({ data: response, count: parseInt(String(count.total)) });
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const findRoleQuery = (id_role: number = -1) => {
    return new Promise<RowRoleInterface | null>(async (resolve, reject) => {
        try {
            let role = await knexMedical('roles').where('id', '=', id_role).first();
            role['permissions'] = await findRolePermissionQuery(role.id);
            resolve(role);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createRoleQuery = (data: RoleInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let new_id = 0;
            await knexMedical.transaction(async (trx) => {
                try {
                    [new_id] = await trx('roles').insert({
                        name: data.name,
                        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    });
                    for (let permission of data.permissions) {
                        await createRolePermissionQuery(jwt, trx, { id_permission: permission.id, id_role: new_id });
                    }
                } catch (error) {
                    console.error('Error en create rol:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('ROLES', 'CREAR ROL', `ROL CREADO CON ID ${new_id}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const updateRoleQuery = (data: UpdateRoleInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('roles').where('id', '=', data.id).update({
                        name: data.name,
                        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                    await updateRolePermissionQuery(jwt, trx, data.id, data.permissions);
                } catch (error) {
                    console.error('Error en update role:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('ROLES', 'EDITAR ROL', `ROL EDITADO CON ID ${data.id}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const deleteRoleQuery = (id: number, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            await knexMedical.transaction(async (trx: Knex.Transaction) => {
                try {
                    await trx('roles').where('id', '=', id).update({
                        deleted_at: moment().format('YYYY-MM-DD HH:mm:ss')
                    }).transacting(trx);
                    const permissions = await knexMedical('role_permissions').where('id_role', '=', id);
                    for (const permission of permissions) {
                        await deleteRolePermissionQuery(jwt, trx, { id_permission: permission.id_permission, id_role: id });
                    }
                } catch (error) {
                    console.error('Error en delete role:', error);
                    throw error;
                }
            });
            const bitacora = new RegistroBitacora('ROLES', 'ELIMINAR ROL', `ROL ELIMINADO CON ID ${id}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};