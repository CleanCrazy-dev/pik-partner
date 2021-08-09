import Geolocation from '@react-native-community/geolocation'
import {PermissionsAndroid} from 'react-native'

const requestGeoLocationPermission = async () => {
    try {
        const granted = await PermissionsAndroid.request(
            'android.permission.ACCESS_FINE_LOCATION',
            {
                title: 'Cool Photo App Camera Permission',
                message:
                    'Cool Photo App needs access to your camera ' +
                    'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the camera');
        } else {
            console.log('Camera permission denied');
        }
    } catch (err) {
        console.log('dfdfdf:',err)
        console.warn(err);
    }
};
const requestPermission = async () => {
    // if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     console.log('You can use the location');
    // } else {
    //     console.log(`Location permission denied: [${granted}]`);
    //     throw {message: 'Location permission denied'};
    // }
};

export default (options) => {
    let defaultOptions = {
        timeout: 100,
    };

    requestPermission();
    // requestGeoLocationPermission()

    return new Promise(function (resolve, reject) {
        Geolocation.getCurrentPosition(resolve, reject, {...defaultOptions, ...options});
    });
}
