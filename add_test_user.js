/**
 * Script para adicionar usuário de teste no Google Sheets
 */
const { google } = require('googleapis');
const fs = require('fs');

// Credenciais da Service Account
const SERVICE_ACCOUNT_INFO = {
  "type": "service_account",
  "project_id": "solar-bebop-472002-k5",
  "private_key_id": "4e260b24a103608510470ca3e27b824425fa8e1a",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyVQ/nJmLBZsVm\nJ6b3FLAHAvOZgDQO3xrR1rBY2DEZlk+0EI8X/xMc9b4QbuMQ12Ybo+KvqFlVU8/+\ntU60R8c/JJR1bHJwB0hoDR9BKe0AKG9VhQo/90RqfNh8qWkC17I5ZqfpUVqFXvzq\nFmN9n8f2gH9OXqPfT1sVwvIDBV0J4bI+Z3oPPjbm7B6gUmgjHMELNjImQBXhEZWh\n5qIqW0C8qmjUdSOWe2pW7c2G+y4YqJWqTQKyHPKh9kLHQE2k3z9X+z0ww0Vr+vLs\nsFXCMPLJJQkdXsWdpAqH5Z8qKTvvGZdmQlm8t2Yza7D0Ns5mZGSJGRXKgLQH3Y+X\nqOxZ3cbrAgMBAAECggEAAjsmr6s5VqD+0m8aM/I1S+4L3U/WGRx/KXxLyhc4O+K3\n4spFjdQSZVlRKYHrEhYQqN8mhpR8sQEf9wXqQrm5aqqtbJN5zAQ8iyq5JrVKkuUC\nhKqfZAK0vhLPmMqZjOOGzqWgpqKmhb9FqUfJiK0dFKKEZl0yy3rBQ5SJQPsmCqhE\nQX3fLT+iKK5XdHLEkfO+aHO8JQK3XvF7PzRx7EwE7c/qQrR0qVhQrM9JQqcqPpvK\nzqY8qKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5\nqJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5\nqJ8JQQKBgQDzFWB0qhQCqO0d9qE3qF3qO0d9qE3qF3qO0d9qE3qF3qO0d9qE3qF3\nqO0d9qE3qF3qO0d9qE3qF3qO0d9qE3qF3qO0d9qE3qF3qO0d9qE3qF3qO0d9qE3q\nF3qO0d9qE3qF3qO0d9qE3qF3qO0d9qE3qF3qO0d9qE3qF3qO0d9qEQKBgQC7KqpK\n5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK\n5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK\n5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQwKBgHqpK5qJ8JQKEJ8yJ9zqJEK\n+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK\n+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK\n+pQJ5zQqJqKqpK5qJ8JQQKBgBqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8\nJQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8\nJQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8\nJQKBAoGAMqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+p\nQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+p\nQJ5zQqJqKqpK5qJ8JQKEJ8yJ9zqJEK+pQJ5zQqJqKqpK5qJ8JQ==\n-----END PRIVATE KEY-----\n",
  "client_email": "sheets-bot@solar-bebop-472002-k5.iam.gserviceaccount.com",
  "client_id": "117651985036264846421",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sheets-bot%40solar-bebop-472002-k5.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
};

const SPREADSHEET_ID = '1uKQxcn0gCplmIfBcpLl1knoQyhhXHDYHbGewx8G7cJg';

async function addTestUser() {
  try {
    // Autenticar
    const auth = new google.auth.GoogleAuth({
      credentials: SERVICE_ACCOUNT_INFO,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Dados do usuário de teste
    const testUser = [
      1, // ID
      'teste@shopee.com', // Email
      'Usuário Teste', // Nome
      'Analista', // Cargo Solicitado
      'PENDENTE', // Status
      new Date().toISOString(), // Data Cadastro
      '', // Nivel (vazio)
      'https://via.placeholder.com/150' // Avatar URL
    ];

    // Adicionar na planilha
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'raw_logins!A2', // Linha 2 em diante
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [testUser]
      }
    });

    console.log('✅ Usuário de teste adicionado com sucesso!');
    console.log('Email:', testUser[1]);
    console.log('Status:', testUser[4]);
    
  } catch (error) {
    console.error('❌ Erro ao adicionar usuário:', error.message);
  }
}

addTestUser();
