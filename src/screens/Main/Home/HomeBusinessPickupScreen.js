import React, { useState, useRef, useEffect } from 'react';
import {
    StyleSheet,
    StatusBar,
    ScrollView,
    View,
    Text,
    Alert
} from 'react-native';
import {
    COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500,
    COLOR_PRIMARY_900, DEVICE_LARGE, DEVICE_SMALL, WINDOW_HEIGHT, WINDOW_WIDTH,
} from '../../../utils/constants';
import BarcodeMask from 'react-native-barcode-mask';
import ButtonPrimary from '../../../components/ButtonPrimary';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../utils/svgs';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import { RNCamera } from 'react-native-camera';
import CustomButton from '../../../components/CustomButton';
import Api from '../../../utils/api';
import globalStyles from '../../../utils/globalStyles';
import AlertBootstrap from '../../../components/AlertBootstrap';
import {
    updateCurrentOrder as updateCurrentOrderAction,
    setCurrentOrder as setCurrentOrderAction,
} from '../../../redux/actions/appActions';
import { connect } from 'react-redux';
import PageContainerLight from '../../../components/PageContainerLight';
import ProgressModal from '../../../components/ProgressModal';

import { useTranslation } from 'react-i18next';

const NotAuthorizedView = () => (
    <View style={styles.cameraPreview}>
        <Text style={{ fontFamily: 'Poppins', fontWeight: '500', color: '#aaa' }}>
            Camera not Authorized
        </Text>
    </View>
);

const HomeBusinessPickupScreen = ({ navigation, ...props }) => {
    let { t } = useTranslation()

    let cameraRef = useRef(null);
    let { order, setOrder, updateOrder } = props
    const [error, setError] = useState('')
    const [inProgress, setInProgress] = useState(false)
    const [code, setCode] = useState(null)
    const [enableScan, setEnableScan] = useState(true);
    const onTrackingCodeReceive = React.useCallback((code) => {
        setInProgress(true);
        let newOrder = null;
        Api.Driver.postTrackingCode(order._id, code)
            .then(({ success, message, order }) => {
                newOrder = order
                if (success) {
                    const trackingCodes = props.order.packages.map(item => item.trackingCode)
                    if (trackingCodes && trackingCodes.length !== 0) {
                        const currentCodeIndex = trackingCodes.findIndex(item => item === code)
                        if (!props.order.packages[currentCodeIndex].trackingConfirmation) {
                            Alert.alert(
                                '',
                                `El código fue escaneado correctamente.`,
                                [
                                    {
                                        text: 'Aceptar',
                                        onPress: () => {
                                            setEnableScan(true)
                                        },
                                    },
                                ],
                            );
                        } else {
                            Alert.alert(
                                '',
                                `Este código ya fue escaneado.`,
                                [
                                    {
                                        text: 'Aceptar',
                                        onPress: () => {
                                            setEnableScan(true)
                                        },
                                    },
                                ],
                            );
                        }
                    }
                    updateOrder({ packages: newOrder.packages })
                    let isCompleted = newOrder.packages.findIndex(p => !p.trackingConfirmation) < 0
                    if (isCompleted)
                        return completePickup()
                }
                else {
                    Alert.alert(
                        '',
                        `El código escaneado no está relaciónado a la orden.`,
                        [
                            {
                                text: 'Aceptar',
                                onPress: () => {
                                    setEnableScan(true)
                                },
                            },
                        ],
                    );
                    setError(message || "Some things went wong")
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
    }, [order])

    const completedPackages = React.useMemo(() => {
        if (!order)
            return 0
        return order.packages.filter(p => !!p.trackingConfirmation).length;
    }, [order])

    const handleBarCodeRead = ({ data }) => {
        setEnableScan(false)
        if (data) {
            setCode(data)
            onTrackingCodeReceive(data);
        } else {
        }
    };

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
                    onBarCodeRead={enableScan?handleBarCodeRead:null}
                    barCodeTypes={[RNCamera.Constants.BarCodeType.code128]}
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
                                onPress={() => navigation.navigate('MainManualCode', { setCode: onTrackingCodeReceive })}
                            />
                        </View>
                    </View>
                </RNCamera>
            </View>
        )
    }

    const completePickup = () => {
        // if(!completed)
        //     return;
        setInProgress(true)
        return Api.Driver.setPickupComplete(order._id)
            .then(({ success, order, message, errorCode }) => {
                if (success) {
                    setOrder(order)
                    navigation.pop();
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
            .then(() => setInProgress(false))
    }

    const barcodeSize = Math.min(WINDOW_WIDTH, WINDOW_HEIGHT);
    return (
        <KeyboardAvoidingScreen>
            <PageContainerLight
                contentStyle={{
                    paddingVertical: 0,
                }}
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
                        {/*<ButtonPrimary*/}
                        {/*    disabled={!completed || inProgress}*/}
                        {/*    title="Done"*/}
                        {/*    onPress={completePickup}*/}
                        {/*    inProgress={inProgress}*/}
                        {/*/>*/}
                    </View>
                )}
            >
                <StatusBar translucent backgroundColor="transparent" />
                {renderBarcodeScanner()}
                <View style={styles.dataWrapper}>
                    {/*<Text>{JSON.stringify(trackingCodes)}</Text>*/}
                    <View style={styles.dataContainer}>
                        <View style={{ flexGrow: 1 }}>
                            <Text style={styles.title2}>{order.receiver.name}</Text>
                            <Text style={styles.title3}>{t('pages.home.order_id')}: {order.id}</Text>
                        </View>
                        <View>
                            <Text style={[styles.title1, { color: COLOR_PRIMARY_900 }]}>{completedPackages}/{order?.packages.length}</Text>
                        </View>
                    </View>
                </View>
                {order.packages.map((p, index) => (
                    <View key={index} style={styles.dataWrapper}>
                        <View style={styles.dataContainer}>
                            <View style={{ paddingRight: 16 }}>
                                <SvgXml width={22} xml={svgs['icon-package-closed']} />
                            </View>
                            <View style={{ flexGrow: 1 }}>
                                <Text style={styles.title2}>{t('pages.home.tracking_no')}</Text>
                                {!!p.trackingConfirmation ? (
                                    <Text style={styles.title3}>{p.trackingCode}</Text>
                                ) : (
                                    <Text style={styles.title3}>---------</Text>
                                )}
                            </View>
                            <View>
                                {!!p.trackingConfirmation ? (
                                    <SvgXml width={22} xml={svgs['icon-checkbox-checked']} />
                                ) : (
                                    <SvgXml width={22} xml={svgs['icon-checkbox-unchecked']} />
                                )}
                            </View>
                        </View>
                    </View>
                ))}
                <ProgressModal
                    title={t('pages.home.checking_tracking_code') + " ..."}
                    visible={inProgress}
                />
            </PageContainerLight>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
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
        color: COLOR_PRIMARY_900,
    },
    title3: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_PRIMARY_900,
    },
    value: {
        fontWeight: '800',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_500,
        textAlign: 'right',
    },
});

const mapStateToProps = state => {
    return {
        order: state.app.currentOrder
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setOrder: order => dispatch(setCurrentOrderAction(order)),
        updateOrder: update => dispatch(updateCurrentOrderAction(update)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeBusinessPickupScreen);