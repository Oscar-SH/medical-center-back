export interface PersonInterface {
    fullname: string;
    first_surname: string;
    second_surname: string;
    birthdate: string;
    curp: string;
    rfc: string;
    sex: string;
    state_birth: string;
}

export interface UpdatePersonInterface extends PersonInterface {
    id: number;
}

export interface ReponsePersonInterface extends PersonInterface {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface ParamsPersonInterface{
    page: string;
    text: string;
    isActives: string;
    page_size: string;
}

export interface ResponsePersonTableInterface{
    count: number;
    data: ReponsePersonInterface[];
}