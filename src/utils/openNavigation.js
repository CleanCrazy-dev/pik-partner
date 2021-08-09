import { Linking, Platform } from 'react-native'

const isValidLatLng = (num, range) => typeof num === 'number' && num <= range && num >= -1 * range

const isValidCoordinates = coords =>
    isValidLatLng(coords.latitude, 90) && isValidLatLng(coords.longitude, 180)

const getParams = (params = []) => {
    return params
        .map(({ key, value }) => {
            const encodedKey = encodeURIComponent(key)
            const encodedValue = encodeURIComponent(value)
            // return `${encodedKey}=${encodedValue}`
            return `${key}=${value}`
        })
        .join('&')
}

const getWaypoints = (waypoints = []) => {
    if (waypoints.length === 0) {
        return ''
    }

    const params = waypoints
        .map(value => `${value.latitude},${value.longitude}`)
        .join('|')

    return `&waypoints=${params}`
}

function openNavigation({ origin, destination, params = [], waypoints = [] } = {}, openMap) {
    console.log("+++++++++++++++++++++++++ ", openMap);
    if (origin && isValidCoordinates(origin)) {
        params.push({
            key: 'saddr',
            // key: 'origin',
            value: `${origin.latitude},${origin.longitude}`
        })
    }
    if (destination && isValidCoordinates(destination)) {
        params.push({
            key: 'daddr',
            // key: 'destination',
            value: `${destination.latitude},${destination.longitude}`
        })
    }

    let url = '';
    switch (openMap) {
        case 'Google':
            if (Platform.OS == 'android') url = `https://maps.google.pl/maps/dir/?api=1&${getParams(params)}${getWaypoints(waypoints)}`;
            else if (Platform.OS == 'ios') url = `comgooglemaps://?api=1&${getParams(params)}${getWaypoints(waypoints)}`;
            break;
        case 'Waze':
            url = `https://www.waze.com/live-map/directions?navigate=yes&to=${origin.latitude}%2C${origin.longitude}&from=${destination.latitude}%2C${destination.longitude}`;
            break;
        case 'Apple':
            url = `maps://app?${getParams(params)}${getWaypoints(waypoints)}`;
    }

    // let url = `https://www.google.com/maps/?${getParams(
    //     params
    // )}${getWaypoints(waypoints)}`
    // let url = `https://maps.google.pl/maps/dir/?api=1&travelmode=driving&dir_action=navigate&saddr=8.9868322,-79.5456677&daddr=9.0275691,-79.5358715`;
    // let url = `https://maps.google.pl/maps/dir/?api=1&${getParams(
    //     params
    // )}${getWaypoints(waypoints)}`

    console.log("map url = ", url);

    return Linking.canOpenURL(url).then(supported => {
        if (!supported) {
            return Promise.reject(new Error(`Could not open the url: ${url}`))
        } else {
            return Linking.openURL(url)
        }
    })
}

export default openNavigation
