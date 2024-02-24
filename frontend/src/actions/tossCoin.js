import { RESET_TOSS_HISTORY, SET_TOKEN } from "../constants/actionTypes";
import * as api from "../api";
import * as messages from "../messages";

const capitalize = word => word.charAt(0).toUpperCase() + word.slice(1);

export const tossCoin = (formData) => async (dispatch) => {
  try {
    const { data } = await api.tossCoin(formData);
    const { data: tossData } = await api.getTosses({limit: 10})
    dispatch({ type: SET_TOKEN, data: data.token });
    dispatch({ type: RESET_TOSS_HISTORY, data: tossData });

    messages.success(capitalize(data.message));
  } catch (error) {
    messages.error(error.response.data.message);
  }
};
