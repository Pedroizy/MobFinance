// Mock database usando AsyncStorage
// NOTA: Para usar Prisma, você precisa criar um backend separado em Node.js
// Este é um mock temporário que simula um banco de dados usando AsyncStorage

import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = '@mobfinance:users';
const TRANSACTIONS_KEY = '@mobfinance:transactions';

// Simula o Prisma Client
const mockPrisma = {
  user: {
    async findUnique({ where }) {
      const users = await AsyncStorage.getItem(USERS_KEY);
      const userList = users ? JSON.parse(users) : [];
      return userList.find(u => u.email === where.email) || null;
    },
    
    async create({ data }) {
      const users = await AsyncStorage.getItem(USERS_KEY);
      const userList = users ? JSON.parse(users) : [];
      
      const newUser = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      userList.push(newUser);
      await AsyncStorage.setItem(USERS_KEY, JSON.stringify(userList));
      return newUser;
    },
  },
  
  transaction: {
    async findMany({ where, orderBy }) {
      const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      const transactionList = transactions ? JSON.parse(transactions) : [];
      
      let filtered = transactionList;
      if (where?.userId) {
        filtered = filtered.filter(t => t.userId === where.userId);
      }
      
      if (orderBy?.data === 'desc') {
        filtered.sort((a, b) => new Date(b.data) - new Date(a.data));
      }
      
      return filtered;
    },
    
    async create({ data }) {
      const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      const transactionList = transactions ? JSON.parse(transactions) : [];
      
      const newTransaction = {
        ...data,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        data: data.data || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      transactionList.push(newTransaction);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactionList));
      return newTransaction;
    },
    
    async findFirst({ where }) {
      const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      const transactionList = transactions ? JSON.parse(transactions) : [];
      
      return transactionList.find(t => 
        t.id === where.id && t.userId === where.userId
      ) || null;
    },
    
    async delete({ where }) {
      const transactions = await AsyncStorage.getItem(TRANSACTIONS_KEY);
      const transactionList = transactions ? JSON.parse(transactions) : [];
      
      const filtered = transactionList.filter(t => t.id !== where.id);
      await AsyncStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(filtered));
      return { id: where.id };
    },
  },
};

export default mockPrisma;
