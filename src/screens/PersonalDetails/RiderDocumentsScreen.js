import React, {useState, useEffect} from 'react';

import {
    StyleSheet,
    Alert,
    View,
    Text,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';

import HeaderPage from '../../components/HeaderPage';
import {
    BLUE, COLOR_TERTIARY_ERROR, DEVICE_ANDROID,
    GRAY_LIGHT,
} from '../../utils/constants';
import Button from '../../components/ButtonPrimary';
import PageContainerDark from '../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import DocumentUpload from '../../components/DocumentUpload';
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';
import {useAuth} from '../../utils/auth';
import {AVATAR_IMAGE_OPTIONS, chooseImage, takePhoto} from '../../utils/images';
import Api from '../../utils/api';
import globalStyles from '../../utils/globalStyles';
import {connect} from 'react-redux';
import {
    loadDocuments,
    setDocumentsAvatar,
    setDocumentsCarInsurance,
    setDocumentsVehicle,
    resetDocuments,
} from '../../redux/actions/documentsActions';
import DriverStatuses from '../../../../node-back/src/constants/DriverStatuses';
import AlertBootstrap from '../../components/AlertBootstrap';
import TextSingleLine from '../../components/TextSingleLine';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const TextError = ({children}) => {
    return <Text style={{marginTop: 5, color: COLOR_TERTIARY_ERROR, fontWeight: '400', fontSize: 12, lineHeight: 16}}>
        <FontAwesome5 name="exclamation-triangle" style={[styles.errorText]}/>
        <Text>  {children}</Text>
    </Text>;
};

const PersonalDetailsScreen = ({
   navigation,
   personalId,
   licence,
   avatar,
   carInsurance,
   vehicle,
   loadDriverDocuments,
   updateAvatar,
   updateCarInsurance,
   updateVehicle,
   clear,
}) => {
    const auth = useAuth();
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [inProgress, setInProgress] = useState(false);
    const [validationEnabled, setValidationEnabled] = useState(false);

    let avatarSheetRef = null, carInsuranceSheetRef = null;
    const ICON_SIZE = 30;
    const PHOTO_AVATAR = 'avatar';
    const PHOTO_CAR_INSURANCE = 'car-insurance';

    const handelUpdateAvatar = (avatar) => {
        Api.Driver.updateAvatar({
            avatar,
        })
            .then(({success, message}) => {
                if (success) {
                    return auth.reloadUserInfo();
                } else {
                    throw {message: message || 'Somethings went wrong'};
                }
            })

            .catch((error) => {
                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Somethings went wrong',
                );
            });
    };
    const getPhotoFromLibrary = async (type) => {
        let imageOptions = type === PHOTO_AVATAR ? AVATAR_IMAGE_OPTIONS : {}
        try {
            const photo = await chooseImage(imageOptions);
            if (type === PHOTO_AVATAR) {
                updateAvatar(photo);
            } else {
                updateCarInsurance(photo);
            }
        } catch (err) {
            console.log('error >> ', err);
        }
    };
    const getPhotoFromCamera = async (type) => {
        let imageOptions = type === PHOTO_AVATAR ? AVATAR_IMAGE_OPTIONS : {}
        try {
            const photo = await takePhoto(imageOptions);
            if (type === PHOTO_AVATAR) {
                updateAvatar(photo);
            } else {
                updateCarInsurance(photo);
            }
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const createFormData = (filterEmpty) => {
        const data = new FormData();

        function buildFormData(formData, data, parentKey) {
            if (data && typeof data === 'object' && !(data instanceof Date) && !(data instanceof File)) {
                Object.keys(data).forEach(key => {
                    buildFormData(formData, data[key], parentKey ? `${parentKey}[${key}]` : key);
                });
            } else {
                const value = data == null ? '' : data;
                if (!value && filterEmpty) {
                    return;
                }
                formData.append(parentKey, value);
            }
        }

        const body = {
            personalId: {
                type: personalId.type,
                id: personalId.id,
                // frontPhoto: undefined,
                // rearPhoto: undefined
            },
            licence: {
                expire: licence.expire,
                // frontPhoto: undefined
            },
            // avatar: undefined,
            // insurance: undefined,
            vehicle: {
                type: vehicle.type,
                makeModel: vehicle.makeModel,
                plate: vehicle.plate,
                year: vehicle.year,
                color: vehicle.color,
            },
        };

        buildFormData(data, body, '');

        personalId?.frontPhoto && data.append('idFront', {
            name: personalId.frontPhoto.fileName,
            type: personalId.frontPhoto.mime,
            uri: DEVICE_ANDROID ? personalId.frontPhoto.uri : personalId.frontPhoto.uri.replace('file://', ''),
        });
        personalId?.rearPhoto && data.append('idRear', {
            name: personalId.rearPhoto.fileName,
            type: personalId.rearPhoto.mime,
            uri: DEVICE_ANDROID ? personalId.rearPhoto.uri : personalId.rearPhoto.uri.replace('file://', ''),
        });
        licence.frontPhoto && data.append('licenceFront', {
            name: licence.frontPhoto.fileName,
            type: licence.frontPhoto.mime,
            uri: DEVICE_ANDROID ? licence.frontPhoto.uri : licence.frontPhoto.uri.replace('file://', ''),
        });
        avatar && data.append('avatar', {
            name: avatar.fileName,
            type: avatar.mime,
            uri: DEVICE_ANDROID ? avatar.uri : avatar.uri.replace('file://', ''),
        });
        carInsurance && data.append('insurance', {
            name: carInsurance.fileName,
            type: carInsurance.mime,
            uri: DEVICE_ANDROID ? carInsurance.uri : carInsurance.uri.replace('file://', ''),
        });
        !!vehicle.photos && vehicle.photos.map(photo => {
            data.append('photos', {
                name: photo.fileName,
                type: photo.mime,
                uri: DEVICE_ANDROID ? photo.uri : photo.uri.replace('file://', ''),
            });
        });
        vehicle.carNumberPhoto && data.append('carNumberPhoto', {
            name: vehicle.carNumberPhoto.fileName,
            type: vehicle.carNumberPhoto.mime,
            uri: DEVICE_ANDROID ? vehicle.carNumberPhoto.uri : vehicle.carNumberPhoto.uri.replace('file://', ''),
        });
        return data;
    };

    const sendDocumentForUpdate = () => {
        setError('');
        let formData = createFormData(true);
        if (formData._parts.length === 0) {
            setError('No data to update');
            return;
        }
        setInProgress(true);
        Api.Driver.updateDriverDocument(formData)
            .then(async response => {
                let {success, message, user} = response;
                if (success) {
                    // navigation.navigate('PersonalDetailSuccess')
                    await auth.reloadUserInfo();
                    // navigation.navigate('PersonalUploadSuccess')
                    clear();
                } else {
                    setError(message || 'Somethings went wrong');
                }
            })
            .catch(error => {
                setError(error.message || 'Somethings went wrong');
                console.error(JSON.stringify(error, null, 2), Date.now());
            })
            .then(() => {
                setInProgress(false);
            });
    };

    /**=================================*/
    const isPersonalIdIncomplete = () => {
        if (auth.user.personalId?.approved) {
            return;
        }
        let {type, id, frontPhoto, rearPhoto} = personalId;
        let {type: _type, id: _id, frontPhoto: _frontPhoto, rearPhoto: _rearPhoto} = auth.user.personalId || {};
        return (!type && !_type)
            || (!id && !_id)
            || (!frontPhoto && !_frontPhoto)
            || (!rearPhoto && !_rearPhoto);
    };
    const isLicenceIncomplete = () => {
        if (auth.user.drivingLicence?.approved) {
            return;
        }
        let {expire, frontPhoto} = licence;
        let {expire: _expire, frontPhoto: _frontPhoto} = auth.user.drivingLicence || {};
        return (!expire && !_expire) || (!frontPhoto && !_frontPhoto);
    };
    const isProfilePhotoIncomplete = () => {
        return !avatar && !auth.user.avatar;
    };
    const isInsuranceIncomplete = () => {
        if (auth.user.carInsurance?.approved) {
            return;
        }
        return !carInsurance && !auth.user.carInsurance?.document;
    };
    const isVehiclePhotosIncomplete = () => {
        if (auth.user.vehicle?.photos_approved) {
            return;
        }
        return vehicle.photos.length == 0 && auth?.user?.vehicle?.photos?.length == 0;
    };
    const isVehicleInfoIncomplete = () => {
        let {type, makeModel, plate, color, year,carNumberPhoto} = vehicle;
        let {type: _type, makeModel: _makeModel, plate: _plate, color: _color, year: _year,carNumberPhoto:_carNumberPhoto} = auth.user.vehicle || {};
        return (!type && !_type)
            || (!makeModel && !_makeModel)
            || (!plate && !_plate)
            || (!color && !_color)
            || (!carNumberPhoto && !_carNumberPhoto)
            || (!year && !_year);
    };
    /**=================================*/

    const sendDocuments = () => {
        if (
            isPersonalIdIncomplete()
            || isLicenceIncomplete()
            || isProfilePhotoIncomplete()
            || isLicenceIncomplete()
            || isVehiclePhotosIncomplete()
            || isVehicleInfoIncomplete()
        ) {
            setValidationEnabled(true);
            return;
        }
        // if(auth.user.status === DriverStatuses.DocumentsWaiting) {
        //     console.log('sending data for first time ...')
        //     sendDocumentForFirstTime();
        // }
        // else {
        //     console.log('sending data for update ...')
        sendDocumentForUpdate();
        // }
    };

    useEffect(() => {
        setError('');
        clear();
        // loadDriverDocuments();
    }, []);


    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await auth.reloadUserInfo();
        setRefreshing(false);
    }, []);

    const goToHome = () => {
        auth.logout()
    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark refreshing={refreshing} onRefresh={onRefresh}
               Header={
                   <HeaderPage
                       navigation={navigation}
                       title={auth.user.hired ? 'Update Vehicle' : 'Crea tu cuenta'}
                       color={HeaderPage.Colors.BLACK}
                       rightButtons={<SvgXml width={24} height={24} style={{marginRight: 10}} onPress={() => goToHome()} xml={svgs['icon-home-off']}/>}
                   />
               }
               footer={(
                   <View style={{padding: 16}}>
                       {!!error && (
                           <View style={globalStyles.inputWrapper}>
                               <AlertBootstrap
                                   type="danger"
                                   message={error}
                                   onClose={() => setError('')}
                               />
                           </View>
                       )}
                       <Button
                           title="Siguiente"
                           inProgress={inProgress}
                           disabled={inProgress}
                           onPress={inProgress ? null : sendDocuments}
                       />
                   </View>
               )}
            >
                <View style={{flexGrow: 1}}>
                    <Text style={styles.title}>Sube tus documentos</Text>

                    <View style={{height: 20}}/>

                    <View style={styles.inputWrapper}>
                        <DocumentUpload
                            // icon={<SvgUri width={ICON_SIZE} height={ICON_SIZE} source={require('../../assets/images/icon-id-card.svg')} />}
                            icon={<SvgXml width={ICON_SIZE} height={ICON_SIZE} xml={svgs['icon-id-card']}/>}
                            title="Cédula o Pasaporte"
                            onPress={e => navigation.navigate('PersonalDetailID')}
                            isRecheck={auth.user.status==='Recheck'}
                            approved={auth.user.personalId?.approved}
                            isEdited={
                                !isPersonalIdIncomplete()
                                && (
                                    !!personalId.type
                                    || !!personalId.id
                                    || !!personalId.frontPhoto
                                    || !!personalId.rearPhoto
                                )
                            }
                            disabled={auth.user.personalId?.approved}
                        />
                        {validationEnabled && isPersonalIdIncomplete() && <TextError>Datos faltantes. Por favor verifique.</TextError>}
                    </View>

                    <View style={styles.inputWrapper}>
                        <DocumentUpload
                            // icon={<SvgUri width={ICON_SIZE} height={ICON_SIZE} source={require('../../assets/images/icon-license.svg')} />}
                            icon={
                                <SvgXml
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    xml={svgs['icon-license']}
                                />
                            }
                            title="Licencia de conducir"
                            onPress={(e) => navigation.navigate('PersonalDetailLicence')}
                            isRecheck={auth.user.status==='Recheck'}
                            // approved={auth.user.drivingLicence?.approved}
                            approved={auth.user.drivingLicence?.approved}
                            isEdited={!isLicenceIncomplete() && (!!licence.expire || !!licence.frontPhoto)}
                            disabled={auth.user.drivingLicence?.approved}
                        />
                        {validationEnabled && isLicenceIncomplete() &&
                        <TextError>Datos faltantes. Por favor verifique.</TextError>}
                    </View>


                    <View style={styles.inputWrapper}>
                        <DocumentUpload
                            // icon={<SvgUri width={ICON_SIZE} height={ICON_SIZE} source={require('../../assets/images/icon-camera.svg')} />}
                            icon={
                                <SvgXml
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    xml={svgs['icon-camera']}
                                />
                            }
                            title="Foto de Perfil"
                            onPress={() => avatarSheetRef.show()}
                            isRecheck={auth.user.status==='Recheck'}
                            approved={!!auth.user.avatar}
                            isEdited={!!avatar}
                        />
                        {validationEnabled && isProfilePhotoIncomplete() &&
                        <TextError>Datos faltantes. Por favor verifique.</TextError>}
                        <ActionSheet
                            testID="PhotoActionSheet"
                            ref={(o) => {
                                avatarSheetRef = o;
                            }}
                            title="Seleccione una foto"
                            options={['Tomar una foto', 'Escoger de la galería', 'cancel']}
                            cancelButtonIndex={2}
                            onPress={(index) => {
                                if (index === 0) {
                                    getPhotoFromCamera(PHOTO_AVATAR);
                                } else if (index === 1) {
                                    getPhotoFromLibrary(PHOTO_AVATAR);
                                }
                            }}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <DocumentUpload
                            // icon={<SvgUri width={ICON_SIZE} height={ICON_SIZE} source={require('../../assets/images/icon-car-insurance.svg')} />}
                            icon={
                                <SvgXml
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    xml={svgs['icon-car-insurance']}
                                />
                            }
                            title="Seguro del vehículo"
                            onPress={() => carInsuranceSheetRef.show()}
                            isRecheck={auth.user.status==='Recheck'}
                            // approved={auth.user.carInsurance?.approved}
                            approved={auth.user.carInsurance?.approved}
                            isEdited={!!carInsurance}
                            disabled={auth.user.carInsurance?.approved}
                        />
                        {validationEnabled && isInsuranceIncomplete() &&
                        <TextError>Datos faltantes. Por favor verifique.</TextError>}
                        <ActionSheet
                            testID="PhotoActionSheet"
                            ref={(o) => {
                                carInsuranceSheetRef = o;
                            }}
                            title="Seguro del vehículo"
                            options={['Tomar una foto', 'Escoger de la galería', 'Cancelar']}
                            cancelButtonIndex={2}
                            onPress={(index) => {
                                if (index === 0) {
                                    getPhotoFromCamera(PHOTO_CAR_INSURANCE);
                                } else if (index === 1) {
                                    getPhotoFromLibrary(PHOTO_CAR_INSURANCE);
                                }
                            }}
                        />
                    </View>

                    <View style={styles.inputWrapper}>
                        <DocumentUpload
                            // icon={<SvgUri width={ICON_SIZE} height={ICON_SIZE} source={require('../../assets/images/icon-pictures.svg')} />}
                            icon={
                                <SvgXml
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    xml={svgs['icon-pictures']}
                                />
                            }
                            title="Fotos del vehículo"
                            onPress={() => navigation.navigate('PersonalDetailVehiclePhotos')}
                            isRecheck={auth.user.status==='Recheck'}
                            approved={auth.user.vehicle?.photos_approved}
                            // approved={auth.user.vehicle?.photos.length > 0}
                            isEdited={vehicle.photos.length > 0}
                        />
                        {validationEnabled && isVehiclePhotosIncomplete() &&
                        <TextError>Datos faltantes. Por favor verifique.</TextError>}
                    </View>

                    <View style={styles.inputWrapper}>
                        <DocumentUpload
                            // icon={<SvgUri width={ICON_SIZE} height={ICON_SIZE} source={require('../../assets/images/icon-document.svg')} />}
                            icon={
                                <SvgXml
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    xml={svgs['icon-document']}
                                />
                            }
                            title="Información del vehículo"
                            onPress={() => navigation.navigate('PersonalDetailVehicleInfo')}
                            isRecheck={auth.user.status==='Recheck'}
                            approved={auth.user.vehicle?.approved}
                            // approved={(
                            //     !!auth.user.vehicle?.type
                            //     && !!auth.user.vehicle?.makeModel
                            //     && !!auth.user.vehicle?.plate
                            //     && !!auth.user.vehicle?.year
                            //     && !!auth.user.vehicle?.color
                            // )}
                            isEdited={
                                !isVehicleInfoIncomplete()
                                && (
                                    !!vehicle.type
                                    || !!vehicle.makeModel
                                    || !!vehicle.plate
                                    || !!vehicle.year
                                    || !!vehicle.color
                                )
                            }
                        />
                        {validationEnabled && isVehicleInfoIncomplete() &&
                        <TextError>Datos faltantes. Por favor verifique.</TextError>}
                    </View>

                    {/*<Text>{JSON.stringify(avatar)}</Text>*/}
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 13,
        textAlign: 'center',
        color: GRAY_LIGHT,
    },
    inputWrapper: {
        marginBottom: 15,
    },
    link: {
        color: BLUE,
    },
});

const mapStateToProps = state => {
    const {documents: {personalId, licence, avatar, vehicle, carInsurance}} = state;
    return {personalId, licence, avatar, vehicle, carInsurance};
};

const mapDispatchToProps = dispatch => ({
    loadDriverDocuments: () => dispatch(loadDocuments()),
    updateAvatar: avatar => dispatch(setDocumentsAvatar(avatar)),
    updateCarInsurance: insurance => dispatch(setDocumentsCarInsurance(insurance)),
    updateVehicle: vehicleInfo => dispatch(setDocumentsVehicle(vehicleInfo)),
    clear: () => dispatch(resetDocuments()),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalDetailsScreen);
