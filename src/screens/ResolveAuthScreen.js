import React, { useEffect, useContext } from "react";
import TrackContext from "../context/TrackContext";
import { AsyncStorage } from "react-native";

const ResolveAuthScreen = ({ navigation }) => {
  const appContext = useContext(TrackContext);

  useEffect(() => {
    async function tryLocalSingin() {
      const token = await AsyncStorage.getItem("trackAppToken");
      if (token) {
        appContext.dispatch({ type: "SIGN_IN", payload: token });
        navigation.navigate("TrackList");
      } else {
        navigation.navigate("Signup");
      }
    }
    tryLocalSingin();
  }, []);

  return null;
};

export default ResolveAuthScreen;
