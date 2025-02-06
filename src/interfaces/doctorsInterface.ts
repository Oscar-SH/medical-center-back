import { PersonInterface } from "./personsInterface";

export interface DoctorInterface{
    id_person: number;
    observations?: string;
    professional_license: string;
}

export interface CreateDoctorInterface extends PersonInterface, DoctorInterface {}

export interface UpdateDoctorInterface extends CreateDoctorInterface{
    id: number;
}
