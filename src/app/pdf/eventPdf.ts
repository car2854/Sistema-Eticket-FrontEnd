import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { getBase64ImageFromURL } from '../helpers/base64';
import { DataLoading } from '../models/dataLoading';

(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;

const eventPDF = async(data: DataLoading) => {

  const fecha = Date.now();
  const fechaHoy = new Date(fecha);

  const tableList:any[] = [];

  data.entradas_vendidas.map((item:any) => {

    tableList.push({
      ticket: item.ticket,
      horario: item.horario,
      sector: item.sector,
      espacio: item.espacio,
      registrado_por: item.registrado_por,
      hora_registro: item.hora_registro
    });

  });

  const items = tableList.map((data2:any) => {
    return [data2.ticket, data2.horario, data2.sector, data2.espacio, data2.registrado_por, data2.hora_registro];
  })

  console.log(items);
  
  const pdfDefinition: any = {
    pageSize: 'A4',
    pageMargins: [35,35,35,35],
    content: [
      {
        margin: [0,7,0,0],
        columns: [
          [
            {
              image: await getBase64ImageFromURL('../../assets/dist/img/logo-ticket.png'),
              width: 60
            }
          ],
          [
            {
              alignment: 'right',
              text: [
                {
                  text: 'Fecha',
                  bold: true,
                  fontSize: 12,
                },
                {
                  text: fechaHoy.toLocaleDateString(),
                  fontSize: 10,
                },
              ],
            },
          ],
        ]
      },

      {
        margin: [0,20,0,0],

        columns: [
          [
            {
              text: [
                {
                  text: 'Evento: ',
                  bold: true,
                  fontSize: 12,
                },
                {
                  text: data.evento,
                  fontSize: 10,
                },
              ],
            },
            {
              text: [
                {
                  text: 'Ubicacion: ',
                  bold: true,
                  fontSize: 12,
                },
                {
                  text: data.ubicacion,
                  fontSize: 10,
                },
              ],
            },
          ],
          
        ]
      },


      {
        fontSize: 9,
        margin: [0,20,0,0],
        table: {
          headerRows: 1,
          body: [
            [{text: 'Ticket'}, {text: 'Horario'}, {text: 'Sector'}, {text: 'Espacio'}, {text: 'Registrado por'}, {text: 'Hora asignado'}],
          ].concat(items)
        },
        layout: 'lightHorizontalLines',
        
      },

    ],
    
  }

  const pdf = pdfMake.createPdf(pdfDefinition);
  pdf.open();
}

export {
  eventPDF
}