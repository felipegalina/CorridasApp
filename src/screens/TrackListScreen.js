import React, { useState, useContext } from "react";
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { ListItem, Text } from "react-native-elements";
import { NavigationEvents } from "react-navigation";
import tracker from "../api/tracker";
import TrackContext from "../context/TrackContext";
import Spacer from "../components/Spacer";

const TrackListScreen = ({ navigation }) => {
  const appContext = useContext(TrackContext);
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(null);

  async function fetchTracks() {
    setLoading(true);
    const response = await tracker.get("tracks");
    setTracks(response.data);
    setLoading(false);
    appContext.dispatch({ type: "ADD_TRACKS", payload: response.data });
  }

  if (loading) {
    return <ActivityIndicator size="large" style={{ marginTop: 300 }} />;
  }

  return (
    <>
      <NavigationEvents onWillFocus={fetchTracks} />

      {tracks.length > 0 ? (
        <FlatList
          data={tracks}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate("TrackDetail", { _id: item._id })
                }
              >
                <ListItem chevron title={item.name} />
              </TouchableOpacity>
            );
          }}
        />
      ) : (
        <Spacer>
          <Text h5>Nenhuma corrida realizada</Text>
        </Spacer>
      )}
    </>
  );
};

TrackListScreen.navigationOptions = () => {
  return { title: "Corridas" };
};

const styles = StyleSheet.create({});

export default TrackListScreen;
