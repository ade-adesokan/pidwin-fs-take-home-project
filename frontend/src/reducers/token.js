import { SET_TOKEN } from '../constants/actionTypes';

// It may be possible to fetch the token data here and use the value from the backend as the default
// this way refreshing the app will always use an up-to-date value and there won't be a need to
// get/set it in localStorage

const tokenReducer = (state = { tokenData: null }, action) => {
    switch (action.type) {
        case SET_TOKEN:
            localStorage.setItem('tokens', action?.data);
            return { ...state, tokenData: action?.data };

        default:
            return state;
    }
}
export default tokenReducer;