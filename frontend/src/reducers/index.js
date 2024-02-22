import { combineReducers } from "redux";
import login from "./login";
import token from "./token";

export default combineReducers({
    login,
    token
});
