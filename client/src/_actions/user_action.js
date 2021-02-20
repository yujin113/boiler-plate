import axios from "axios";
import { LOGIN_USER, REGISTER_USER } from "./types";

export function loginUser(dataToSubmit) {
  const request = axios
    .post("/api/users/login", dataToSubmit)
    .then((response) => response.data); // 서버에서 받은 data를 request에 저장
  return {
    type: LOGIN_USER,
    payload: request,
    // Reducer로 보내기
  };
}

export function registerUser(dataToSubmit) {
  const request = axios
    .post("/api/users/register", dataToSubmit)
    .then((response) => response.data); // 서버에서 받은 data를 request에 저장
  return {
    type: REGISTER_USER,
    payload: request,
    // Reducer로 보내기
  };
}
