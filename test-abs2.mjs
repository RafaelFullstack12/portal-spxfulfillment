import { google } from 'googleapis';
import { SERVICE_ACCOUNT } from './src/config.ts';

const auth = new google.auth.GoogleAuth({
  credentials: SERVICE_ACCOUNT,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

const sheets = google.sheets({ version: 'v4', auth });
const SPREADSHEET_ID = '1vs_8_vdJYYToJpDf44pFMaqbKnJq8MsD4XBwfWoVjYk';

async function test() {
  try {
    const abaName = 'Controle de Presença | Fevereiro 2026';
    
    // Buscar primeiras 10 linhas para encontrar o cabeçalho
    const data = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${abaName}!A1:T10`
    });
    
    console.log('\n📋 PRIMEIRAS 10 LINHAS (colunas A-T):\n');
    
    data.data.values.forEach((row, i) => {
      console.log(`LINHA ${i + 1}:`);
      row.forEach((cell, j) => {
        if (cell) {
          const letra = String.fromCharCode(65 + j);
          console.log(`  ${letra}: ${cell}`);
        }
      });
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

test();
