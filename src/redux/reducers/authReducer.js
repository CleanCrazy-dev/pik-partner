import {
    AUTH_SET_USER,
} from '../actionTypes';

const initialState = {
    user: null,
};

export default function (state = initialState, action) {
    switch (action.type) {
        case AUTH_SET_USER:
            let {user} = action.payload;
            return {...state, user};
        default:
            return state;
    }
}
