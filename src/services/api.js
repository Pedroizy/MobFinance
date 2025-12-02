import * as Crypto from 'expo-crypto';
import prisma from './database';

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

    const hashedPassword = await hashPassword(password);
    
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.senha !== hashedPassword) {
      return { error: 'Email ou senha incorretos' };
    }

    // Não retorna a senha
    const { senha, ...userWithoutPassword } = user;
    return { data: userWithoutPassword };
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

    const hashedPassword = await hashPassword(password);
    
    // Verifica se o email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return { error: 'Email já cadastrado' };
    }

    const user = await prisma.user.create({
      data: {
        nome,
        sobrenome,
        email,
        senha: hashedPassword,
      },
    });

    // Não retorna a senha
    const { senha, ...userWithoutPassword } = user;
    return { data: userWithoutPassword };
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return { error: 'Erro ao criar conta. Tente novamente.' };
  }
}

// Buscar transações do usuário
export async function getTransactions(userId) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { data: 'desc' }
    });

    return { data: transactions };
  } catch (error) {
    return { error: 'Erro ao buscar transações: ' + error.message };
  }
}

// Criar nova transação
export async function createTransaction(userId, tipo, descricao, valor) {
  try {
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        tipo,
        descricao,
        valor: parseFloat(valor),
      }
    });

    return { data: transaction };
  } catch (error) {
    return { error: 'Erro ao criar transação: ' + error.message };
  }
}

// Deletar transação
export async function deleteTransaction(transactionId, userId) {
  try {
    // Verifica se a transação pertence ao usuário
    const transaction = await prisma.transaction.findFirst({
      where: {
        id: transactionId,
        userId: userId
      }
    });

    if (!transaction) {
      return { error: 'Transação não encontrada' };
    }

    await prisma.transaction.delete({
      where: { id: transactionId }
    });

    return { data: { message: 'Transação deletada com sucesso' } };
  } catch (error) {
    return { error: 'Erro ao deletar transação: ' + error.message };
  }
}

// Calcular saldo do usuário
export async function getBalance(userId) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId }
    });

    const balance = transactions.reduce((acc, transaction) => {
      if (transaction.tipo === 'entrada') {
        return acc + transaction.valor;
      } else {
        return acc - transaction.valor;
      }
    }, 0);

    return { data: { balance } };
  } catch (error) {
    return { error: 'Erro ao calcular saldo: ' + error.message };
  }
}
