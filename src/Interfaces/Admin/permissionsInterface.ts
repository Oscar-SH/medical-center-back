export interface PermissionInterface {
    name: string;
}

export interface UpdatePermissionInterface extends PermissionInterface {
    id: number;
}

export interface RowPermissionInterface extends PermissionInterface {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface ParamsPermissionsInterface{
    page: string;
    text: string;
    page_size: string;
}

export interface ResponsePermissionTableInterface{
    count: number;
    data: RowPermissionInterface[];
}