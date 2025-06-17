import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../../Utils/dbKnex';
import { RegistroBitacora } from '../../Classes/bitacoraClass';
import { RolePermissionInterface, RowPermissionInterface, RowRoleInterface } from '../../Interfaces';

export const findRolePermissionQuery = (id_role: number = -1) => {
    return new Promise<RowRoleInterface[]>(async (resolve, reject) => {
        try {
            let permissions = await knexMedical('role_permissions as rp')
                .leftJoin('permissions as p', 'rp.id_permission', '=', 'p.id')
                .select('p.*').where('id_role', '=', id_role).whereNull('rp.deleted_at');
            resolve(permissions);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const createRolePermissionQuery = async (jwt: string, trx: Knex.Transaction, data: RolePermissionInterface) => {
    let new_id = 0;
    [new_id] = await trx('role_permissions').insert({
        id_permission: data.id_permission,
        id_role: data.id_role,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
    });
    const bitacora = new RegistroBitacora('ROL-PERMISO', 'CREAR PERMISO-ROL', `PERMISO-ROL CREADO CON ID ${new_id}`, jwt);
    await bitacora.insert();
};

export const updateRolePermissionQuery = (jwt: string, trx: Knex.Transaction, id_role: number, data: RowPermissionInterface[]) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newPermissionIds = data.map(p => p.id);
            const last_permissions = await knexMedical('role_permissions').where('id_role', '=', id_role);
            try {
                for (const permission of data) {
                    const exist = last_permissions.find((last) => last.id_permission === permission.id);
                    if (!exist) {
                        await createRolePermissionQuery(jwt, trx, { id_permission: permission.id, id_role: id_role });
                    } else if (exist.deleted_at) {
                        await restoreRolePermissionQuery(jwt, trx, { id_permission: permission.id, id_role: id_role });
                    }
                }
                for (const last of last_permissions) {
                    if (last.deleted_at === null && !newPermissionIds.includes(last.id_permission))
                        await deleteRolePermissionQuery(jwt, trx, { id_permission: last.id_permission, id_role: id_role });
                }
            } catch (error) {
                console.error(error, 'Error en update role permission.');
                throw error;
            }
            const bitacora = new RegistroBitacora('ROL-PERMISO', 'EDITAR PERMISO-ROL', `PERMISOS EDITADOS PARA EL ROL ${id_role}`, jwt);
            await bitacora.insert();
            resolve(bitacora);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const deleteRolePermissionQuery = async (jwt: string, trx: Knex.Transaction, data: RolePermissionInterface) => {
    let id_pivot = await trx('role_permissions')
        .where({ id_role: data.id_role, id_permission: data.id_permission })
        .update({
            deleted_at: moment().format('YYYY-MM-DD HH:mm:ss'),
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        });
    const bitacora = new RegistroBitacora('ROL-PERMISO', 'ELIMINAR PERMISO-ROL', `PERMISO-ROL ELIMINADO CON ID ${id_pivot}`, jwt);
    await bitacora.insert();
};

export const restoreRolePermissionQuery = async (jwt: string, trx: Knex.Transaction, data: RolePermissionInterface) => {
    let id_pivot = await trx('role_permissions')
        .where({ id_role: data.id_role, id_permission: data.id_permission })
        .update({
            deleted_at: null,
            updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
        });
    const bitacora = new RegistroBitacora('ROL-PERMISO', 'RECUPERAR PERMISO-ROL', `PERMISO-ROL RECUPERADO CON ID ${id_pivot}`, jwt);
    await bitacora.insert();
};