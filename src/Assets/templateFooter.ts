import moment from 'moment';

export const getTemplateFooterReports = () => {
    let footer = `
        <div style="font-size:10px; width:100%; text-align:center;">
            <div>AV. RUIZ CORTINES NO. 2903 COL. UNIDAD MAGISTERIAL, XALAPA VER., TEL. (228) 814 4500</div>
            <div>FECHA DE IMPRESIÓN: ${moment().format('LL').toUpperCase()} </div>
            <div>PÁGINA <span class="pageNumber"></span> DE <span class="totalPages"></span></div>
        </div>
    `;
    return footer;
};