export interface DoctorInterface{
    id?: number;
    matricula: number;
    professional_license: string;
    active: boolean;
    observations: string;
    id_person: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface UpdateDoctorInterface extends DoctorInterface{
    id: number;
}