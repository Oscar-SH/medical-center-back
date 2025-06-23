export interface UserClinicRoleInterface {
    id_role: number;
    id_user: number;
    id_clinic: number;
}

export interface UserClinicPermissionInterface {
    id_user: number;
    id_clinic: number;
    id_permission: number;
}

export interface PrivilegesParamsInterface {
    clinic: number;
    roles: number[];
    permissions: number[];
}

export interface PrivilegesInterface {
    id_user: number;
    privileges: PrivilegesParamsInterface[];
}