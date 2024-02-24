import { RESET_TOSS_HISTORY } from '../constants/actionTypes';

// It is possible to fetch the toss history data here and use the value from the backend as the default
// this way refreshing the app will always use an up-to-date value and there won't be a need to
// fetch it in the TossHistory component useEffect

const tossReducer = (state = { tossHistoryData: null }, action) => {
    switch (action.type) {
        case RESET_TOSS_HISTORY:
            return { ...state, tossHistoryData: action?.data };

        default:
            return state;
    }
}
export default tossReducer;