import { google } from 'googleapis';
import fs from 'fs';

const serviceAccount = JSON.parse(process.env.SERVICE_ACCOUNT || fs.readFileSync('./.env.service-account.json', 'utf8'));

const auth = new google.auth.GoogleAuth({
  credentials: serviceAccount,
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
});

const sheets = google.sheets({ version: 'v4', auth });

const SPREADSHEET_ID = '1vs_8_vdJYYToJpDf44pFMaqbKnJq8MsD4XBwfWoVjYk'; // SP (FRANCO)

async function listSheets() {
  try {
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    
    console.log('\n=== ABAS DA PLANILHA SP (FRANCO) ===\n');
    response.data.sheets.forEach(sheet => {
      console.log(`- ${sheet.properties.title}`);
    });
    
    // Buscar aba de Fevereiro
    const abaFevereiro = response.data.sheets.find(s => 
      s.properties.title.includes('Fevereiro') && s.properties.title.includes('2026')
    );
    
    if (abaFevereiro) {
      console.log(`\n✅ Aba encontrada: ${abaFevereiro.properties.title}`);
      
      // Buscar cabeçalho
      const headerResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${abaFevereiro.properties.title}!A1:Z1`
      });
      
      console.log('\n=== CABEÇALHO (primeiras 20 colunas) ===\n');
      const header = headerResponse.data.values[0];
      header.slice(0, 20).forEach((col, i) => {
        const letra = String.fromCharCode(65 + i);
        console.log(`${letra}: ${col}`);
      });
      
      // Buscar primeiras 3 linhas de dados
      const dataResponse = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${abaFevereiro.properties.title}!A2:Z4`
      });
      
      console.log('\n=== PRIMEIRAS 3 LINHAS (colunas A-F) ===\n');
      dataResponse.data.values.forEach((row, i) => {
        console.log(`Linha ${i + 2}:`);
        console.log(`  A (Turno): ${row[0]}`);
        console.log(`  B (Gênero): ${row[1]}`);
        console.log(`  C (Colaborador): ${row[2]}`);
        console.log(`  D (Hora): ${row[3]}`);
        console.log(`  E (Escala): ${row[4]}`);
        console.log(`  F (Dia de Inicio): ${row[5]}`);
        console.log('');
      });
    }
    
  } catch (error) {
    console.error('Erro:', error.message);
  }
}

listSheets();
