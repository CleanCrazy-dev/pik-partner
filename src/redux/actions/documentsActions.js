import {
    DRIVER_DOCUMENT_SET_ID,
    DRIVER_DOCUMENT_SET_LICENCE,
    DRIVER_DOCUMENT_SET_AVATAR,
    DRIVER_DOCUMENT_SET_VEHICLE,
    DRIVER_DOCUMENT_SET_CAR_INSURANCE,
    DRIVER_DOCUMENT_RESET,
} from '../actionTypes';
import Api from '../../utils/api';

export const loadDocuments = () => (dispatch, getState) => {
    Api.Driver.getDocuments()
        .then(({success, personalId, licence, avatar, vehicle, carInsurance}) => {
            if (success) {
                personalId && dispatch(setDocumentsPersonalId(personalId));
                licence && dispatch(setDocumentsLicence(licence));
                // avatar && dispatch(setDocumentsAvatar(avatar));
                vehicle && dispatch(setDocumentsVehicle(vehicle));
                carInsurance && dispatch(setDocumentsCarInsurance(carInsurance));
            }
        });
};

export const setDocumentsPersonalId = ({type, id, frontPhoto, rearPhoto}) => ({
    type: DRIVER_DOCUMENT_SET_ID,
    payload: {type, id, frontPhoto, rearPhoto},
});

export const setDocumentsLicence = ({expire, frontPhoto}) => ({
    type: DRIVER_DOCUMENT_SET_LICENCE,
    payload: {expire, frontPhoto},
});

export const setDocumentsAvatar = (avatar) => ({
    type: DRIVER_DOCUMENT_SET_AVATAR,
    payload: {avatar},
});

export const setDocumentsCarInsurance = (carInsurance) => ({
    type: DRIVER_DOCUMENT_SET_CAR_INSURANCE,
    payload: {carInsurance},
});

export const setDocumentsVehicle = ({type, makeModel, plate, year, color, photos,carNumberPhoto}) => ({
    type: DRIVER_DOCUMENT_SET_VEHICLE,
    payload: {type, makeModel, plate, year, color, photos,carNumberPhoto},
});

export const resetDocuments = () => ({
    type: DRIVER_DOCUMENT_RESET,
    payload: {},
});

