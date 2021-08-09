import {AUTH_SET_USER} from '../actionTypes';

export const setAuthUser = user => ({
    type: AUTH_SET_USER,
    payload: {user},
});
