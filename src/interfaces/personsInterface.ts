export interface PersonInterface{
    id?: number;
    fullname : string;
    first_surname: string;
    second_surname: string;
    birthdate: string;
    curp: string;
    rfc: string;
    sex: string;
    state_birth: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface UpdatePersonInterface extends PersonInterface{
    id: number;
}