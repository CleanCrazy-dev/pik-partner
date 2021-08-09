import React from 'react';
import {
    createStackNavigator,
} from '@react-navigation/stack';

import TravelsListScreen from '../screens/Main/Travel/TravelsListScreen';
// import TravelHomeScreen from '../screens/Main/Travel/TravelsHomeScreen';
// import TravelsDetailScreen from '../screens/Main/Travel/TravelsDetailScreen';
import {LeftToRightAnimation} from './animations';

const Nav = createStackNavigator();

export default ({}) => {
    return <Nav.Navigator
        headerMode={'none'}
        // initialRouteName="MainTravelHome"
        initialRouteName="MainTravelList"
        screenOptions={LeftToRightAnimation}
    >
        {/*<Nav.Screen name="MainTravelHome" component={TravelHomeScreen}/>*/}
        <Nav.Screen name="MainTravelList" component={TravelsListScreen}/>
        {/*<Nav.Screen name="MainTravelDetail" component={TravelsDetailScreen}/>*/}
    </Nav.Navigator>;
};
