import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { loginUser } from "../../services/apiBackend2";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert("Erro", "Preencha todos os campos");
      return;
    }

    const emailTrimmed = email.trim().toLowerCase();

    setLoading(true);
    const result = await loginUser(emailTrimmed, senha);
    setLoading(false);

    if (result.error) {
      Alert.alert("Erro", result.error);
      return;
    }

    // Token e usuário já foram salvos pela função loginUser
    navigation.reset({
      index: 0,
      routes: [{ name: 'Main' }]
    });
  }

  return (
    <LinearGradient
      colors={["#F5F6FA", "#D9DBF1"]}
      style={styles.container}
    >
      <View style={styles.content}>

        {/* LOGO */}
        <Image
          source={require("../../../assets/images/logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* EMAIL */}
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

        {/* SENHA */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#999"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        {/* BOTÃO ENTRAR */}
        <TouchableOpacity 
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Entrando..." : "Entrar"}
          </Text>
        </TouchableOpacity>

        {/* LINHA CADASTRO */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Ainda não possui uma conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
            <Text style={styles.registerLink}>Cadastre-se</Text>
          </TouchableOpacity>

        </View>

        {/* ESQUECI A SENHA */}
        <TouchableOpacity 
          style={{ marginTop: 30 }}
          onPress={() => navigation.navigate("RecuperarSenha")}
        >
          <Text style={styles.forgotPassword}>Esqueci minha senha</Text>
        </TouchableOpacity>
      </View>

      {/* RODAPÉ */}
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

  logo: {
    width: 130,
    height: 130,
    marginBottom: 50,
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

  registerRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  registerText: {
    color: "#444",
  },

  registerLink: {
    color: "#1E3A8A",
    fontWeight: "600",
  },

  forgotPassword: {
    color: "#1E3A8A",
    fontSize: 16,
    fontWeight: "500",
  },

  footer: {
    textAlign: "center",
    paddingBottom: 20,
    color: "#7A7A7A",
  },
});
