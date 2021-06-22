import React, { useReducer, useEffect } from "react";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { createBottomTabNavigator } from "react-navigation-tabs";

import AccountScreen from "./src/screens/AccountScreen";
import SigninScreen from "./src/screens/SigninScreen";
import SignupScreen from "./src/screens/SignupScreen";
import TrackCreateScreen from "./src/screens/TrackCreateScreen";
import TrackDetailScreen from "./src/screens/TrackDetailScreen";
import TrackListScreen from "./src/screens/TrackListScreen";
import ResolveAuthScreen from "./src/screens/ResolveAuthScreen";

import TrackContext from "./src/context/TrackContext";

import { Feather } from "@expo/vector-icons";

const trackListFlow = createStackNavigator({
  TrackList: TrackListScreen,
  TrackDetail: TrackDetailScreen,
});
trackListFlow.navigationOptions = () => {
  return {
    title: "Corridas",
    tabBarIcon: <Feather name="list" size={24} color="black" />,
  };
};

const switchNavigator = createSwitchNavigator({
  ResolveAuth: ResolveAuthScreen,
  loginFlow: createStackNavigator({
    Signup: SignupScreen,
    Signin: SigninScreen,
  }),
  mainFlow: createBottomTabNavigator({
    trackListFlow,
    TrackCreate: TrackCreateScreen,
    Account: AccountScreen,
  }),
});

const App = createAppContainer(switchNavigator);

export default () => {
  const initialState = {
    token: null,
    errorMessage: "",
    tracks: [],
  };

  function ourReducer(state, action) {
    switch (action.type) {
      case "ADD_ERROR":
        return { ...state, errorMessage: action.payload };
      case "SIGN_IN":
        return { errorMessage: "", token: action.payload };
      case "CLEAR_ERROR_MESSAGE":
        return { ...state, errorMessage: "" };
      case "SIGN_OUT":
        return { ...state, token: "" };
      case "ADD_TRACKS":
        return { ...state, tracks: action.payload };
      default:
        return state;
    }
  }
  const [state, dispatch] = useReducer(ourReducer, initialState);

  return (
    <TrackContext.Provider value={{ state, dispatch }}>
      <App />
    </TrackContext.Provider>
  );
};
