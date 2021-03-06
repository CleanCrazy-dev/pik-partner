import React, {
    createContext,
    useContext,
    useMemo,
    useCallback,
    useState,
    useEffect,
} from 'react';
import axios from './axios';
import { timeout } from '../utils/helpers';
import AsyncStorage from '@react-native-community/async-storage';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import { omit, assign } from 'lodash';

const AuthContext = createContext(null);

const ASYNC_STORAGE_AUTH_KEY = 'pik_driver_auth_token';

function useAuth() {
    const authContext = useContext(AuthContext);

    if (authContext === null) {
        throw new Error(
            'useAuth() can only be used inside of <AuthProvider />, ' +
            'please declare it at a higher level.',
        );
    }

    const { auth } = authContext;

    return useMemo(
        () => ({
            ...auth,
        }),
        [authContext, auth],
    );
}

function AuthProvider({ children }) {
    const authContext = useContext(AuthContext);

    if (authContext !== null) {
        throw new Error('<AuthProvider /> has already been declared.');
    }

    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [initialized, setInitialized] = useState(false);
    const [error, setError] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);
    const login = useCallback(
        (email, password) => {
            return axios
                .post('/driver/signin', { email, password })
                .then(async ({ data }) => {
                    if (data.success) {
                        console.log(data);
                        await AsyncStorage.setItem(ASYNC_STORAGE_AUTH_KEY, data.token);
                        setUser(data.user);
                        setTimeout(() => {
                            try {
                                setLoggedIn(true);
                            } catch (err) {
                            }
                        }, 1000);
                        axios.defaults.headers.common = assign(
                            axios.defaults.headers.common,
                            {
                                Authorization: 'Bearer ' + data.token,
                            },
                        );
                    } else {
                        console.log(data);
                        setError(data.message || 'Some things went wrong');
                    }
                    return data;
                })
                .catch((error) => {
                    setError(
                        error?.response?.data?.message ||
                        error?.message ||
                        'server side error',
                    );
                    return error.response;
                });
        },
        [authContext, user, loggedIn],
    );

    const loginWith = useCallback(
        (token, user) => {
            return Promise.resolve()
                .then(async () => {
                    await AsyncStorage.setItem(ASYNC_STORAGE_AUTH_KEY, token);
                    setUser(user);
                    axios.defaults.headers.common = assign(
                        axios.defaults.headers.common,
                        {
                            Authorization: 'Bearer ' + token,
                        },
                    );
                    setLoggedIn(true);
                })
                .catch((error) => {
                    console.log(error);
                    setError(error?.message || 'somethings went wrong');
                    return error?.response;
                });
        },
        [authContext, user, loggedIn],
    );

    useEffect(() => {
        reloadUserInfo();
    }, [authContext, loggedIn])

    const logout = useCallback(() => {
        let config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return axios
            .post('/driver/signout', config)
            .then(async ({ data }) => {
                if (data.success) {
                    ReactNativeForegroundService.remove_all_tasks();
                    ReactNativeForegroundService.stop();
                    await AsyncStorage.removeItem(ASYNC_STORAGE_AUTH_KEY);
                    setLoggedIn(false);
                    // setUser(null);
                    axios.defaults.headers.common = omit(axios.defaults.headers.common, [
                        'Authorization',
                    ]);
                } else {
                    setError(data.message || 'Some things went wrong');
                }
                return data;
            })
            .catch((error) => {
                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    'server side error',
                );
                return error.response;
            });
    }, [authContext, user, loggedIn]);

    const reloadUserInfo = () => {
        let config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };
        return axios
            .get(`/driver/info?t=${Date.now()}`, config)
            .then(({ data }) => {
                if (data.success) {
                    setUser(data.user);
                } else {
                    setError(data.message || 'Somethings went wrong');
                }
                return timeout(50);
            })
            .catch((error) => {
                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Somethings went wrong',
                );
            });
    };

    const reset = useCallback(() => {
        console.log('auth reset ...')
        let _token = null;
        AsyncStorage.getItem(ASYNC_STORAGE_AUTH_KEY)
            .then((tokenFromStorage) => {
                if (!tokenFromStorage) {
                    throw { response: { data: { message: 'user not logged in' } } };
                }
                _token = tokenFromStorage;
                setToken(_token);
                let config = {
                    headers: {
                        Authorization: `Bearer ${_token}`,
                    },
                };
                return axios.get('/driver/info', config);
            })
            .then(({ data }) => {
                if (data.success) {
                    setUser(data.user);
                    setLoggedIn(true);
                    axios.defaults.headers.common = assign(
                        axios.defaults.headers.common,
                        {
                            Authorization: 'Bearer ' + _token,
                        },
                    );
                } else {
                    setError(data.message || 'Somethings went wrong');
                }
            })
            .catch((error) => {
                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Somethings went wrong',
                );
            })
    }, [authContext])

    useEffect(() => {
        let _token = null;
        AsyncStorage.getItem(ASYNC_STORAGE_AUTH_KEY)
            .then((tokenFromStorage) => {
                if (!tokenFromStorage) {
                    throw { response: { data: { message: 'user not logged in' } } };
                }
                _token = tokenFromStorage;
                setToken(_token);
                let config = {
                    headers: {
                        Authorization: `Bearer ${_token}`,
                    },
                };
                return axios.get(`/driver/info?t=${Date.now()}`, config);
            })
            .then(({ data }) => {
                if (data.success) {
                    setUser(data.user);
                    setLoggedIn(true);
                    axios.defaults.headers.common = assign(
                        axios.defaults.headers.common,
                        {
                            Authorization: 'Bearer ' + _token,
                        },
                    );
                } else {
                    setError(data.message || 'Somethings went wrong');
                }
            })
            .catch((error) => {
                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Somethings went wrong',
                );
            })
            .then(() => {
                setInitialized(true);
            });
        return () => {
        };
    }, [authContext, loggedIn]);

    let auth = useMemo(
        () => ({
            loggedIn,
            initialized,
            user,
            error,
            login,
            loginWith,
            logout,
            reloadUserInfo,
            reset,
        }),
        [
            loggedIn,
            initialized,
            user,
            error,
            login,
            loginWith,
            reloadUserInfo,
            logout,
            reset,
        ],
    );

    return (
        <AuthContext.Provider
            value={{
                auth: auth,
            }}>
            {children}
        </AuthContext.Provider>
    );
}

export { AuthProvider, useAuth };
