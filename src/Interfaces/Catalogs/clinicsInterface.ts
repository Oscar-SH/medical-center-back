export interface CatClinicsInterface {
    name: string;
    fullname: string;
    postal_code: number;
    rfc: string;
    address: string;
    id_municipality: number;
}


export interface UpdateCatClinicsInterface extends CatClinicsInterface{
    id: number;
}

export interface RowCatClinicInterface extends CatClinicsInterface {
    id: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;
}

export interface ParamsCatClinicInterface{
    page: string;
    text: string;
    page_size: string;
}

export interface ResponseCatClinicTableInterface{
    count: number;
    data: RowCatClinicInterface[];
}