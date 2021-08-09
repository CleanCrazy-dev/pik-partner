import axios from '../axios';

export function signin(email, password) {
    return axios.post('/driver/signin', {email, password})
        .then(({data}) => {
            return data;
        });
}

export function signout() {
    return axios.post('/driver/signout')
        .then(({data}) => {
            return data;
        });
}

export function getInfo() {
    return axios.post('/driver/signout', {email, password})
        .then(({data}) => {
            return data;
        });
}

export function register(mobile, email, password) {
    return axios.post('/driver/register', {email, mobile, password})
        .then(({data}) => {
            return data;
        });
}

export function confirmMobile(userId, confirmCode) {
    return axios.post('/driver/confirm', {userId, confirmCode})
        .then(({data}) => {
            console.log('confirm response', data);
            return data;
        });
}

export function resendConfirmCode(email, mobile) {
    return axios.post('/driver/resendConfirmCode', {email, mobile})
        .then(({data}) => {
            console.log('confirm response', data);
            return data;
        });
}

export function recoverPassword(params) {
    return axios.post('/driver/recover-password', params)
        .then(({data}) => {
            return data;
        });
}
