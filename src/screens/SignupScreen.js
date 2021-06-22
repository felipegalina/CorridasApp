import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { Text, Input, Button } from "react-native-elements";
import { AsyncStorage } from "react-native";
import { NavigationEvents } from "react-navigation";

import trackerApi from "../api/tracker";
import TrackContext from "../context/TrackContext";
import Spacer from "../components/Spacer";

const SignupScreen = ({ navigation }) => {
  const appContext = useContext(TrackContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);

  async function signup() {
    try {
      setButtonPressed(true);
      const response = await trackerApi.post(`/signup`, { email, password });
      await AsyncStorage.setItem("trackAppToken", response.data.token);
      appContext.dispatch({
        type: "SIGN_IN",
        payload: response.data.token,
      });
      setButtonPressed(false);
      navigation.navigate("TrackList");
    } catch (e) {
      appContext.dispatch({
        type: "ADD_ERROR",
        payload: "Algo ficou errado no cadastro, verifique",
      });
      setButtonPressed(false);
    }
  }

  return (
    <View style={styles.container}>
      <NavigationEvents
        onWillFocus={() =>
          appContext.dispatch({
            type: "CLEAR_ERROR_MESSAGE",
          })
        }
      />
      <Spacer>
        <Text h3 style={styles.title}>
          Cadastre-se para Correr
        </Text>
      </Spacer>
      <Input
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={(newText) => setEmail(newText)}
        label="Email"
      />
      <Spacer />
      <Input
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        value={password}
        onChangeText={(newText) => setPassword(newText)}
        label="Senha"
      />
      {appContext.state.errorMessage ? (
        <Text style={styles.error}>{appContext.state.errorMessage}</Text>
      ) : null}
      <Spacer>
        <Button
          title="Cadastrar"
          loading={buttonPressed}
          raised
          onPress={signup}
        />
      </Spacer>
      <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
        <Spacer>
          <Text style={styles.link}>
            Já possui uma conta? Entre aqui
          </Text>
        </Spacer>
      </TouchableOpacity>
    </View>
  );
};

SignupScreen.navigationOptions = () => {
  return { header: () => false };
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginBottom: 80,
  },
  title: {
    textAlign: "center",
    marginBottom: 20,
  },
  error: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
  },
  link: {
    color: "#1a8cff",
  },
});

export default SignupScreen;
