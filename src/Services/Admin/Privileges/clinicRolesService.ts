import { Knex } from 'knex';
import moment from 'moment';
import { knexMedical } from '../../../Utils/dbKnex';
import { RegistroBitacora } from '../../../Classes/bitacoraClass';
import { UserClinicRoleInterface, PrivilegesParamsInterface } from '../../../Interfaces';

export const createClinicRoles = async (data: UserClinicRoleInterface, trx: Knex.Transaction, jwt: string) => {
    let new_id = 0;

    [new_id] = await trx('user_clinic_roles').insert({
        id_role: data.id_role,
        id_user: data.id_user,
        id_clinic: data.id_clinic,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss')
    }).transacting(trx);

    const bitacora = new RegistroBitacora('USUARIO-CLINICA-ROL', 'CREAR USUARIO-CLINICA-ROL', `USUARIO-CLINICA-ROL CREADO CON ID ${new_id}`, jwt);
    await bitacora.insert();
};

export const updateClinicRoles = async (data: { id: number, deleted_at: string | null }, trx: Knex.Transaction, jwt: string) => {
    let id_response = await trx('user_clinic_roles')
        .where('id', '=', data.id)
        .update({ deleted_at: data.deleted_at, updated_at: moment().format('YYYY-MM-DD HH:mm:ss') });
    const bitacora = new RegistroBitacora(
        'USUARIO-CLINICA-ROL', `${data.deleted_at ? 'ELIMINAR' : 'RECUPERAR'} USUARIO-CLINICA-ROL`, `USUARIO-CLINICA-ROL ${data.deleted_at ? 'ELIMINADO' : 'RECUPERADO'} CON ID ${id_response}`
        , jwt
    );
    await bitacora.insert();
};

export const setClinicRoles = (id_user: number, data: PrivilegesParamsInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            const last_roles = await knexMedical('user_clinic_roles').where('id_user', '=', id_user).andWhere('id_clinic', '=', data.clinic);

            await knexMedical.transaction(async (trx) => {
                for (const last of last_roles) {
                    const exist = data.roles.includes(last.id_role);
                    await updateClinicRoles({ id: last.id, deleted_at: exist ? null : moment().format('YYYY-MM-DD HH:mm:ss') }, trx, jwt);
                }

                for (const role of data.roles) {
                    const alreadyExists = last_roles.find(r => r.id_role === role);
                    if (!alreadyExists) await createClinicRoles({ id_user, id_clinic: data.clinic, id_role: role }, trx, jwt);
                }
            });

            resolve(true);
        } catch (error) {
            console.error('Error en set clinic roles:', error);
            reject(error);
        }
    });
};