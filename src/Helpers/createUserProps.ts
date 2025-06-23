import bcrypt from 'bcryptjs';
import { findUsernameQuery } from '../Services/Admin/userService';
import { findOnePersonQuery } from '../Services/personService';
import { NewUserInterface } from '../Interfaces/Admin/usersInterface';

export const createUserParams = async (id_persona: number) => {
    let counter = 0;
    const { fullname, first_surname, second_surname } = await findOnePersonQuery(id_persona);
    let newname = fullname.toLowerCase().substring(0, 1) + first_surname.toLowerCase();
    let duplicate = await findUsernameQuery(newname);

    while (duplicate) {
        newname = newname + second_surname.toLowerCase().substring(counter, (counter + 1));
        duplicate = await findUsernameQuery(newname);
    }

    const response: NewUserInterface = { password: await generateRandomPassword(), username: newname };

    return response;
};

export const generateRandomPassword = async () => {
    const characters = {
        mayusculas: 'ABCDEFGHOJKLMNOPQRSTUVWXYZ',
        minusculas: 'abcdefghijklmnopqrstuvwxyz',
        numeros: '1234567890'
    };

    const allcharacters = characters.mayusculas + characters.minusculas + characters.numeros;

    let contraseña = [
        characters.mayusculas[Math.floor(Math.random() * characters.mayusculas.length)],
        characters.minusculas[Math.floor(Math.random() * characters.minusculas.length)],
        characters.numeros[Math.floor(Math.random() * characters.numeros.length)]
    ];

    for (let i = contraseña.length; i < 8; i++) {
        contraseña.push(allcharacters[Math.floor(Math.random() * allcharacters.length)]);
    }

    const plain = contraseña.sort(() => Math.random() - 0.5).join('');
    const hash = await encryptPassword(plain);

    return { plain, hash };
};

export const encryptPassword = async (password: string) => {
    try {
        const salt = await bcrypt.genSalt(12);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    } catch (error) {
        console.error('Error al cifrar la cadena:', error);
        throw error;
    }
};

export const validatePassword = async (password: string, hash: string) => {
    try {
        const coincide = await bcrypt.compare(password, hash);
        return coincide;
    } catch (error) {
        console.error('Error al verificar la cadena:', error);
        throw error;
    }
};