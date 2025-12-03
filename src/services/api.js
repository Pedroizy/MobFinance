import axios from 'axios';
import * as Crypto from 'expo-crypto';

const api = axios.create({
  baseURL: 'http://192.168.1.32:3000/api',
});

// Função para criptografar senha
async function hashPassword(password) {
  return await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    password
  );
}

// Validar email
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Autenticação de usuário
export async function loginUser(email, password) {
  try {
    if (!isValidEmail(email)) {
      return { error: 'Email inválido' };
    }

    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return { error: 'Erro ao fazer login. Tente novamente.' };
  }
}

// Cadastro de novo usuário
export async function signupUser(nome, sobrenome, email, password) {
  try {
    if (!isValidEmail(email)) {
      return { error: 'Email inválido' };
    }

    const response = await api.post('/auth/signup', {
      nome,
      sobrenome,
      email,
      senha: password,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return { error: 'Erro ao criar conta. Tente novamente.' };
  }
}

// Buscar transações do usuário
export async function getTransactions(userId) {
  try {
    const response = await api.get(`/transactions?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar transações:', error);
    return { error: 'Erro ao buscar transações. Tente novamente.' };
  }
}

// Criar nova transação
export async function createTransaction(userId, tipo, descricao, valor) {
  try {
    const response = await api.post('/transactions', {
      userId,
      tipo,
      descricao,
      valor,
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return { error: 'Erro ao criar transação. Tente novamente.' };
  }
}

// Deletar transação
export async function deleteTransaction(transactionId) {
  try {
    const response = await api.delete(`/transactions/${transactionId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    return { error: 'Erro ao deletar transação. Tente novamente.' };
  }
}

// Calcular saldo do usuário
export async function getBalance(userId) {
  try {
    const response = await api.get(`/balance?userId=${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao calcular saldo:', error);
    return { error: 'Erro ao calcular saldo. Tente novamente.' };
  }
}

export default api;
