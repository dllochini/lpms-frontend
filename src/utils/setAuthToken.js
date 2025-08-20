import axiosBackend from "../configs/axios-config";

const setAuthToken = (token) => {
  if (token) {
    axiosBackend.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosBackend.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
