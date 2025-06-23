import { imagen1base64 } from "./image1Header";
import { image2Header } from "./image2Header";

export const getTemplateHeaderReports = (title: string) => {
    let header = `
        <div style="font-size:10px; width:100%; text-align:center; display: flex; justify-content: space-evenly;">
            <img style="width: auto; height: 60px;" src="data:image/png;base64,${imagen1base64}" />
            <p>
                <span>SERVICIOS DE SALUD DE VERACRUZ</span><br>
                <span>CENTRO DE ALTA ESPECIALIDAD DR. RAFAEL LUCIO</span><br>
                <span>${title}</span>
            </p>
            <img style="width: auto; height: 60px;" src="data:image/png;base64,${image2Header}" />
        </div>
    `;
    return header;
};