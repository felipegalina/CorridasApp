import axios from "axios";
import { AsyncStorage } from "react-native";

const instance = axios.create({
  baseURL: "https://server-for-track-app.herokuapp.com/",
});

//allows us to auth before making requests to back end
instance.interceptors.request.use(
  //first function is called upon the request, second is called if there is an error
  async (config) => {
    const token = await AsyncStorage.getItem("trackAppToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
