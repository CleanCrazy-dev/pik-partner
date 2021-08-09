import React, {useState, useMemo} from 'react';
import _ from 'lodash';
import {
    StyleSheet,
    TouchableOpacity,
    Alert,
    View,
    Text, Image,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import globalStyles from '../../../utils/styles';
import {useAuth} from '../../../utils/auth';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import {COLOR_PRIMARY_500, DEVICE_ANDROID, VehicleTypes} from '../../../utils/constants';
import CustomPicker from '../../../components/CustomPicker';
import ButtonPrimary from '../../../components/ButtonPrimary';
import Api from '../../../utils/api';
import {SvgXml} from 'react-native-svg';
import svgs from '../../../utils/svgs';
import {chooseImage, takePhoto} from '../../../utils/images';
import ActionSheet from 'react-native-actionsheet';
import BoxShadow from '../../../components/BoxShadow';
import {obj2FormData, uploadUrl} from '../../../utils/helpers';
import AlertBootstrap from '../../../components/AlertBootstrap';

import {useTranslation} from 'react-i18next';

const ProfileScreen = ({navigation}) => {
    let {t} = useTranslation()

    const auth = useAuth();
    const {vehicle} = auth.user;
    const [inProgress, setInProgress] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')

    const [type, setType] = useState(vehicle.type);
    const [plate, setPlate] = useState(vehicle.plate);
    const [color, setColor] = useState(vehicle.color);
    const [makeModel, setMakeModel] = useState(vehicle.makeModel);
    const [year, setYear] = useState(vehicle?.year?.toString());
    const [photos, setPhotos] = useState([])
    const [deletePhotos, setDeletePhotos] = useState([])
    const [insurance, setInsurance] = useState(null)
    const [licence, setLicence] = useState(null)

    let photoSheetRef, insuranceSheetRef, licenceSheetRef;

    const imageOptions = {
        // width: 600,
        // height: 600,
        // cropping: true,
        // useFrontCamera: false,
        multiple: true,
        maxFiles: 5,
        minFiles: 1,
        hideBottomControls: true,
    };

    const onPhotoSelect = (type, newPhotos) => {
        switch (type) {
            case 'vehicle':
                setPhotos([...photos, ...newPhotos]);
                break;
            case 'insurance':
                setInsurance(newPhotos[0]);
                break;
            case 'licence':
                setLicence(newPhotos[0]);
                break;
        }
    }

    const getPhotoFromLibrary = async (type) => {
        try {
            const newPhotos = await chooseImage(imageOptions);
            onPhotoSelect(type, newPhotos)
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const getPhotoFromCamera = async (type) => {
        try {
            const newPhotos = await takePhoto(imageOptions);
            onPhotoSelect(type, newPhotos)
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const deleteLocal = (index) => {
        let newList = [...photos]
        newList.splice(index, 1)
        setPhotos(newList);
    }

    const deleteFromServer = (url) => {
        setDeletePhotos([...deletePhotos, url])
    }

    const createFormData = () => {
        let formData = new FormData();
        let update = {type,plate,color,makeModel,year}
        const body = _.pickBy(update, (val, key) => (!!val && val != vehicle[key]));
        if(deletePhotos.length > 0)
            body.deletePhotos = deletePhotos;

        obj2FormData(formData, body, '')

        !!photos && photos.map(photo => {
            formData.append('photos', {
                name: photo.fileName,
                type: photo.mime,
                uri: DEVICE_ANDROID ? photo.uri : photo.uri.replace('file://', ''),
            });
        });
        if(!!insurance){
            formData.append('insurance', {
                name: insurance.fileName,
                type: insurance.mime,
                uri: DEVICE_ANDROID ? insurance.uri : insurance.uri.replace('file://', ''),
            });
        }
        return formData;
    }

    const updateServer = () => {
        let formData = createFormData()
        setInProgress(true);
        Api.Driver.updateVehicleInfo(formData)
            .then(({success, message}) => {
                if(success) {
                    return auth.reloadUserInfo();
                }
                else{
                    throw {message: (message || "Somethings went wrong")}
                }
            })
            .then(() => {
                navigation.goBack()
            })
            .catch(error => {
                setMessageType('danger')
                setMessage(
                    error?.response?.data?.message ||
                    error?.message ||
                    'server side error',
                );
            })
            .then(() => {
                setInProgress(false);
            })
    }

    const vehicleItems = useMemo(() => {
        let items = [];
        if(VehicleTypes != null) {
            Object.values(VehicleTypes).map((item) => {
                items.push({
                    title: t('pages.vehicle.' + item),
                    value: item
                })
            })
        }

        return items;
    }, [VehicleTypes])

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={t('pages.vehicle.header')}
                    color={HeaderPage.Colors.BLACK}
                />}
                footer={<View style={{padding: 16}}>
                    {!!message && (
                        <View style={globalStyles.inputWrapper}>
                            <AlertBootstrap
                                type={messageType}
                                message={message}
                                onClose={() => {
                                    setMessage('')
                                    setMessageType('')
                                }}
                            />
                        </View>
                    )}
                    <ButtonPrimary
                        onPress={() => updateServer()}
                        title={t('pages.vehicle.complete_request')}
                        inProgress={inProgress}
                        disabled={inProgress}
                    />
                </View>}
            >
                <Text style={styles.title}>{t('pages.vehicle.enter_detail_vehicle')}</Text>
                <View style={styles.inputWrapper}>
                    <CustomPicker
                        selectedValue={type}
                        onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                        items={vehicleItems}
                        placeholder={t('pages.vehicle.type')}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={plate}
                        onChangeText={setPlate}
                        placeholder={t('pages.vehicle.plate_id')}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={color}
                        onChangeText={setColor}
                        placeholder={t('pages.vehicle.color')}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={makeModel}
                        onChangeText={setMakeModel}
                        placeholder={t('pages.vehicle.make_model')}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={year}
                        onChangeText={setYear}
                        placeholder={t('pages.vehicle.year')}
                    />
                </View>
                <Text style={styles.h1}>{t('pages.vehicle.image')}</Text>
                <View style={{flexDirection: 'row', marginHorizontal: -8}}>
                    {!!auth.user.vehicle?.photos && (
                        (auth?.user?.vehicle?.photos || []).map((photo, index) => deletePhotos.includes(photo) ? null : (
                                <BoxShadow key={index}>
                                    <View style={styles.imageContainer}>
                                        <Image style={styles.image} source={{uri: uploadUrl(photo)}}/>
                                        <Text onPress={() => deleteFromServer(photo)} style={styles.removeBtn}>{t('pages.vehicle.remove')}</Text>
                                    </View>
                                </BoxShadow>
                            )
                        ))}
                    {photos.map((p, index) => (
                        <BoxShadow>
                            <View style={styles.imageContainer}>
                                <Image style={styles.image} source={{uri: p.uri}}/>
                                <Text onPress={() => deleteLocal(index)} style={styles.removeBtn}>{t('pages.vehicle.remove')}</Text>
                            </View>
                        </BoxShadow>
                    ))}
                    <TouchableOpacity onPress={() => photoSheetRef.show()}>
                        <SvgXml style={[styles.uploadBtn, {margin: 8}]} xml={svgs['icon-plus-square-transparent']}/>
                    </TouchableOpacity>
                </View>
                <ActionSheet
                    testID="PhotoActionSheet"
                    ref={(o) => {
                        photoSheetRef = o;
                    }}
                    title={t('photo.select_photo')}
                    options={[t('photo.take_photo'), t('photo.choose_library'), t('photo.cancel')]}
                    cancelButtonIndex={2}
                    onPress={(index) => {
                        if (index === 0) {
                            getPhotoFromCamera('vehicle');
                        } else if (index === 1) {
                            getPhotoFromLibrary('vehicle');
                        }
                    }}
                />

                <Text style={styles.h1}>{t('pages.vehicle.insurance')}</Text>
                <TouchableOpacity onPress={() => insuranceSheetRef.show()}>
                    {!!insurance ? (
                        <BoxShadow>
                            <Image
                                style={[styles.uploadBtn]}
                                source={{uri: insurance.uri}}
                            />
                        </BoxShadow>
                    ) : (
                        <SvgXml style={styles.uploadBtn} xml={svgs['icon-plus-square-transparent']}/>
                    )}
                </TouchableOpacity>
                <Text>Una vez seleccionado el botón de “Enviar la información” no podrá recibir viajes hasta que el cambio sea aprobado.</Text>
                <ActionSheet
                    testID="PhotoActionSheet"
                    ref={(o) => {
                        insuranceSheetRef = o;
                    }}
                    title={t('photo.select_photo')}
                    options={[t('photo.take_photo'), t('photo.choose_library'), t('photo.cancel')]}
                    cancelButtonIndex={2}
                    onPress={(index) => {
                        if (index === 0) {
                            getPhotoFromCamera('insurance');
                        } else if (index === 1) {
                            getPhotoFromLibrary('insurance');
                        }
                    }}
                />

                {/*<Text style={styles.h1}>Vehicle Operation Certificate</Text>*/}
                {/*<SvgXml style={styles.uploadBtn} xml={svgs['icon-plus-square-transparent']}/>*/}
                {/*<ActionSheet*/}
                {/*    testID="PhotoActionSheet"*/}
                {/*    ref={(o) => {*/}
                {/*        licenceSheetRef = o;*/}
                {/*    }}*/}
                {/*    title="Select Driving Licence"*/}
                {/*    options={['Take Photo', 'Choose From Library', 'cancel']}*/}
                {/*    cancelButtonIndex={2}*/}
                {/*    onPress={(index) => {*/}
                {/*        if (index === 0) {*/}
                {/*            getPhotoFromCamera('licence');*/}
                {/*        } else if (index === 1) {*/}
                {/*            getPhotoFromLibrary('licence');*/}
                {/*        }*/}
                {/*    }}*/}
                {/*/>*/}

            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {},
    h1: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
    },
    title:{
        textAlign: 'center',
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        marginVertical: 16,
    },
    inputWrapper: {
        marginBottom: 15,
    },
    uploadBtn: {
        width: 80,
        height: 80,
        marginVertical: 20,
    },
    imageContainer:{
        borderRadius: 5,
        overflow: 'hidden',
        margin: 8,
        marginVertical: 20,
    },
    image: {
        width: 64,
        height: 64,
        borderWidth: 1,
        backgroundColor: "#999",
    },
    removeBtn:{
        backgroundColor: COLOR_PRIMARY_500 + "aa",
        color: 'white',
        position: 'absolute',
        left: 5,
        right: 5,
        bottom: 5,
        lineHeight: 24,
        textAlign: 'center',
        borderRadius: 5
    },
});

export default ProfileScreen;
