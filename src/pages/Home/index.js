import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Home() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  return (
    <LinearGradient
      colors={["#F5F6FA", "#D9DBF1"]}
      style={styles.container}
    >
      <View style={styles.content}>
        
        {/* LOGO */}
        <Image 
          source={require("../../../assets/images/icon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* EMAIL */}
        <TextInput
          style={styles.input}
          placeholder="Endereço de e-mail"
          placeholderTextColor="#999"
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
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {/* LINHA CADASTRO */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Ainda não possui uma conta? </Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>Cadastre-se</Text>
          </TouchableOpacity>
        </View>

        {/* ESQUECI A SENHA */}
        <TouchableOpacity style={{ marginTop: 30 }}>
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
    backgroundColor: "#9CA7F3",
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
