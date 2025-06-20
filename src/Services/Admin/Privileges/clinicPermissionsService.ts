import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../../../Utils/dbKnex';
import { RegistroBitacora } from '../../../Classes/bitacoraClass';
import { PrivilegesParamsInterface, UserClinicPermissionInterface } from '../../../Interfaces';

export const createClinicPermissions = async (data: UserClinicPermissionInterface, trx: Knex.Transaction, jwt: string) => {
    let new_id = 0;

    [new_id] = await trx('user_clinic_permissions').insert({
        id_user: data.id_user,
        id_clinic: data.id_clinic,
        id_permission: data.id_permission,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
    }).transacting(trx);

    const bitacora = new RegistroBitacora('USUARIO-CLINICA-PERMISO', 'CREAR USUARIO-CLINICA-PERMISO', `USUARIO-CLINICA-PERMISO CREADO CON ID ${new_id}`, jwt);
    await bitacora.insert();
};

export const updateClinicPermisssions = async (data: { id: number, deleted_at: string | null }, trx: Knex.Transaction, jwt: string) => {
    let id_response = await trx('user_clinic_permissions')
        .where('id', '=', data.id)
        .update({ deleted_at: data.deleted_at, updated_at: moment().format('YYYY-MM-DD HH:mm:ss') });
    const bitacora = new RegistroBitacora(
        'USUARIO-CLINICA-PERMISO', `${data.deleted_at ? 'ELIMINAR' : 'RECUPERAR'} USUARIO-CLINICA-PERMISO`, `USUARIO-CLINICA-PERMISO ${data.deleted_at ? 'ELIMINADO' : 'RECUPERADO'} CON ID ${id_response}`
        , jwt
    );
    await bitacora.insert();
};

export const setClinicPermissions = (id_user: number, data: PrivilegesParamsInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const last_permissions = await knexMedical('user_clinic_permissions').where('id_user', '=', id_user).where('id_clinic', '=', data.clinic);
            await knexMedical.transaction(async (trx) => {
                for (const last of last_permissions) {
                    const exist = data.permissions.includes(last.id_permission);
                    await updateClinicPermisssions({ id: last.id, deleted_at: exist ? null : moment().format('YYYY-MM-DD HH:mm:ss') }, trx, jwt);
                }

                for (const permission of data.permissions) {
                    const alreadyExists = last_permissions.find(p => p.id_permission === permission);
                    if (!alreadyExists) await createClinicPermissions({ id_user, id_clinic: data.clinic, id_permission: permission }, trx, jwt);
                }
            });

            resolve(true);
        } catch (error) {
            console.error('Error en asignar permisos por clinica.', error);
            reject(error);
        }
    });
};