import React, { useEffect, useState, useRef } from 'react';
import { StatusBar, AppState, PermissionsAndroid, Platform, Alert } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { connect } from 'react-redux'
import messaging from '@react-native-firebase/messaging';
import {
    createStackNavigator,
} from '@react-navigation/stack';

import AuthStack from './authNavigator';
import PersonalDetailStack from './personalDetailNavigator';
import MainStack from './mainNavigator';
import LoadingScreen from '../screens/LoadingScreen';
import { useAuth } from '../utils/auth';
import DriverStatuses from '../../../node-back/src/constants/DriverStatuses';
import { getDeviceInfo } from '../utils/helpers';
import Api from '../utils/api'
import {
    reloadCurrentOrder as reloadCurrentOrderAction,
    setCurrentLocation as setCurrentLocationAction,
    setLocationAvailable,
    setOrderChatList as setOrderChatListAction,
    setCurrentLang as setCurLang
} from '../redux/actions/appActions';
import {
    setAuthUser as setAuthUserAction,
} from '../redux/actions/authActions';
import EventBus, { EVENT_DOCUMENTS_APPROVE, EVENT_DOCUMENTS_RECHECK, EVENT_DOCUMENTS_REJECT } from '../eventBus';
import Geolocation from '@react-native-community/geolocation';
import getCurrentPosition from '../utils/getCurrentPosition';
import { COLOR_PRIMARY_900 } from '../utils/constants';
import firestore from '../utils/firestore';
import Toast from 'react-native-toast-message'
import { useTranslation } from 'react-i18next';
import BackgroundTimer from 'react-native-background-timer';
import ReactNativeForegroundService from '@supersami/rn-foreground-service';
import RNLocation from 'react-native-location';
import { check, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
const Nav = createStackNavigator();

async function requestUserNotificationPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        const fcmToken = await messaging().getToken();
        let deviceInfo = getDeviceInfo()
        Api.Driver.registerDevice({ fcmToken, ...deviceInfo })
            .then(async data => {
                if (data.success) {
                    console.log('device registered successfully')
                    // await AsyncStorage.setItem('device-info', JSON.stringify({fcmToken, ...deviceInfo}))
                }
                else {
                    console.log(data)
                }
            })
            .catch(error => {
                console.log('OMG-1:',error)
            })
    }
}

