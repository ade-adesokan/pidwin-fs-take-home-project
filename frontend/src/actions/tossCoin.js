import { SET_TOKEN } from "../constants/actionTypes";
import * as api from "../api";
import * as messages from "../messages";

const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1);

export const tossCoin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.tossCoin(formData);
    dispatch({ type: SET_TOKEN, data: {token: data.token} });
    messages.success(capitalize(data.message));
  } catch (error) {
    messages.error(error.response.data.message);
  }
};
