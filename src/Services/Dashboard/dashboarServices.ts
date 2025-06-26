import { knexMedical } from "../../Utils/dbKnex";
import { InfoUserInterface } from "../../Interfaces";

export const infoUserDashboard = (id: number = -1) => {
    return new Promise<InfoUserInterface>(async (resolve, reject) => {
        try {
            let response = await knexMedical('users as u')
                .leftJoin('cmp_doctors as d', 'u.id_doctor', '=', 'd.id')
                .leftJoin('cmp_persons as p', 'd.id_person', '=', 'p.id')
                .select('u.id', 'u.email', 'u.username', 'u.jwt',
                    knexMedical.raw("LPAD(d.matricula, 4, '0') as matricula"),
                    knexMedical.raw("CONCAT_WS(' ', p.first_surname, p.second_surname, p.fullname) as persona")
                )
                .where('u.id', '=', id).first();

            const clinics_ids = (await knexMedical('user_clinic_roles').where('id_user', '=', id).whereNull('deleted_at').groupBy('id_clinic') ?? []).map((res) => res.id_clinic);
            const clinics = await knexMedical('cat_clinics').whereIn('id', clinics_ids);

            response['roles'] = [];
            response['permissions'] = [];
            response['clinics'] = clinics;
            resolve(response);
        } catch (error) {
            console.error(error, 'Error al obtener informacion del usuario.');
            reject(error);
        }
    });
};