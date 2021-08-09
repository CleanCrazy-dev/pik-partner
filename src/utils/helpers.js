import {API_BASE_URL} from '@env';
import {Platform, Linking} from 'react-native'
import DeviceInfo from 'react-native-device-info';
export openNavigation from './openNavigation'


export const timeout = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const uploadUrl = path => {
    if(!!path) {
        if (path.substr(0, 4) === 'http')
            return path;
        else
            return `${API_BASE_URL}${path}`
    }
    else
        return path;
}

export const clearPhoneNumber = val => val.toString().replace(/(\ |-|\(|\)|-)/g, '')

export const  obj2FormData = (formData, data, parentKey) => {
    if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
        Object.keys(data).forEach(key => {
            obj2FormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
        });
    } else {
        const value = data == null ? '' : data;
        formData.append(parentKey, value);
    }
}

export const obj2QueryParams = (object) => {
    return Object.keys(object)
        .filter(key => !!object[key])
        .map(key => key + "=" + encodeURIComponent(object[key]))
        .join("&")
}

export const getDeviceInfo = () => {
    return {
        model: DeviceInfo.getModel(),
        deviceName: DeviceInfo.getDeviceNameSync(),
        systemName: DeviceInfo.getSystemName(),
        systemVersion: DeviceInfo.getSystemVersion(),
    }
}

export const callPhoneNumber = phoneNumber => Linking.openURL(`tel:${phoneNumber}`)

