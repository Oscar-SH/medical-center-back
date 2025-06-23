import { PersonInterface } from ".";

export interface DoctorInterface{
    id_person: number;
    observations?: string;
    professional_license: string;
}

export interface CreateDoctorInterface extends PersonInterface, DoctorInterface {}

export interface UpdateDoctorInterface extends CreateDoctorInterface{
    id: number;
}

export interface ResponseDoctorInterface extends DoctorInterface{
    id: number;
    matricula: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface ParamsDoctorInterface{
    page: string;
    text: string;
    isActives: string;
    page_size: string;
}

export interface ResponseDoctorTableInterface{
    count: number;
    data: ResponseDoctorInterface[];
}