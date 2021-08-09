import React from 'react';
import {
    createStackNavigator,
} from '@react-navigation/stack';

import HomeMainScreen from '../screens/Main/Home/HomeMainScreen';
import HomeBusinessPickupScreen from '../screens/Main/Home/HomeBusinessPickupScreen';
import HomeCompleteDeliveryScreen from '../screens/Main/Home/HomeCompleteDeliveryScreen';
import HomeManualCodeScreen from '../screens/Main/Home/HomeManualCodeScreen';
import HomeOrderChatScreen from '../screens/Main/Home/HomeOrderChat';
import EarningsScreen from '../screens/Main/Account/EarningsScreen';
import EarningsDetailScreen from '../screens/Main/Account/EarningsDetailScreen';
// import HomeTestScreen from '../screens/Main/Home/HomeTestScreen';
import DeliverySuccessScreen from '../screens/Main/Home/DeliverySuccessScreen';
import {LeftToRightAnimation} from './animations';

const Nav = createStackNavigator();

export default ({}) => {
    return <Nav.Navigator
        headerMode={'none'}
        initialRouteName="MainHomeMain"
        // initialRouteName="DeliverySuccess"
        screenOptions={LeftToRightAnimation}
    >
        <Nav.Screen name="MainHomeMain" component={HomeMainScreen}/>
        <Nav.Screen name="MainHomePickup" component={HomeBusinessPickupScreen}/>
        <Nav.Screen name="MainCompleteDelivery" component={HomeCompleteDeliveryScreen}/>
        <Nav.Screen name="MainManualCode" component={HomeManualCodeScreen}/>
        <Nav.Screen name="MainOrderChat" component={HomeOrderChatScreen}/>
        <Nav.Screen name="MyEarnings" component={EarningsScreen}/>
        <Nav.Screen name="MyEarningsDetail" component={EarningsDetailScreen}/>
        {/* <Nav.Screen name="HomeTest" component={HomeTestScreen}/> */}
        <Nav.Screen name="DeliverySuccess" component={DeliverySuccessScreen}/>
    </Nav.Navigator>;
};
