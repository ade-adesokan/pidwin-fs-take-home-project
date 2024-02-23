export function getTokensFromStorage() {
  return localStorage.getItem("token")
  ? JSON.parse(localStorage.getItem("token")).token
  : 0
}