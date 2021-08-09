import {
    APP_SET_CURRENT_ORDER,
    APP_SET_ORDERS,
    APP_SET_CUSTOM_VALUES,
    APP_UPDATE_CURRENT_ORDER,
    APP_LOCATION_SET_AVAILABLE,
    APP_LOCATION_SET_CURRENT,
    APP_SET_FAQS,
    APP_ORDER_CHAT_SET_LIST,
    CURRENT_LANG
} from '../actionTypes';

const initialState = {
    currentOrder: null,
    orders: [],
    orderChatList: [],
    customValues: [],
    location: {
        available: false,
        current: null,
    },
    faqs: [],
    faqCategories: [],
    
    current_lang: 'es'
};

export default function (state = initialState, action) {
    switch (action.type) {
        case APP_SET_CURRENT_ORDER: {
            return {
                ...state,
                currentOrder: action.payload,
            };
        }
        case APP_UPDATE_CURRENT_ORDER: {
            return {
                ...state,
                currentOrder: {
                    ...state.currentOrder,
                    ...action.payload,
                },
            };
        }
        case APP_SET_ORDERS: {
            return {
                ...state,
                orders: action.payload,
            };
        }
        case APP_SET_CUSTOM_VALUES: {
            return {
                ...state,
                customValues: action.payload,
            };
        }
        case APP_LOCATION_SET_AVAILABLE: {
            return {
                ...state,
                location: {
                    ...state.location,
                    available: action.payload,
                },
            };
        }
        case APP_LOCATION_SET_CURRENT: {
            return {
                ...state,
                location: {
                    ...state.location,
                    current: action.payload,
                },
            };
        }
        case APP_SET_FAQS: {
            return {
                ...state,
                faqs: action.payload.faqs,
                faqCategories: action.payload.categories,
            };
        }
        case APP_ORDER_CHAT_SET_LIST: {
            return {
                ...state,
                orderChatList: action.payload,
            };
        }
        case CURRENT_LANG: {
            return {
                ...state,
                current_lang: action.payload
            }
        }
        default:
            return state;
    }
}
