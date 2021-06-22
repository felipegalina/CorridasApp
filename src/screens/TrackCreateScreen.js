// import "../_mocklocation";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Map from "../components/Map";
import { SafeAreaView, withNavigationFocus } from "react-navigation";
import { Text, Input, Button } from "react-native-elements";
import {
  requestPermissionsAsync,
  watchPositionAsync,
  Accuracy,
} from "expo-location";
import Spacer from "../components/Spacer";
import tracker from "../api/tracker";
import { FontAwesome5 } from "@expo/vector-icons";

const TrackCreateScreen = ({ isFocused, navigation }) => {
  const [err, setErr] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [recording, setRecording] = useState(false);
  const [locations, setLocations] = useState([]);
  const [name, setName] = useState("");
  const [sub, setSub] = useState(null);
  const [savePressed, setSavePressed] = useState(false);

  useEffect(() => {
    async function startWatching() {
      await requestPermissionsAsync();
      const subscriber = await watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
          timeInterval: 1000,
          distanceInterval: 10,
        },
        (location) => {
          setCurrentLocation(location);
          if (recording) {
            setLocations((locations) => [...locations, location]);
          }
        }
      );
      setSub(subscriber);
    }

    if (isFocused || recording) {
      startWatching();
    } else {
      sub.remove();
    }
  }, [isFocused, recording]);

  async function handleSave() {
    setRecording(false);
    setSavePressed(true);
    await tracker.post("/tracks", { name, locations });
    setName("");
    setLocations([]);
    setSavePressed(false);
    navigation.navigate("TrackList");
  }

  return (
    <SafeAreaView forceInset={{ top: "always" }}>
      <Spacer>
        <Text style={styles.heading} h3>
          Criar uma corrida
        </Text>
      </Spacer>
      <Map locations={locations} currentLocation={currentLocation} />
      {err ? <Text>Por favor, ative a permissão de localização</Text> : null}
      <Spacer>
        <Input
          value={name}
          onChangeText={(newText) => setName(newText)}
          placeholder="Digite o nome da Corrida"
        />
        {recording ? (
          <Button title="Parar" onPress={() => setRecording(false)} />
        ) : !!locations.length ? (
          <Button title="Retomar" onPress={() => setRecording(true)} />
        ) : (
          <Button title="Iniciar" onPress={() => setRecording(true)} />
        )}
        {!recording && !!locations.length ? (
          <>
            <Spacer></Spacer>
            <Button
              title="Salvar"
              type="clear"
              loading={savePressed}
              onPress={handleSave}
            />
            <Button
              title="Cancelar"
              type="clear"
              onPress={() => {
                setRecording(false);
                setSavePressed(false);
                setName("");
                setLocations([]);
              }}
            />
          </>
        ) : null}
      </Spacer>
    </SafeAreaView>
  );
};

TrackCreateScreen.navigationOptions = () => {
  return {
    title: "Adicionar Corrida",
    tabBarIcon: <FontAwesome5 name="plus" size={24} color="black" />,
  };
};

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
  },
});

export default withNavigationFocus(TrackCreateScreen);
