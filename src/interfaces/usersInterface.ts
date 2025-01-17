export interface UserInterface{
    id?: number;
    username: string;
    email: string;
    password: string;
    remember_token: string;
    id_doctor: number;
    created_at: string;
    updated_at: string;
    deleted_at: string;
}

export interface UpdateUserInterface extends UserInterface{
    id: number;
}