import { SET_TOKEN } from '../constants/actionTypes';

const tokenReducer = (state = { tokenData: null }, action) => {
    switch (action.type) {
        case SET_TOKEN:
            localStorage.setItem('token', JSON.stringify({ ...action?.data }));
            return { ...state, tokenData: action?.data };

        default:
            return state;
    }
}
export default tokenReducer;