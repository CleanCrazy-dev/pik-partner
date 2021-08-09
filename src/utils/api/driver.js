import axios from '../axios';

export function getDocuments() {
    return axios.get(`/driver/documents?t=${Date.now()}`)
        .then(({data}) => data);
}

export function updateDriverDocument(formData) {
    return axios({
        method: 'put',
        url: '/driver/documents',
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function updateProfile(updates) {
    return axios.put('/driver/profile', updates)
        .then(({data}) => {
            return data;
        });
}

export function updateVehicleInfo(formData) {
    return axios({
        method: 'put',
        url: `/driver/vehicle`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function updatePersonalInfo(details) {
    return axios.put('/driver/personal-detail', details).then(({data}) => {
        return data;
    });
}

export function updatePersonalId(details) {
    return axios.put('/driver/personal-id', details).then(({data}) => {
        return data;
    });
}

export function updateDrivingLicence(details) {
    return axios.put('/driver/driving-licence', details).then(({data}) => {
        return data;
    });
}

export function updateStatus(isOnline) {
    return axios
        .put('/driver/status', {status: isOnline ? 'online' : 'offline'})
        .then(({data}) => {
            return data;
        });
}

export function getOrderById(orderId) {
    return axios
        .post('/driver/getOrderById', {order: orderId})
        .then(({data}) => {
            return data;
        });
}

export function getJob() {
    return axios
        .get(`/driver/job?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function getSuggestTimeInfo(orderId) {
    return axios
        .get(`/driver/suggest-time-info/${orderId}?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export const updateAvatar = (avatar) => {
    return axios.put('/driver/avatar', avatar).then(({data}) => {
        return data;
    });
};

export const deleteVehiclePhoto = (photo) => {
    return axios.post('/driver/delete-vehicle-photo', {photo})
        .then(({data}) => {
            return data;
        });
};

export function assignDriver(orderId) {
    return axios.post('/driver/assign', {order: orderId})
        .then(({data}) => {
            return data;
        });
}

export function getOrderDirection(type, orderId, currentLocation) {
    let {coords: {latitude, longitude}} = currentLocation
    return axios.get(`/driver/order-direction/${orderId}?type=${type}&location=${latitude},${longitude}&t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function putOrderTrack(orderId, data) {
    return axios.put(`/driver/order-track/${orderId}`, data)
        .then(({data}) => {
            return data;
        });
}

export function setPickupArrived(orderId) {
    return axios.post('/driver/pickup-arrive', {order: orderId})
        .then(({data}) => {
            return data;
        });
}

export function postTrackingCode(orderId, trackingCode) {
    return axios.post('/driver/tracking-code', {order: orderId, trackingCode})
        .then(({data}) => {
            return data;
        });
}

export function setPickupComplete(orderId) {
    return axios.post('/driver/pickup-complete', {order: orderId})
        .then(({data}) => {
            return data;
        });
}

export function setDeliveryArrived(orderId) {
    return axios.post('/driver/deliver-arrive', {order: orderId})
        .then(({data}) => {
            return data;
        });
}

export function setDeliveryCompleted(formData) {
    return axios({
        method: 'post',
        url: `/driver/delivery-complete`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function setReturnCompleted(order, confirmationCode) {
    return axios.post(`/driver/return-complete`,{order, confirmationCode})
        .then(({data}) => {
            return data;
        });
}

export function cancelOrder(orderId, customerNoShow, cancelingReason) {
    return axios.post('/driver/cancel', {order: orderId, customerNoShow, cancelingReason})
        .then(({data}) => {
            return data;
        });
}

export function ignoreSuggest(orderId) {
    return axios.post('/driver/ignore-suggest', {order: orderId})
        .then(({data}) => {
            return data;
        });
}

export function getEarnings() {
    return axios
        .get(`/driver/earnings?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function updateLocation(location) {
    return axios
        .put(`/driver/location`, {location})
        .then(({data}) => {
            return data;
        });
}

export function registerDevice(deviceInfo) {
    return axios
        .post(`/driver/device-info/`, deviceInfo)
        .then(({data}) => {
            return data;
        });
}

export function postOrderChat(orderId, formData) {
    return axios({
        method: 'post',
        url: `/driver/order-chat/${orderId}`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function postOrderChatRead(orderId, customerId) {
    return axios.post(`/driver/order-chat-read/${orderId}`, {customer: customerId})
        .then(({data}) => {
            return data;
        });
}

export function getBankAccount() {
    return axios.get(`/driver/bank-account?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function postBankAccount(accountName, accountNumber, accountType, accountBank) {
    return axios.post(`/driver/bank-account`, {accountName, accountNumber,accountType, accountBank})
        .then(({data}) => {
            return data;
        });
}

export function getFaqs() {
    return axios.get(`/driver/faqs?t=${Date.now()}`)
        .then(({data}) => {
            return data;
        });
}

export function postContactUs(formData) {
    return axios({
        method: 'post',
        url: `/driver/contact-us`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}

export function postSupportTicket(formData) {
    return axios({
        method: 'post',
        url: `/driver/support-ticket`,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    })
        .then(({data}) => {
            return data;
        });
}
