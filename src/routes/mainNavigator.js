import React from 'react';
import {connect} from 'react-redux'
import { useNavigation, getFocusedRouteNameFromRoute } from '@react-navigation/native'
import {
    createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {SvgXml} from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
import svgs from '../utils/svgs';
import {
    reloadCurrentOrder as reloadCurrentOrderAction,
} from '../redux/actions/appActions';

import HomeStack from '../routes/homeNavigator';
import TravelsStack from '../routes/travelNavigator';
import AccountStack from '../routes/accountNavigator';
import Api from '../utils/api'
import Toast from 'react-native-toast-message'
import messaging from '@react-native-firebase/messaging';
import { useAuth } from '../utils/auth';

import { useNavigationState } from '@react-navigation/native';

import {useTranslation} from 'react-i18next';

const Nav = createBottomTabNavigator();

const MainNavigator = ({reloadCurrentOrder}) => {
    let {t} = useTranslation()

    let auth = useAuth();
    const navigation = useNavigation();

    const navIcons = {
        MainHome: {
            // on: require('../assets/images/icon-home-off.svg'),
            // off: require('../assets/images/icon-home-off.svg'),
            on: svgs['icon-home-on'],
            off: svgs['icon-home-off'],
        },
        MainTravels: {
            // on: require('../assets/images/icon-travel-on.svg'),
            // off: require('../assets/images/icon-travel-on.svg'),
            on: svgs['icon-travel-on'],
            off: svgs['icon-travel-off'],
        },
        MainAccount: {
            // on: require('../assets/images/icon-user-off.svg'),
            // off: require('../assets/images/icon-user-off.svg'),
            on: svgs['icon-user-on'],
            off: svgs['icon-user-off'],
        },

    };
    const screenOptions = ({route}) => ({
        tabBarIcon: ({focused, color, size}) => {
            if (navIcons[route.name]) {
                let iconSource = navIcons[route.name][focused ? 'on' : 'off'];
                // return <SvgUri width={size} height={size} source={iconSource} />
                return <SvgXml width={24} height={24} xml={iconSource}/>;
            } else {
                return <Ionicons name={'ios-information-circle'} size={size} color={color}/>;
            }
        },
    });

    const tabBarOptions = {
        activeTintColor: 'black',
        inactiveTintColor: 'gray',
        style: {height: 49},
        labelStyle: {
            fontWeight: '600',
            fontSize: 12,
            paddingBottom: 5,
        },
    };

    const getTabBarVisible = (navigation, route) => {
        // const routeName = route.state
        //     ?  route.state.routes[route.state.index].name
        //     : route.params?.screen || route.name;
        // const routesLength = useNavigationState(state => state.routes[0].state);
        // console.log("==============================", routesLength);

        const routeName = getFocusedRouteNameFromRoute(route) ? getFocusedRouteNameFromRoute(route) : route.params?.screen || route.name;
        let hiddenScreens = [
            'MainManualCode',
            'MainOrderChat',
            'MainCompleteDelivery',
            'MainHomePickup',
            'MainBankAccount',
            'MainSupportCenter',
            'MainSupportCenterCategory',
            'ContactUs',
            'DeliverySuccess',
        ];

        if (hiddenScreens.includes(routeName)) {
            return false;
        }
        return true;
    }

    const getOrderById = (orderId) => {
        console.log("++++++++++++++++++++++++++++ ", orderId);
        return Api.Driver.getOrderById(orderId)
            .then(data => {
                let {success, message, order} = data;
                console.log("============== ", {rq: "getOrderById", success, message})
                if(success) {
                   return order;
                }
                else return null;
            });
    }

    const handleNotificationAction = async remoteMessage => {
        console.log('notification action', remoteMessage);
        let curPage = "";

        try{
            const { index, routes } = navigation.dangerouslyGetState();
            console.log('===========  current screen : ', routes[index].state.routes[0].state.routes[routes[index].state.routes[0].state.routes.length - 1].name);
            console.log('===========  current screen : ', routes[index].state.history[routes[index].state.history.length - 1].key);
            curPage = routes[index].state.routes[0].state.routes[routes[index].state.routes[0].state.routes.length - 1].name;
        }
        catch (error) {
            console.log("===== err +++++++++++++", error);
        }

        switch (remoteMessage?.data?.action) {
            case 'suggestion':
            case 'reload_current_job':
                console.log('reloading current job ...')
                // reloadCurrentOrder()
                break;
            case 'documents_recheck':
                auth.reloadUserInfo()
                EventBus.emit(EVENT_DOCUMENTS_RECHECK)
                break;
            case 'documents_reject':
                auth.reloadUserInfo()
                EventBus.emit(EVENT_DOCUMENTS_REJECT)
                break;
            case 'documents_approve':
                auth.reloadUserInfo()
                EventBus.emit(EVENT_DOCUMENTS_APPROVE)
                break;
            case 'orderChat':
                let orderData = await getOrderById(remoteMessage?.data?.orderChat);
                console.log(orderData);
                if(orderData != null && curPage != 'MainOrderChat')
                {
                    navigation.navigate('MainOrderChat', {
                        order: orderData, 
                        customer: (!orderData?.time?.pickupComplete ? (orderData?.senderModel === 'customer' ? orderData?.sender : null) : (orderData?.receiver?.status === 'Registered' ? orderData?.receiver : null))
                    })
                }
                break;
        }
    }

    const handleQuitNotificationAction = async remoteMessage => {
        switch (remoteMessage?.data?.action) {
            case 'suggestion':
            case 'reload_current_job':
                console.log('reloading current job ...')
                // reloadCurrentOrder()
                break;
            case 'documents_recheck':
                auth.reloadUserInfo()
                EventBus.emit(EVENT_DOCUMENTS_RECHECK)
                break;
            case 'documents_reject':
                auth.reloadUserInfo()
                EventBus.emit(EVENT_DOCUMENTS_REJECT)
                break;
            case 'documents_approve':
                auth.reloadUserInfo()
                EventBus.emit(EVENT_DOCUMENTS_APPROVE)
                break;
            case 'orderChat':
                let orderData = await getOrderById(remoteMessage?.data?.orderChat);
                console.log(orderData);
                if(orderData != null)
                {
                    navigation.navigate('MainOrderChat', {
                        order: orderData, 
                        customer: (!orderData?.time?.pickupComplete ? (orderData?.senderModel === 'customer' ? orderData?.sender : null) : (orderData?.receiver?.status === 'Registered' ? orderData?.receiver : null))
                    })
                }
                break;
        }
    }

    React.useEffect(() => {
        messaging().onNotificationOpenedApp(remoteMessage => {
            console.log(
                '======== Notification caused app to open from background state======:',
                remoteMessage.notification,
                JSON.stringify(remoteMessage),
            );
            if(remoteMessage?.data?.action){
                handleNotificationAction(remoteMessage)
            }
        });

        // Check whether an initial notification is available
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                if (remoteMessage) {
                    console.log(
                        '======== Notification caused app to open from quit state ======:',
                        remoteMessage,
                    );
                    if(remoteMessage?.data?.action){
                        handleQuitNotificationAction(remoteMessage)
                    }
                }
            });


        // Register background handler
        messaging().setBackgroundMessageHandler(async remoteMessage => {
            console.log('Message handled in the background!', remoteMessage);

            // if (remoteMessage?.data?.action) {
            //     handleNotificationAction(remoteMessage);
            // }
        });
        
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            let { notification } = remoteMessage

            console.log('+++ A new FCM message arrived!', JSON.stringify(remoteMessage));

            if (remoteMessage?.data?.action) {
                if(remoteMessage?.data?.action == 'orderChat') {
                    Toast.show({
                        type: 'info', //'success | error | info',
                        position: 'top', //'top | bottom',
                        text1: notification.title,
                        text2: notification.body,
                        visibilityTime: 15000,
                        autoHide: true,
                        topOffset: 30,
                        onPress: async () => {
                            Toast.hide();
                            
                            handleNotificationAction(remoteMessage);
                        }
                    });
                }
            }
        });
        return unsubscribe;
    }, [auth?.loggedIn])

    return <Nav.Navigator
        screenOptions={screenOptions}
        tabBarOptions={tabBarOptions}
        headerMode={'none'}
        initialRouteName="MainHome"
        // initialRouteName="MainAccount"
    >
        <Nav.Screen
            name="MainHome"
            options={({navigation, route}) => ({
                title: t('tabs.home'),
                tabBarVisible: getTabBarVisible(navigation, route)
            })}
            component={HomeStack}
        />
        <Nav.Screen
            name="MainTravels"
            options={({navigation, route}) => ({
                title: t('tabs.jobs'),
                tabBarVisible: getTabBarVisible(navigation, route)
            })}
            component={TravelsStack}
        />
        <Nav.Screen
            name="MainAccount"
            options={({navigation, route}) => ({
                title: t('tabs.me'),
                tabBarVisible: getTabBarVisible(navigation, route)
            })}
            component={AccountStack}
        />
    </Nav.Navigator>;
};

const mapDispatchToProps = dispatch => {
    return {
        reloadCurrentOrder: () => dispatch(reloadCurrentOrderAction()),
    }
}

export default connect(null, mapDispatchToProps)(MainNavigator);
