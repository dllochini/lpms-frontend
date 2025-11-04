import axiosBackend from "../configs/axios-config";

export const setAuthToken = (token) => {
  if (token) {
    // console.log("Setting auth token in headers", token);
    axiosBackend.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosBackend.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
