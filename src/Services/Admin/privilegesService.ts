import { knexMedical } from '../../Utils/dbKnex';
import { setClinicPermissions, setClinicRoles } from './Privileges';
import { PrivilegesInterface, PrivilegesParamsInterface } from '../../Interfaces';

interface Props { id_user: string; }

export const getPrivilegesUserQuery = ({ id_user = '-1' }: Props) => {
    return new Promise<PrivilegesParamsInterface[]>(async (resolve, reject) => {
        try {
            let privileges: PrivilegesParamsInterface[] = []
            let query = knexMedical('user_clinic_roles').where('id_user', '=', parseInt(id_user));
            const clinics = await query.clone().select('id_clinic').whereNull('deleted_at').groupBy('id_clinic');

            for (const clinic of clinics) {
                let roles = await query.clone().where('id_clinic', '=', clinic.id_clinic).whereNull('deleted_at').groupBy('id_role');
                let permissions = await knexMedical('user_clinic_permissions').where({ id_user: parseInt(id_user), id_clinic: clinic.id_clinic })
                    .whereNull('deleted_at').groupBy('id_permission');
                roles = roles.map((role) => role.id_role);
                permissions = permissions.map((permission) => permission.id_permission);
                privileges.push({ clinic: clinic.id_clinic, permissions, roles });
            }

            resolve(privileges);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};

export const setPrivilegesUserQuery = (data: PrivilegesInterface, jwt: string) => {
    return new Promise(async (resolve, reject) => {
        try {
            let last_clinics = await knexMedical('user_clinic_roles').select('id_clinic').where('id_user', '=', data.id_user).groupBy('id_clinic');

            for (const last of last_clinics) {
                const exist = data.privileges.find((p) => p.clinic === last.id_clinic);
                if (!exist) {
                    await setClinicRoles(data.id_user, { clinic: last.id_clinic, permissions: [], roles: [] }, jwt);
                    await setClinicPermissions(data.id_user, { clinic: last.id_clinic, permissions: [], roles: [] }, jwt);
                } else {
                    await setClinicRoles(data.id_user, exist, jwt);
                    await setClinicPermissions(data.id_user, exist, jwt);
                }
            }

            for (const privilege of data.privileges) {
                const exist = last_clinics.find((l) => l.id_clinic === privilege.clinic);
                if (!exist) {
                    await setClinicRoles(data.id_user, privilege, jwt);
                    await setClinicPermissions(data.id_user, privilege, jwt);
                }
            }
            resolve(true);
        } catch (error) {
            console.error(error);
            reject(error);
        }
    });
};