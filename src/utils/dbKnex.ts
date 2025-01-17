import { Knex } from 'knex';

export const knexMedical: Knex = require('knex')({
    client: 'mysql',
    connection: {
        user: 'root',
        database: 'db_medical',
        host: process.env.DB_USERS_HOST,
        port: process.env.DB_USERS_PORT,
        password: process.env.DB_USERS_PASSWORD
    }
});