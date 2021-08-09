import React, { useRef, useState, useMemo } from 'react';
import {
    TouchableOpacity,
    StatusBar,
    StyleSheet,
    Image,
    View,
    Text,
    Alert
} from 'react-native';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_500,
    COLOR_PRIMARY_900, DEVICE_ANDROID,
    DEVICE_LARGE, INPUT_HEIGHT,
    WINDOW_HEIGHT,
    WINDOW_WIDTH,
} from '../../../utils/constants';
import OrderStatuses from '../../../../../node-back/src/constants/OrderStatuses.js';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import { RNCamera } from 'react-native-camera';
import BarcodeMask from 'react-native-barcode-mask';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../utils/svgs';
import ButtonPrimary from '../../../components/ButtonPrimary';
import ButtonSecondary from '../../../components/ButtonSecondary';
import CustomButton from '../../../components/CustomButton';
import HeaderPage from '../../../components/HeaderPage';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import globalStyles from '../../../utils/globalStyles';
import CustomTextInput from '../../../components/CustomTextInput';
import { chooseImage, takePhoto } from '../../../utils/images';
import DocumentUpload from '../../../components/DocumentUpload';
import ActionSheet from 'react-native-actionsheet';
import { obj2FormData } from '../../../utils/helpers';
import Api from '../../../utils/api'
import AlertBootstrap from '../../../components/AlertBootstrap';
import PageContainerLight from '../../../components/PageContainerLight';
import ProgressModal from '../../../components/ProgressModal';
import { useAuth } from '../../../utils/auth';

import { useTranslation } from 'react-i18next';
import { set } from 'lodash';

const NotAuthorizedView = () => (
    <View style={styles.cameraPreview}>
        <Text style={{ fontFamily: 'Poppins', fontWeight: '500', color: '#aaa' }}>
            Camera not Authorized
        </Text>
    </View>
);