const RootNavigator = ({ reloadCurrentOrder, setOrderChatList, ...props }) => {
    const { t, i18n } = useTranslation();

    let auth = useAuth();
    const [isOnline, setOnline] = useState(false);
    const needToGetPersonalDetails = () => {
        let { hired, status } = auth.user || {};
        // if (!hired) {
        if (status !== DriverStatuses.Approved) {
            return true;
        }
        return false;
    };

    const bootstrapRoutes = () => {
        if (!auth.initialized) {
            return <Nav.Screen name="AppLoading" component={LoadingScreen} />;
        } else {
            if (!auth.loggedIn) {
                return <Nav.Screen name="Auth" component={AuthStack} />;
            } else if (needToGetPersonalDetails()) {
                return <Nav.Screen name="PersonalDetail" component={PersonalDetailStack} />;
            } else {
                return <Nav.Screen name="Main" component={MainStack} />;
            }
        }
    };

    React.useEffect(() => {
        if (auth.initialized)
            SplashScreen.hide()
    }, [auth.initialized])
    const requestPermission = async () => {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Permiso para rastrear ubicación',
                message:
                    'Pik Partner necesita acceso a tu ubicación en todo momento para brindar actualizaciones de ubicación a los clientes.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        const backgroundgranted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
            {
                title: 'Permiso para rastrear ubicación',
                message:
                    'Pik Partner necesita acceso a tu ubicación en todo momento para brindar actualizaciones de ubicación a los clientes.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (backgroundgranted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('PermissionsAndroid.RESULTS.GRANTED')
        } else {
            props.setLocationAvailable(false);
            setOnline(false);
            Api.Driver.updateStatus(false)
                .then(({ success, message }) => {
                    console.log('offline', success);
                    if (success) {
                        return auth.reloadUserInfo();
                    } else {
                        Alert.alert(t('general.Warning'), message || 'Somethings went wrong');
                        throw { message: message || 'Somethings went wrong' };
                    }
                })
        }
    }
    useEffect(async () => {
        console.log(props.locationAvailable);
        console.log(auth?.user?.online);
        if (isOnline && auth?.user?.online == true) {
            ReactNativeForegroundService.add_task(
                () => {
                    if (Platform.OS === 'android') {
                        check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
                            .then((result) => {
                                switch (result) {
                                    case RESULTS.DENIED:
                                        requestPermission();
                                        break;
                                    case RESULTS.GRANTED:
                                        console.log('use online => Granted')
                                        Geolocation.getCurrentPosition((result) => {
                                            if (!props.locationAvailable) {
                                                props.setLocationAvailable(true)
                                            }
                                            else {
                                                props.setCurrentLocation(result)
                                                Api.Driver.updateLocation(result)
                                                    .then(() => {
                                                    }).catch(error => console.log('error1=>',error))
                                            }
                                        })
                                        break;
                                }
                            })
                    }
                },
                {
                    delay: 5000,
                    onLoop: true,
                    taskId: 'taskid',
                    onError: (e) => console.log('Error logging:', e),
                },
            );
            if (!ReactNativeForegroundService.is_running()) {
                console.log('==========================')
                await ReactNativeForegroundService.start({
                    id: 144,
                    title: "PIK Partner",
                    message: "Estás en línea",
                    icon: "ic_notification"
                });
            }
            console.log('ReactNativeForegroundService.is_running()', ReactNativeForegroundService.is_running());
        } else {
            ReactNativeForegroundService.remove_all_tasks();
            ReactNativeForegroundService.stop();
        }
        return () => {
            console.log('close')
            ReactNativeForegroundService.remove_all_tasks();
            ReactNativeForegroundService.stop();
        };
    }, [isOnline, auth?.user?.online])
    let timerHandler = null;
    useEffect(() => {
        if (auth.loggedIn) {
            //do your thing!
            timerHandler = setInterval(() => {
                if (Platform.OS === 'android') {
                    check(PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION)
                        .then((result) => {
                            console.log('result--1', result)
                            switch (result) {
                                case RESULTS.DENIED:
                                    requestPermission();
                                    break;
                                case RESULTS.GRANTED:
                                    setOnline(true);
                                    if (!props.locationAvailable) {
                                        props.setLocationAvailable(true)
                                    }
                                    break;
                            }
                        })
                }
            }, 5000);
            return () => {
                console.log("=====close");
                clearInterval(timerHandler);
            };
        }
    }, [auth.loggedIn, props.locationAvailable]);

    React.useEffect(() => {
        if (auth.loggedIn) {
            if (props.locationAvailable) {
                const watchId = Geolocation.watchPosition((result) => {
                    props.setCurrentLocation(result)
                    Api.Driver.updateLocation(result)
                        .then(() => {
                        }).catch(error => console.log('OMG-2:',error))
                }, error => {
                    console.log('========== location watch error ===========', error)
                    switch (error.code) {
                        case 1:
                        case 2:
                            props.setLocationAvailable(false)
                    }
                })
                return () => Geolocation.clearWatch(watchId);
            }
        }
    }, [props.locationAvailable, auth.loggedIn])

    const onAppStateChange = nextAppState => {
        if (nextAppState === 'active') {
            reloadCurrentOrder()
        }
    }

    React.useEffect(() => {
        AppState.addEventListener('change', onAppStateChange);
        return () => {
            AppState.removeEventListener('change', onAppStateChange);
        }
    }, [])

    /** Watch Orders chats */
    useEffect(() => {
        console.log(`getting chat rooms of [${auth?.user?.name}] .........`)
        const unsubscribe = firestore()
            .collection('pik_delivery_order_chats')
            .where(`userList.${auth?.user?._id}`, '!=', false)
            .onSnapshot(querySnapshot => {
                const threads = querySnapshot.docs.map(documentSnapshot => {
                    return {
                        id: documentSnapshot.id,
                        ...documentSnapshot.data()
                    }
                })

                console.log(`driver chat list: [${threads.length}] chats`)
                setOrderChatList(threads)
            }, error => {
                console.error('firestore error', error)
            })
        return () => unsubscribe()
    }, [auth.user?._id?.toString()])

    useEffect(() => {
        /**
         * this used for reflect auth into the redux
         * in some cases authenticated user needed
         */
        props.setAuthUser(auth.user)
    }, [auth?.user?._id])

    useEffect(() => {
        console.log("---- current_ lang - ", props.current_lang, i18n.language);
        if (!!props.current_lang && props.current_lang != undefined) {
            i18n.changeLanguage(props.current_lang);
        }
        else {
            i18n.changeLanguage('es');
            setCurLang('es');
        }
    }, [props.current_lang]);

    return <React.Fragment>
        <StatusBar barStyle="light-content" backgroundColor={COLOR_PRIMARY_900} />
        <Nav.Navigator headerMode={'none'}>
            {bootstrapRoutes()}
        </Nav.Navigator>
        <Toast ref={(ref) => Toast.setRef(ref)} />
    </React.Fragment>
}

const mapStateToProps = state => ({
    currentLocation: state.app.location.current,
    locationAvailable: state.app.location.available,
    current_lang: state.app.current_lang
})

const mapDispatchToProps = dispatch => {
    return {
        reloadCurrentOrder: () => dispatch(reloadCurrentOrderAction()),
        setCurrentLocation: currentLocation => dispatch(setCurrentLocationAction(currentLocation)),
        setLocationAvailable: available => dispatch(setLocationAvailable(available)),
        setOrderChatList: chatList => dispatch(setOrderChatListAction(chatList)),
        setAuthUser: user => dispatch(setAuthUserAction(user)),
        setCurLang: lang => dispatch(setCurrentLang(lang))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RootNavigator);
// export default AuthNavigator;
