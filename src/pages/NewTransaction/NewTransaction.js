import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import api from '../../services/apiBackend2';

export default function NewTransaction() {
  const [type, setType] = useState(0); // 0 = despesa, 1 = receita
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');

  const handleAddTransaction = async () => {
    try {
      const response = await api.post('/transactions', {
        type,
        description,
        value: parseFloat(value),
      });
      console.log('Transação adicionada:', response.data);
      // Redirecionar ou limpar formulário após sucesso
    } catch (error) {
      console.error('Erro ao adicionar transação:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Nova Transação</Text>

      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={description}
        onChangeText={setDescription}
      />

      <TextInput
        style={styles.input}
        placeholder="Valor"
        keyboardType="numeric"
        value={value}
        onChangeText={setValue}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.typeButton, type === 0 && styles.activeButton]}
          onPress={() => setType(0)}
        >
          <Text style={styles.buttonText}>Despesa</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.typeButton, type === 1 && styles.activeButton]}
          onPress={() => setType(1)}
        >
          <Text style={styles.buttonText}>Receita</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleAddTransaction}>
        <Text style={styles.submitButtonText}>Adicionar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  typeButton: {
    flex: 1,
    padding: 15,
    marginHorizontal: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#6200ea',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#6200ea',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});