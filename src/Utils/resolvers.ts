import moment from 'moment';
import { knexMedical } from './dbKnex';

export const resolvers = {
    Query: {
        countRecords: async (_: unknown, filters: any) => {
            const actualYear = moment().year();
            const auxEstaus = filters.status.split(',');
            let query = knexMedical.count('id as total').from('siem_services').where('id_ubicacion', '=', parseInt(filters.id_position));
            query.whereRaw('YEAR(fecha) = ?', [filters.month ? moment(filters.month).year() : actualYear]);

            if (filters.status) {
                query.whereIn('estatus', auxEstaus);
            } else {
                query.whereNotIn('estatus', ['ELIMINADO']);
            };

            if (filters.month) query.whereRaw('MONTH(fecha) = ?', [moment(filters.month).month() + 1]);
            if (parseInt(filters.service) >= 0) query.where('servicio', '=', parseInt(filters.service));
            if (parseInt(filters.id_empleado) > 0) query.where('id_empleado', '=', parseInt(filters.id_empleado));

            const totalRows = await query.first();
            return totalRows;
        },
        records: async (_: unknown, filters: any) => {
            const actualYear = moment().year();
            const auxEstaus = filters.status.split(',');
            const page_init = ((parseInt(filters.page_records) * parseInt(filters.page_records_size)) - parseInt(filters.page_records_size));
            let query = knexMedical.select().from('siem_services')
                .where('id_ubicacion', '=', parseInt(filters.id_position))
                .whereNotIn('estatus', ['ELIMINADO']);

            if (filters.status) {
                query.whereIn('estatus', auxEstaus);
            } else {
                query.whereNotIn('estatus', ['ELIMINADO']);
            };

            if (filters.month) query.whereRaw('MONTH(fecha) = ?', [moment(filters.month).month() + 1]);
            if (parseInt(filters.service) >= 0) query.where('servicio', '=', parseInt(filters.service));
            if (parseInt(filters.id_empleado) > 0) query.where('id_empleado', '=', parseInt(filters.id_empleado));

            query.whereRaw('YEAR(fecha) = ?', [filters.month ? moment(filters.month).year() : actualYear]);
            query = query.orderBy('fecha', 'asc').offset(page_init).limit(parseInt(filters.page_records_size));
            const patientsRows = await query;
            return patientsRows;
        }
    },
    Service: {
        empleado: async (parent: any) => {
            // const rowsServices = parent.id_ubicacion ?
            //     await knexSica.select(
            //         'e.id',
            //         'e.matricula',
            //         knexSica.raw('CONCAT_WS(" ", p.primer_apellido, p.segundo_apellido, p.nombres) as empleado')
            //     ).from('rch_empleados as e').leftJoin('cmp_persona as p', 'e.id_persona', 'p.id')
            //         .where('e.id', '=', parent.id_empleado).first()
            //     : null;
            return null;
        }
    }
};