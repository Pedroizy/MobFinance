import axios from 'axios';
import Constants from 'expo-constants';

// URL do backend
const API_URL = Constants.expoConfig.extra?.EXPO_PUBLIC_API_URL || '[http://192.168.0.12:3000](http://192.168.0.12:3000)';

// Criando instância do axios
const api = axios.create({
baseURL: API_URL,
timeout: 10000,
headers: { 'Content-Type': 'application/json' },
});

// Função para validar email
function isValidEmail(email) {
const emailRegex = /^[^\s@]+@[^\s@]+.[^\s@]+$/;
return emailRegex.test(email);
}

// ========== AUTENTICAÇÃO ==========

// Login
export async function loginUser(email, password) {
if (!isValidEmail(email)) return { error: 'Email inválido' };

try {
const response = await api.post('/api/auth/login', { email, senha: password });
return response.data;
} catch (error) {
console.error('Erro ao fazer login:', error);
if (error.response?.data?.error) return { error: error.response.data.error };
return { error: 'Erro ao fazer login. Tente novamente.' };
}
}

// Signup
export async function signupUser(nome, sobrenome, email, password) {
if (!isValidEmail(email)) return { error: 'Email inválido' };

try {
const response = await api.post('/api/auth/signup', { nome, sobrenome, email, senha: password });
return response.data;
} catch (error) {
console.error('Erro ao criar conta:', error);
if (error.response?.data?.error) return { error: error.response.data.error };
return { error: 'Erro ao criar conta. Tente novamente.' };
}
}

// ========== TRANSAÇÕES ==========

// Buscar transações de um usuário
export async function getTransactions(userId) {
try {
const response = await api.get(`/api/transactions?userId=${userId}`);
return Array.isArray(response.data) ? response.data : [];
} catch (error) {
console.error('Erro ao buscar transações:', error);
return { error: 'Erro ao buscar transações. Tente novamente.' };
}
}

// Criar nova transação
export async function createTransaction(userId, tipo, descricao, valor) {
try {
const response = await api.post('/api/transactions', { userId, tipo, descricao, valor });
return response.data;
} catch (error) {
console.error('Erro ao criar transação:', error);
return { error: 'Erro ao criar transação. Tente novamente.' };
}
}

// Deletar transação
export async function deleteTransaction(transactionId) {
try {
const response = await api.delete(`/api/transactions/${transactionId}`);
return response.data;
} catch (error) {
console.error('Erro ao deletar transação:', error);
return { error: 'Erro ao deletar transação. Tente novamente.' };
}
}

// Obter saldo do usuário
export async function getBalance(userId) {
try {
const response = await api.get(`/balance?userId=${userId}`);
return response.data;
} catch (error) {
console.error('Erro ao calcular saldo:', error);
return { error: 'Erro ao calcular saldo. Tente novamente.' };
}
}

// Exportando a instância do axios
export default api;
