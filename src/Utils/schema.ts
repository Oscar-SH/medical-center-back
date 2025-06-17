const { gql } = require('apollo-server');

const typeDefs = gql`
    type Service{
        id: Int
	    fecha: String
	    orden: Int
	    vale: Int
	    servicio: Int
	    proveedor: String
	    rfc: String
	    descripcion: String
	    mano_obra: Int
	    refacciones: Int
	    observaciones: String
	    estatus: String
	    id_ubicacion: Int
	    id_empleado: Int
	    created_at: String
	    updated_at: String
	    deleted_at: String
        empleado: Empleado
    }


    type Empleado{
        id: Int!
        matricula: Int
        empleado: String
    }


    type totalRows{
        total: Int
    }

    
    type Query {
        records(
            month: String
            status: String
            service: String
            id_empleado: Int
            id_position: Int
            page_records: Int
            page_records_size: Int
        ): [Service]
        countRecords(
            month: String
            status: String
            service: Int
            id_empleado: Int
            id_position: Int
        ): totalRows
    }
`;

export { typeDefs };