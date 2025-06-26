import moment from 'moment';
import { decodeToken } from '../Helpers/authHelper';
import { findOneUserQuery } from '../Services/Admin/userService';
import { registerBitacoraQuery } from '../Services/bitacoraService';

export class RegistroBitacora {
    private data: string;
    private action: string;
    private module: string;
    private id_user: number;
    private created_at: string;
    private updated_at: string;
    private username: string = '';

    constructor(module: string, action: string, data: string, jwtToken: string) {
        this.module = module;
        this.action = action;
        this.data = data;
        this.created_at = moment().format('YYYY-MM-DD');
        this.updated_at = moment().format('YYYY-MM-DD');
        this.id_user = this.decodeJWT(jwtToken).id ?? -1;
        this.setUsername();
    }

    private decodeJWT(token: string) {
        try {
            return decodeToken(token) as { id: number };
        } catch (error) {
            console.error('Error al decodificar JWT:', error);
            throw new Error('Token inválido');
        }
    }

    private async setUsername(): Promise<void> {
        this.username = await this.nickname();
    }

    async insert() {
        if (!this.username) await this.setUsername();
        await registerBitacoraQuery(this);
    }

    async nickname(): Promise<string> {
        const user = await findOneUserQuery(this.id_user);
        return user ? user.username : '';
    }
}