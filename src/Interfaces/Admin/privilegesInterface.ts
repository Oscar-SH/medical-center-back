export interface PrivilegesParamsInterface {
    clinic: number;
    roles: number[];
    permissions: number[];
}

export interface PrivilegesInterface {
    id_user: number;
    privileges: PrivilegesParamsInterface[];
}