import {
    DRIVER_DOCUMENT_SET_ID,
    DRIVER_DOCUMENT_SET_LICENCE,
    DRIVER_DOCUMENT_SET_AVATAR,
    DRIVER_DOCUMENT_SET_VEHICLE, DRIVER_DOCUMENT_SET_CAR_INSURANCE, DRIVER_DOCUMENT_RESET,
} from '../actionTypes';
import _ from 'lodash';

const initialState = {
    personalId: {
        type: '',
        id: '',
        frontPhoto: null,
        rearPhoto: null,
    },
    licence: {
        expire: null,
        frontPhoto: null,
    },
    avatar: null,
    carInsurance: null,
    vehicle: {
        type: '',
        makeModel: '',
        plate: '',
        year: '',
        color: '',
        photos: [],
        description: '',
        carNumberPhoto:null,
    },
};

export default function (state = initialState, action) {
    switch (action.type) {
        case DRIVER_DOCUMENT_SET_ID: {
            const {type, id, frontPhoto, rearPhoto} = action.payload;
            return {
                ...state,
                personalId: {
                    ...state.personalId,
                    type, id, frontPhoto, rearPhoto,
                },
            };
        }
        case DRIVER_DOCUMENT_SET_LICENCE: {
            const {expire, frontPhoto} = action.payload;
            return {
                ...state,
                licence: {
                    ...state.licence,
                    expire, frontPhoto,
                },
            };
        }
        case DRIVER_DOCUMENT_SET_AVATAR: {
            const {avatar} = action.payload;
            return {
                ...state,
                avatar,
            };
        }
        case DRIVER_DOCUMENT_SET_CAR_INSURANCE: {
            const {carInsurance} = action.payload;
            return {
                ...state,
                carInsurance,
            };
        }
        case DRIVER_DOCUMENT_SET_VEHICLE: {
            const {type, makeModel, plate, year, color, photos, description,carNumberPhoto} = action.payload;
            let updates = _.pickBy({type, makeModel, plate, year, color, photos, description,carNumberPhoto}, _.identity);
            return {
                ...state,
                vehicle: {
                    ...state.vehicle,
                    ...updates,
                },
            };
        }
        case DRIVER_DOCUMENT_RESET: {
            return {...initialState}
        }
        default:
            return state;
    }
}
