export const getTemplateReports = () => {
    let template = `
        <!DOCTYPE html>
        <html lang="es">

        <head>
            <title>{title}</title>
            <meta charset="UTF-8">
            <style type="text/css">
                body {
                    font-family: Arial;
                }

                div>table {
                    width: 100%;
                    margin-top: 10px;
                    border-collapse: collapse;
                }

                div>table>tbody>tr>td {
                    text-align: center;
                    font-size: 10px;
                    border: 1px solid #A9A8A8;
                    border-collapse: collapse;
                    padding: 2px;
                }

                div>table>tbody>tr>th {
                    text-align: center;
                    font-size: 10px;
                    border: 1px solid #A9A8A8;
                    border-collapse: collapse;
                }

                .tb-title {
        			padding: 5px;
        			font-size: 14px;
        			font-weight: bold;	
                    text-align: center;	
                    background-color: #A9A8A8;
        		}

                .tb-title2 {
                    font-size: 12px;
                    font-weight: bold;
                    text-align: center;
                    background-color: #f0efef;
                }

                .tb-title3 {
                    font-size: 10px;
                    font-weight: bold;
                    background-color: #f0efef;
                }

                .resumen_clinico p {
                    margin: 0px 0px 0px 0px;
                }

                .saltopagina {
                    page-break-after: always;
                }
            </style>
        </head>

        <body>
            <main>
                {rows}
            </main>
        </body>

        </html>
    `;
    return template;
};