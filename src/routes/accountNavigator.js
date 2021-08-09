import React from 'react';
import {
    createStackNavigator,
} from '@react-navigation/stack';

import AccountHomeScreen from '../screens/Main/Account/AccountHomeScreen';
import ProfileEditScreen from '../screens/Main/Account/ProfileEditScreen';
import SupportCenterScreen from '../screens/Main/Account/SupportCenterScreen';
import SupportCenterFaqScreen from '../screens/Main/Account/SupportCenterFaqScreen';
import ContactUsScreen from '../screens/Main/Account/ContactUsScreen';
import VehicleInformationScreen from '../screens/Main/Account/VehicleInformationScreen';
import VehicleEditScreen from '../screens/Main/Account/VehicleEditScreen';
import VehicleEditSuccessScreen from '../screens/Main/Account/VehicleEditSuccessScreen';
import EarningsScreen from '../screens/Main/Account/EarningsScreen';
import EarningsDetailScreen from '../screens/Main/Account/EarningsDetailScreen';
import BankAccountScreen from '../screens/Main/Account/BankAccountScreen';
import TermsAndConditionsScreen from '../screens/Auth/TermsAndConditionsScreen';
import ConfirmMobileScreen from '../screens/Auth/ConfirmMobileScreen';
import TravelsListScreen from '../screens/Main/Travel/TravelsListScreen';
import {LeftToRightAnimation} from './animations';

const Nav = createStackNavigator();

export default ({}) => {
    return <Nav.Navigator
        headerMode={'none'}
        initialRouteName="MainAccountHome"
        screenOptions={LeftToRightAnimation}
    >
        <Nav.Screen name="MainAccountHome" component={AccountHomeScreen}/>
        <Nav.Screen name="MainProfileEdit" component={ProfileEditScreen}/>
        <Nav.Screen name="MainSupportCenter" component={SupportCenterScreen}/>
        <Nav.Screen name="MainSupportCenterCategory" component={SupportCenterScreen}/>
        <Nav.Screen name="MainSupportCenterFaq" component={SupportCenterFaqScreen}/>
        <Nav.Screen name="ContactUs" component={ContactUsScreen}/>
        <Nav.Screen name="MainVehicleInformation" component={VehicleInformationScreen}/>
        <Nav.Screen name="MainVehicleEdit" component={VehicleEditScreen}/>
        <Nav.Screen name="MainVehicleEditSuccess" component={VehicleEditSuccessScreen}/>
        <Nav.Screen name="MyEarnings" component={EarningsScreen}/>
        <Nav.Screen name="MyEarningsDetail" component={EarningsDetailScreen}/>
        <Nav.Screen name="MainBankAccount" component={BankAccountScreen}/>
        <Nav.Screen name="TermsAndConditions" component={TermsAndConditionsScreen}/>
        <Nav.Screen name="AccountConfirmMobile" component={ConfirmMobileScreen}/>
        <Nav.Screen name="AccountSelectOrder" component={TravelsListScreen}/>
    </Nav.Navigator>;
};
