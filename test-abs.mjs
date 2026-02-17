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
    console.log('\n🔍 Buscando abas da planilha SP (FRANCO)...\n');
    
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    
    console.log('📋 ABAS ENCONTRADAS:\n');
    response.data.sheets.forEach((sheet, i) => {
      console.log(`${i + 1}. ${sheet.properties.title}`);
    });
    
    // Buscar aba de Fevereiro 2026
    const abaFev = response.data.sheets.find(s => 
      s.properties.title.includes('Fevereiro') && s.properties.title.includes('2026')
    );
    
    if (abaFev) {
      console.log(`\n✅ Aba de Fevereiro 2026 encontrada: "${abaFev.properties.title}"\n`);
      
      // Buscar cabeçalho
      const header = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${abaFev.properties.title}!A1:G1`
      });
      
      console.log('📊 CABEÇALHO (primeiras 7 colunas):\n');
      header.data.values[0].forEach((col, i) => {
        const letra = String.fromCharCode(65 + i);
        console.log(`  ${letra}: ${col}`);
      });
      
      // Buscar 2 colaboradores
      const data = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${abaFev.properties.title}!A2:G3`
      });
      
      console.log('\n👥 PRIMEIROS 2 COLABORADORES:\n');
      data.data.values.forEach((row, i) => {
        console.log(`Colaborador ${i + 1}:`);
        console.log(`  Nome (C): ${row[2]}`);
        console.log(`  WFM USER (G): ${row[6]}`);
        console.log('');
      });
      
    } else {
      console.log('❌ Aba de Fevereiro 2026 não encontrada!');
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

test();
