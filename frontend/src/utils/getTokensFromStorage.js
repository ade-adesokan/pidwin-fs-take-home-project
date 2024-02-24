export function getTokensFromStorage() {
  return localStorage.getItem("tokens")
  ? localStorage.getItem("tokens")
  : 0
}