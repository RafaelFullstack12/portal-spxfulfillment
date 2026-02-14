const { google } = require('googleapis');

const SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: "solar-bebop-472002-k5",
  private_key_id: "d40f0e84f6ebdd2d0c8d3d0d0a59c2e0869ad3a4",
  private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC+h8y5HGzGr4d/\nd7S3/jmqQQQHVMLLi6pj5t1gNVJvCz8OdQUdNXIcDOFvd5PfGJCF7h+E/qE0Kw1Y\nQ9jmWEV8hJsHG5YBGhYzCzCF0BRVJqpNQFPmR2V6kGgUKFqzDzPVLk5Bqv0dQJ3J\nBHx3xGiPRZqLw7vxPdVrQqP9xOJCBL4WkPqKkFQE5HFCZmRH5J7CUlRBqFN5CqOp\nQZXKXqKQr5gM8VmXBWRQH5LJ5MJHZLqOQQKBgQDkGgQaV0KFQzKFqPQJ0FqQKBgQ\nDkGgQaV0KFQzKFqPQJ0FqQKBgQDkGgQaV0KFQzKFqPQJ0FqQKBgQDkGgQaV0KFQZ\nKFqPQJ0FqQKBgQDkGgQaV0KFQzKFqPQJ0FqQKBgQDkGgQaV0KFQzKFqPQJ0FqQK\nBgQDkGgQaV0KFQzKFqPQJ0FqQKBgQDkGgQaV0KFQzKFqPQJ0FqQKBgQDkGgQaV0\nKFQzKFqPQJ0FqQKBgQDkGgQaV0KFQzKFqPQJ0FqQKBgQDkGgQaV0KFQzKFqPQJ\n0FqQKBgQDkGgQaV0KFQzKFqPQJ0FqQKBgQDkGgQaV0KFQzKFqPQJ0FqQKBgQDkG\ngQaV0KFQzKFqPQJ0FqQKBgQDkGgQaV0KFQzKFqPQJ0FqQ==\n-----END PRIVATE KEY-----\n",
  client_email: "sheets-bot@solar-bebop-472002-k5.iam.gserviceaccount.com",
  client_id: "117651985036264846421",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/sheets-bot%40solar-bebop-472002-k5.iam.gserviceaccount.com"
};

const SPREADSHEET_ID = '1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg';

async function initSetoresENiveis() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT,
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const sheets = google.sheets({ version: 'v4', auth });

    console.log('🚀 Iniciando configuração de Setores e Níveis...\n');

    // 1. Verificar se aba 'niveis_acesso' existe
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });

    const niveisSheetExists = spreadsheet.data.sheets?.some(
      (sheet) => sheet.properties?.title === 'niveis_acesso'
    );

    if (!niveisSheetExists) {
      console.log('📋 Criando aba "niveis_acesso"...');
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: 'niveis_acesso'
              }
            }
          }]
        }
      });
      console.log('✅ Aba "niveis_acesso" criada!\n');
    }

    // 2. Criar cabeçalho da aba niveis_acesso
    console.log('📝 Criando estrutura de Níveis de Acesso...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'niveis_acesso!A1:D1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [['ID', 'Valor', 'Nome', 'Descricao']]
      }
    });

    // 3. Inserir níveis padrão
    console.log('📊 Inserindo níveis padrão (0, 1, 5, 10)...');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'niveis_acesso!A2:D5',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [
          [1, 0, 'Básico', 'Acesso básico ao sistema'],
          [2, 1, 'Analista', 'Acesso a dashboards e relatórios'],
          [3, 5, 'Supervisor', 'Acesso a relatórios financeiros e gestão'],
          [4, 10, 'Administrador', 'Acesso completo ao sistema']
        ]
      }
    });
    console.log('✅ Níveis padrão inseridos!\n');

    // 4. Adicionar coluna 'Setor' na aba portal_opcoes (coluna I)
    console.log('🏢 Adicionando coluna "Setor" em portal_opcoes...');
    
    // Buscar cabeçalho atual
    const headerResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'portal_opcoes!A1:H1'
    });

    const currentHeader = headerResponse.data.values?.[0] || [];
    const newHeader = [...currentHeader, 'Setor'];

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: 'portal_opcoes!A1:I1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [newHeader]
      }
    });
    console.log('✅ Coluna "Setor" adicionada!\n');

    // 5. Atualizar opções existentes com setor "Geral"
    console.log('🔄 Atualizando opções existentes com setor "Geral"...');
    const opcoesResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'portal_opcoes!A2:H1000'
    });

    const opcoes = opcoesResponse.data.values || [];
    if (opcoes.length > 0) {
      const opcoesComSetor = opcoes.map(row => [...row, 'Geral']);
      
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `portal_opcoes!A2:I${opcoes.length + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: opcoesComSetor
        }
      });
      console.log(`✅ ${opcoes.length} opções atualizadas!\n`);
    }

    console.log('🎉 Configuração concluída com sucesso!');
    console.log('\n📊 Estrutura criada:');
    console.log('   - Aba "niveis_acesso" com níveis customizáveis');
    console.log('   - Coluna "Setor" adicionada em "portal_opcoes"');
    console.log('\n🔗 Acesse: https://docs.google.com/spreadsheets/d/' + SPREADSHEET_ID);

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

initSetoresENiveis();
