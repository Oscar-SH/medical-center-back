import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendEmail = async (to: string, subject: string, text: string) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text
        });
        console.log('Correo enviado: ', info.messageId);
        return info;
    } catch (error) {
        console.error('Error al enviar correo: ', error);
        throw error;
    }
};

// module.exports = sendEmail;