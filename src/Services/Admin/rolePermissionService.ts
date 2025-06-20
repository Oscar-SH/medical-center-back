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

export const createRolePermissionQuery = async (data: RolePermissionInterface, trx: Knex.Transaction, jwt: string) => {
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

export const updateRolePermissionQuery = async (data: { id_permission: number, id_role: number, deleted_at: string | null }, trx: Knex.Transaction, jwt: string) => {
    let id_response = await trx('role_permissions')
        .where({ id_role: data.id_role, id_permission: data.id_permission })
        .update({ deleted_at: data.deleted_at, updated_at: moment().format('YYYY-MM-DD HH:mm:ss') });
    const bitacora = new RegistroBitacora(
        'ROL-PERMISO', `${data.deleted_at ? 'ELIMINAR' : 'RECUPERAR'} ROL-PERMISO`, `ROL-PERMISO ${data.deleted_at ? 'ELIMINADO' : 'RECUPERADO'} CON ID ${id_response}`,
        jwt
    );
    await bitacora.insert();
};

export const setRolePermissionQuery = (jwt: string, trx: Knex.Transaction, id_role: number, data: RowPermissionInterface[]) => {
    return new Promise(async (resolve, reject) => {
        try {
            const newPermissionIds = data.map(p => p.id);
            const last_permissions = await knexMedical('role_permissions').where('id_role', '=', id_role);
            try {
                for (const last of last_permissions) {
                    const exist = newPermissionIds.includes(last.id_permission);
                    await updateRolePermissionQuery({ id_permission: last.id_permission, id_role: id_role, deleted_at: exist ? null : moment().format('YYYY-MM-DD HH:mm:ss') }, trx, jwt);
                }

                for (const permission of newPermissionIds) {
                    const alreadyExists = last_permissions.find(p => p.id_permission === permission);
                    if (!alreadyExists) await createRolePermissionQuery({ id_permission: permission, id_role: id_role }, trx, jwt);
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
//     return new Promise(async (resolve, reject) => {
//         try {
//             const last_permissions = await knexMedical('role_permissions').where('id_role', '=', id_role);
//             for (const last of last_permissions) {
//                 const exist = data.permissions.includes(last.id_permission);
//                 await updateRolePermissionQuery({ id: last.id, deleted_at: exist ? null : moment().format('YYYY-MM-DD HH:mm:ss') }, trx, jwt);
//             }

//             for (const permission of data) {
//                 const alreadyExists = last_permissions.find(p => p.id_permission === permission);
//                 if (!alreadyExists) await createRolePermissionQuery({ id_permission: permission.id, id_role: id_role }, trx, jwt);
//             }
//             resolve(true);
//         } catch (error) {
//             console.error('Error en asignar permisos por clinica.', error);
//             reject(error);
//         }
//     });
// };