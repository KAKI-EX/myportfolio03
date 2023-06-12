import applyCaseMiddleware from "axios-case-converter";
import axios from "axios";

const options = {
  ignoreHeaders: true,
};

const client = applyCaseMiddleware(
  axios.create({
    baseURL: "http://192.168.0.210:3001/api/v1",
  }),
  options
);

function getCookie(name: string) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    const poppedValue = parts.pop();
    if (poppedValue) {
      return poppedValue.split(";").shift();
    }
  }
}

client.interceptors.request.use(
  (config) => {
    const updatedConfig = { ...config };
    const accessToken = getCookie("_access_token");
    const uid = getCookie("_uid");
    const clientCookie = getCookie("_client");

    if (accessToken && uid && clientCookie) {
      updatedConfig.headers["access-token"] = accessToken;
      updatedConfig.headers.uid = uid;
      updatedConfig.headers.client = clientCookie;
    }

    return updatedConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;
