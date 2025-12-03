import { useState } from 'react';
import {
    Alert,
    Keyboard,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback
} from 'react-native';
import { createTransaction } from '../../services/apiBackend';

export default function New({ navigation, route }) {
  const [label, setLabel] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  // 1 = receita, 0 = despesa
  const type = route?.params?.type ?? 1;
  
  console.log('🆕 Tela New - Type recebido:', type, type === 1 ? 'RECEITA' : 'DESPESA');

  async function handleRegister() {
    Keyboard.dismiss();

    if (!label || !amount) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const value = parseFloat(amount.replace(',', '.'));
    
    if (isNaN(value) || value <= 0) {
      Alert.alert("Erro", "Digite um valor válido");
      return;
    }

    setLoading(true);
    const result = await createTransaction({
      description: label.trim(),
      value: value,
      type: type
    });
    setLoading(false);

    if (result.error) {
      Alert.alert("Erro", result.error);
      return;
    }

    // Sucesso - volta para tela principal que vai recarregar automaticamente
    navigation.goBack();
  }

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>
          {type === 1 ? 'Nova Receita' : 'Nova Despesa'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Descrição"
          placeholderTextColor="#888"
          value={label}
          onChangeText={setLabel}
          returnKeyType="next"
          blurOnSubmit={false}
          autoComplete="off"
          autoCorrect={false}
          spellCheck={false}
        />

        <TextInput
          style={styles.input}
          placeholder="Valor"
          placeholderTextColor="#888"
          keyboardType="decimal-pad"
          value={amount}
          onChangeText={setAmount}
          returnKeyType="done"
          selectTextOnFocus
          autoComplete="off"
          autoCorrect={false}
          spellCheck={false}
        />

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: type === 1 ? '#3b3dbf' : '#e74c3c' }
          ]}
          onPress={handleRegister}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Cadastrando...' : 'Cadastrar'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 14,
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#121212',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    userSelect: 'text', // Permite seleção de texto
    cursor: 'text', // Cursor de texto
  },
  button: {
    marginTop: 10,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 16,
    alignItems: 'center',
  },
  cancelText: {
    color: '#555',
    fontSize: 16,
  },
});
