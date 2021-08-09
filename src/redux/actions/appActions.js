import {
    APP_SET_ORDERS,
    APP_SET_CUSTOM_VALUES,
    APP_SET_CURRENT_ORDER,
    APP_UPDATE_CURRENT_ORDER,
    APP_LOCATION_SET_AVAILABLE,
    APP_LOCATION_SET_CURRENT,
    APP_LOAD_FAQS,
    APP_SET_FAQS,
    APP_ORDER_CHAT_SET_LIST,
    CURRENT_LANG
} from '../actionTypes';
import Api from '../../utils/api';

export const reloadCurrentOrder = () => (dispatch, getState) => {
    return Api.Driver.getJob()
        .then(data => {
            let {success, message, order} = data;
            if(success) {
                dispatch(setCurrentOrder(order || null))
            }
            else{
                // TODO: What to do
            //     console.error(data)
            }
        })
        // .cache(error => {
        //     console.log('on current order error')
        //     // console.log(error)
        // })
}

export const loadEarnings = () => (dispatch, getState) => {
    return Api.Driver.getEarnings()
        .then(({success, orders, customValues}) => {
            if(success) {
                orders && dispatch(setOrders(orders))
                customValues && dispatch(setCustomValues(customValues))
            }
            else{
                // TODO: What to do
            }
        })
        // .cache(error => {
            // console.log(error)
        // })
}

export const loadFaqs = () => (dispatch, getState) => {
    return Api.Driver.getFaqs()
        .then(({success, faqs, categories}) => {
            if(success) {
                !!faqs && !!categories && dispatch(setFaqs(faqs, categories))
            }
            else{
                // TODO: What to do
            }
        })
}

export const setFaqs = (faqs, categories) => ({
    type: APP_SET_FAQS,
    payload: {faqs, categories}
})

export const setOrderChatList = (chatList) => ({
    type: APP_ORDER_CHAT_SET_LIST,
    payload: chatList
})

export const updateCurrentOrder = update => ({
    type: APP_UPDATE_CURRENT_ORDER,
    payload: update
})

export const setCurrentOrder = order => ({
    type: APP_SET_CURRENT_ORDER,
    payload: order
})

export const setOrders = orders => ({
    type: APP_SET_ORDERS,
    payload: orders
})

export const setCustomValues = customValues => ({
    type: APP_SET_CUSTOM_VALUES,
    payload: customValues
})

export const setLocationAvailable = available => ({
    type: APP_LOCATION_SET_AVAILABLE,
    payload: available
})

export const setCurrentLocation = currentLocation => ({
    type: APP_LOCATION_SET_CURRENT,
    payload: currentLocation
})

export const setCurrentLang = lang => ({
    type: CURRENT_LANG,
    payload: lang
})
