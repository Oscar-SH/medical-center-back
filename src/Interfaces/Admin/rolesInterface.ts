import { RowPermissionInterface } from "..";

export interface RoleInterface {
    name: string;
    permissions: RowPermissionInterface[];
}

export interface UpdateRoleInterface extends RoleInterface {
    id: number;
}

export interface RowRoleInterface extends RoleInterface {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface ParamsRoleInterface {
    page: string;
    text: string;
    page_size: string;
}

export interface ResponseRoleTableInterface {
    count: number;
    data: RowRoleInterface[];
}

export interface RolePermissionInterface {
    id?: number;
    id_role: number;
    id_permission: number;
}