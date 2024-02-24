import { combineReducers } from "redux";
import login from "./login";
import token from "./token";
import toss from "./toss";

export default combineReducers({
    login,
    token,
    toss
});
