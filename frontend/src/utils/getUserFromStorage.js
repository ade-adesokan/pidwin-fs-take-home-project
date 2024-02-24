import { jwtDecode } from "jwt-decode";

export function getUserFromStorage() {
  return localStorage.getItem("profile")
  ? jwtDecode(JSON.parse(localStorage.getItem("profile")).token)
  : "null"
}