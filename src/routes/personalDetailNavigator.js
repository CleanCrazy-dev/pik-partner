import React from 'react';
import {useNavigation} from '@react-navigation/native'
import {
    createStackNavigator,
    CardStyleInterpolators
} from '@react-navigation/stack';
import PersonalDetailScreen from '../screens/PersonalDetails/PersonalDetailScreen';
import PersonalIDScreen from '../screens/PersonalDetails/PersonalIDScreen';
import DrivingLicenceScreen from '../screens/PersonalDetails/DrivingLicenceScreen';
import VehicleInfoScreen from '../screens/PersonalDetails/VehicleInfoScreen';
import VehiclePhotosScreen from '../screens/PersonalDetails/VehiclePhotosScreen';
import RiderDocumentsScreen from '../screens/PersonalDetails/RiderDocumentsScreen';
import RegisterSuccessScreen from '../screens/PersonalDetails/RegisterSuccessScreen';
import DocumentAlertScreen from '../screens/PersonalDetails/DocumentAlertScreen';
import UploadSuccessScreen from '../screens/PersonalDetails/UploadSuccessScreen';
import {useAuth} from '../utils/auth';
import DriverStatuses from '../../../node-back/src/constants/DriverStatuses';
import {LeftToRightAnimation} from './animations';
import EventBus, {EVENT_DOCUMENTS_RECHECK, EVENT_DOCUMENTS_REJECT} from '../eventBus';

const Nav = createStackNavigator();

export default ({}) => {
    let navigation = useNavigation();
    const auth = useAuth();

    const needToGetPersonalInfo = () => {
        let {firstName, lastName, gender} = auth.user || {};
        return !firstName && !lastName && !gender;
    };

    const needToDisplayMessage = () => {
        let status = auth.user.status;
        let sList = [
            // DriverStatuses.Pending,
            DriverStatuses.InReview,
            DriverStatuses.Recheck,
            DriverStatuses.Rejected,
        ]
        return sList.includes(status);
    }

    const onDocumentRecheck = React.useCallback(() => {
        console.log('====== navigate to alert ... ============');
        auth.reloadUserInfo()
            .then(() => {
                navigation.navigate('PersonalDetailAlert')
            })
    }, [])

    const onDocumentReject = React.useCallback(() => {
        console.log('====== navigate to alert ... ============');
        auth.reloadUserInfo()
            .then(() => {
                navigation.navigate('PersonalDetailAlert')
            })
    }, [])

    React.useEffect(() => {
        EventBus.on(EVENT_DOCUMENTS_RECHECK, onDocumentRecheck)
        EventBus.on(EVENT_DOCUMENTS_REJECT, onDocumentReject)
        return () => {
            EventBus.removeListener(EVENT_DOCUMENTS_RECHECK, onDocumentRecheck)
            EventBus.removeListener(EVENT_DOCUMENTS_REJECT, onDocumentReject)
        }
    }, [])
    console.log('auth.user.documentSent++++++++++++++++++:',auth.user.documentSent)
    return <Nav.Navigator
        headerMode={'none'}
        initialRouteName="PersonalDetailHome"
        screenOptions={LeftToRightAnimation}
    >
        {needToGetPersonalInfo() && (
            <Nav.Screen name="PersonalDetailHome" component={PersonalDetailScreen}/>
        )}
        {needToDisplayMessage() && (
            <Nav.Screen name="PersonalDetailAlert" component={DocumentAlertScreen}/>
        )}
        {auth.user.documentSent ? (
            <Nav.Screen name="PersonalUploadSuccess" component={UploadSuccessScreen}/>
        ) : (
            <>
                <Nav.Screen name="PersonalDetailDocumentsScreen" component={RiderDocumentsScreen}/>
                <Nav.Screen name="PersonalDetailID" component={PersonalIDScreen}/>
                <Nav.Screen name="PersonalDetailLicence" component={DrivingLicenceScreen}/>
                <Nav.Screen name="PersonalDetailVehicleInfo" component={VehicleInfoScreen}/>
                <Nav.Screen name="PersonalDetailVehiclePhotos" component={VehiclePhotosScreen}/>
            </>
        )}
        <Nav.Screen name="PersonalDetailSuccess" component={RegisterSuccessScreen}/>
    </Nav.Navigator>;
};
