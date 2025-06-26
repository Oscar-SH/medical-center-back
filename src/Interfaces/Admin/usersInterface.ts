import { CatClinicsInterface, DoctorInterface, PermissionInterface } from "..";

export interface UserInterface {
    email: string;
    token: string;
    id_doctor?: number;
}

export interface CreateUserInterface extends UserInterface, DoctorInterface { }

export interface UpdateUserInterface extends UserInterface {
    id: number;
}

export interface PasswordInterface {
    hash: string;
    plain: string;
}

export interface NewUserInterface {
    username: string;
    password: PasswordInterface;
}

export interface RowUserInterface extends UserInterface {
    id: number;
    username: string;
    password: string;
    remember_token: string;
    id_doctor: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
    matricula: number;
}

export interface ParamsUserInterface {
    page: string;
    text: string;
    isActives: string;
    page_size: string;
}

export interface ResponseUserTableInterface {
    count: number;
    data: RowUserInterface[];
}


export interface InfoUserInterface extends UserInterface {
    clinics: CatClinicsInterface[];
    permissions: PermissionInterface[];
}