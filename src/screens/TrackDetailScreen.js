import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import TrackContext from "../context/TrackContext";
import MapView, { Polyline } from "react-native-maps";
import { Text, Button } from "react-native-elements";
import Spacer from "../components/Spacer";
import { SafeAreaView } from "react-navigation";

const TrackDetailScreen = ({ navigation }) => {
  const _id = navigation.getParam("_id");
  const appContext = useContext(TrackContext);
  const track = appContext.state.tracks.find((t) => t._id === _id);
  const initialCoords = track.locations[0].coords;

  return (
    <>
      <SafeAreaView forceInset={{ top: "always" }}>
        <Spacer>
          <Text h3 style={styles.heading}>
            {track.name}
          </Text>
        </Spacer>
        <MapView
          style={styles.map}
          initialRegion={{
            longitudeDelta: 0.01,
            latitudeDelta: 0.01,
            ...initialCoords,
          }}
        >
          <Polyline coordinates={track.locations.map((loc) => loc.coords)} />
        </MapView>
        <Spacer>
          <Button
            title="Voltar"
            onPress={() => navigation.navigate("ListaCorridas")}
          />
        </Spacer>
      </SafeAreaView>
    </>
  );
};

TrackDetailScreen.navigationOptions = () => {
  return { header: () => false };
};

const styles = StyleSheet.create({
  heading: {
    textAlign: "center",
  },
  map: {
    height: 300,
  },
});

export default TrackDetailScreen;