const HomeCompleteDeliveryScreen = ({ navigation, route }) => {
    let { t } = useTranslation()

    let auth = useAuth();

    let { order, setOrder, isReturn } = route.params
    let [inProgress, setInProgress] = useState(false)
    let [error, setError] = useState('')
    let [fullName, setFullName] = useState('')
    let [photo, setPhoto] = useState(null)
    let photoRef = null;

    let cameraRef = useRef(null);
    const [qrData, setQrData] = useState(undefined);
    const handleBarCodeRead = ({ data }) => {
        setQrData(data);
    };

    const getPhotoFromLibrary = async (options = {}) => {
        try {
            const photo = await chooseImage(options);
            setPhoto(photo)
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const getPhotoFromCamera = async (options = {}) => {
        try {
            const photo = await takePhoto(options);
            setPhoto(photo)
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const barcodeSize = Math.min(WINDOW_WIDTH, WINDOW_HEIGHT);

    const renderBarcodeScanner = () => {
        return (

            <View style={{
                height: barcodeSize * 0.8,
                marginHorizontal: -16,
                overflow: 'hidden',
            }}>
                <RNCamera
                    ref={cameraRef}
                    captureAudio={false}
                    style={{
                        // flex: 1,
                        paddingTop: StatusBar.currentHeight,
                        width: '100%',
                        height: barcodeSize * 0.8,
                    }}
                    onBarCodeRead={handleBarCodeRead}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.off}
                    androidCameraPermissionOptions={{
                        title: t('pages.home.permission_camera'),
                        message: t('pages.home.need_permission_camera'),
                        buttonPositive: t('general.Ok'),
                        buttonNegative: t('general.cancel'),
                    }}
                    notAuthorizedView={<NotAuthorizedView />}
                >
                    <BarcodeMask
                        edgeColor={COLOR_PRIMARY_500}
                        animatedLineColor={COLOR_PRIMARY_500}
                        width={barcodeSize * 0.7}
                        height={barcodeSize * 0.4}
                        edgeRadius={5}
                        edgeBorderWidth={DEVICE_LARGE ? 3 : 2}
                        edgeHeight={DEVICE_LARGE ? 30 : 25}
                        edgeWidth={DEVICE_LARGE ? 30 : 25}
                    />
                    <View style={{ flex: 1 }}>
                        <HeaderPage color="transparent" title="" />
                        <View style={{ flexGrow: 1 }}>
                        </View>
                        <View style={{ paddingBottom: 16, paddingHorizontal: 16 }}>
                            <CustomButton
                                title={t('pages.home.add_manually')}
                                color={CustomButton.Colors.WHITE}
                                border
                                onPress={() => navigation.navigate('MainManualCode', { setCode: setQrData })}
                            />
                        </View>
                    </View>
                </RNCamera>
            </View>
        )
    }

    const renderReceiverData = () => {
        return (
            <View style={{ marginHorizontal: -16 }}>
                <View
                    style={{
                        // flex: 1,
                        paddingTop: StatusBar.currentHeight,
                        width: '100%',
                        backgroundColor: 'black',
                    }}
                >
                    <View style={{ flex: 1, paddingHorizontal: 16 }}>
                        <HeaderPage style={{ marginHorizontal: -16 }} color="transparent" title="" />
                        <View style={{ flexGrow: 1 }}>
                            <CustomAnimatedInput
                                style={{ backgroundColor: '#4E4B4B' }}
                                placeholderStyle={{}}
                                styleInput={{ color: 'white' }}
                                value={fullName}
                                placeholder="Enter full name of receiver"
                                onChangeText={setFullName}
                            />
                            <View style={globalStyles.inputWrapper}>
                                <Text style={{ color: 'white', marginTop: 32, marginBottom: 24 }}>Add Picture</Text>
                            </View>
                            <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', margin: -16 }}>
                                {photo && (
                                    <Image style={styles.imageItem} source={photo} />
                                )}
                                <TouchableOpacity style={styles.imageItem} onPress={() => photoRef.show()}>
                                    <SvgXml
                                        width={64}
                                        height={64}
                                        xml={svgs['icon-plus-square-transparent']}
                                    />
                                </TouchableOpacity>
                            </View>
                            <ActionSheet
                                testID="PhotoActionSheet"
                                ref={(o) => { photoRef = o }}
                                title={t('photo.select_photo')}
                                options={[t('photo.take_photo'), t('photo.choose_library'), t('photo.cancel')]}
                                cancelButtonIndex={2}
                                onPress={(index) => {
                                    if (index === 0) {
                                        getPhotoFromCamera({ width: 400, height: 600 });
                                    } else if (index === 1) {
                                        getPhotoFromLibrary({ width: 400, height: 600 });
                                    }
                                }}
                            />
                        </View>
                        <View style={{ paddingBottom: 16, paddingHorizontal: 16 }}>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    const createFormData = (filterEmpty) => {
        let formData = new FormData();
        const body = {
            order: order._id,
            confirmationCode: qrData,
            fullName
        };
        obj2FormData(formData, body, '')
        photo && formData.append("photo", {
            name: photo.fileName,
            type: photo.mime,
            uri: DEVICE_ANDROID ? photo.uri : photo.uri.replace("file://", "")
        });
        return formData;
    }

    const completeOrderReady = useMemo(() => {
        if (!order?.receiver)
            return false;
        if (isReturn || order.receiver.status === 'Registered') {
            return !!qrData
        }
        else {
            return !!fullName && !!photo
        }
    }, [order, qrData, fullName, photo])

    const completeOrder = () => {
        if (!completeOrderReady)
            return;
        setError('')
        setInProgress(true)
        Promise.resolve(true)
            .then(() => {
                if (isReturn) {
                    return Api.Driver.setReturnCompleted(order._id, qrData)
                }
                else {
                    let formData = createFormData(true);
                    return Api.Driver.setDeliveryCompleted(formData, isReturn)
                }
            })
            .then(({ success, order, message, errorCode }) => {
                if (success) {
                    setOrder(null)
                    if (
                        [OrderStatuses.Delivered, OrderStatuses.Canceled, OrderStatuses.Returned].includes(order?.status)
                        && order?.cancel?.canceler !== auth.user._id
                        ) {
                        navigation.replace("DeliverySuccess", { order })
                    }
                    // navigateToEarnings()
                }
                else {
                    setError(message || "Somethings went wrong")
                }
            })
            .catch(error => {
                setError(
                    error?.response?.data?.message ||
                    error?.message ||
                    'server side error',
                );
            })
            .then(() => {
                setInProgress(false)
            })
    }

    React.useEffect(() => {
        if ((isReturn || order.receiver.status === 'Registered') && !!qrData)
            completeOrder();
    }, [order, qrData])

    const navigateToEarnings = async () => {
        navigation.popToTop();
        await navigation.navigate('MyEarnings')
        // await navigation.navigate(
        //     "MainAccount",
        //     {
        //         screen: "",
        //     }
        // )
    }
    return (
        <KeyboardAvoidingScreen>
            <PageContainerLight
                contentStyle={styles.pageContainer}
                footer={(
                    <View style={{ padding: 16 }}>
                        {!!error && (
                            <View style={globalStyles.inputWrapper}>
                                <AlertBootstrap
                                    type="danger"
                                    message={error}
                                    onClose={() => setError('')}
                                />
                            </View>
                        )}
                        <ButtonPrimary
                            title={t('pages.home.complete_order')}
                            inProgress={inProgress}
                            disabled={!completeOrderReady || inProgress}
                            onPress={completeOrder}
                        />
                    </View>
                )}
            >
                <StatusBar translucent backgroundColor="transparent" />
                <View style={{ flexGrow: 1 }}>
                    {(isReturn || order.receiver.status === 'Registered') ? (
                        renderBarcodeScanner()
                    ) : (
                        renderReceiverData()
                    )}
                    <View style={{ height: 16 }} />
                    <View style={styles.dataWrapper}>
                        {/*<Text>{JSON.stringify(qrData)}</Text>*/}
                        <View style={{ flexGrow: 1 }}>
                            <Text style={styles.title1}>{t('pages.home.sender')}</Text>
                            <Text style={styles.title2}>{order?.sender?.name}</Text>
                            <Text style={styles.title3}>{order?.pickup?.address?.formatted_address}</Text>
                        </View>
                    </View>
                    <View style={styles.dataWrapper}>
                        <View style={{ flexGrow: 1 }}>
                            <Text style={styles.title1}>{t('pages.home.receiver')}</Text>
                            <Text style={styles.title2}>{order?.receiver?.name}</Text>
                            <Text style={styles.title3}>{order?.delivery?.address?.formatted_address}</Text>
                        </View>
                    </View>
                    <ProgressModal
                        title={t('pages.home.checking') + " ..."}
                        visible={inProgress}
                    />
                </View>
            </PageContainerLight>
        </KeyboardAvoidingScreen>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        marginTop: 0,
        paddingTop: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0
    },
    imageItem: {
        height: 64,
        width: 64,
        margin: 8,
    },
    container: {
        position: 'relative',
    },
    cameraPreview: {
        flex: 0,
        overflow: 'hidden',
        width: DEVICE_LARGE ? 280 : 230,
        height: DEVICE_LARGE ? 280 : 230,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dataWrapper: {
        marginBottom: 24,
    },
    dataContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title1: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    title2: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
        color: COLOR_PRIMARY_900,
    },
    title3: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        textAlign: 'left',
        color: COLOR_PRIMARY_900,
    },
    value: {
        fontWeight: '800',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_500,
        textAlign: 'right',
    },
})

export default HomeCompleteDeliveryScreen;