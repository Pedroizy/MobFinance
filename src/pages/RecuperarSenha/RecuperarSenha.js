import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { forgotPassword } from "../../services/apiBackend";

export default function RecuperarSenha({ navigation }) {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [etapa, setEtapa] = useState(1); // 1 = email, 2 = código e nova senha

  async function handleEnviarCodigo() {
    if (!email) {
      Alert.alert("Erro", "Digite seu email");
      return;
    }

    setLoading(true);
    const result = await forgotPassword(email.trim().toLowerCase());
    setLoading(false);

    if (result.error) {
      Alert.alert("Erro", result.error);
      return;
    }

    Alert.alert(
      "Código Enviado",
      `Um código de recuperação foi enviado para ${email}. (Por enquanto, use: ${result.code})`
    );
    setEtapa(2);
  }

  async function handleRedefinirSenha() {
    if (!codigo || !novaSenha || !confirmarSenha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Alert.alert("Erro", "As senhas não coincidem");
      return;
    }

    if (novaSenha.length < 6) {
      Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    const result = await forgotPassword(
      email.trim().toLowerCase(),
      codigo.trim(),
      novaSenha
    );
    setLoading(false);

    if (result.error) {
      Alert.alert("Erro", result.error);
      return;
    }

    // Sucesso - volta direto para o login
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }]
    });
  }

  return (
    <LinearGradient
      colors={["#F5F6FA", "#D9DBF1"]}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Text style={styles.title}>Recuperar Senha</Text>
        <Text style={styles.subtitle}>
          {etapa === 1
            ? "Digite seu email para receber o código de recuperação"
            : "Digite o código recebido e sua nova senha"}
        </Text>

        {etapa === 1 ? (
          <>
            <TextInput
              style={styles.input}
              placeholder="Endereço de e-mail"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleEnviarCodigo}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Enviando..." : "Enviar Código"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Código de recuperação"
              placeholderTextColor="#999"
              keyboardType="number-pad"
              maxLength={6}
              value={codigo}
              onChangeText={setCodigo}
            />

            <TextInput
              style={styles.input}
              placeholder="Nova senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={novaSenha}
              onChangeText={setNovaSenha}
            />

            <TextInput
              style={styles.input}
              placeholder="Confirmar nova senha"
              placeholderTextColor="#999"
              secureTextEntry
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
            />

            <TouchableOpacity
              style={styles.button}
              onPress={handleRedefinirSenha}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Redefinindo..." : "Redefinir Senha"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setEtapa(1)}>
              <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Text style={styles.footer}>MobFinance © 2025</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 35,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    color: "#1D2B53",
    fontWeight: "600",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#444",
    paddingVertical: 8,
    marginBottom: 20,
    fontSize: 16,
    color: "#000",
  },
  button: {
    width: "100%",
    backgroundColor: "#8000ff",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  backText: {
    marginTop: 15,
    color: "#1E3A8A",
    fontSize: 14,
    fontWeight: "500",
  },
  cancelButton: {
    marginTop: 30,
  },
  cancelText: {
    color: "#666",
    fontSize: 14,
  },
  footer: {
    textAlign: "center",
    paddingBottom: 20,
    color: "#7A7A7A",
  },
});
