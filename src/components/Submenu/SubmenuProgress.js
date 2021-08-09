import React, {useState, useMemo} from 'react';
import {useRoute, useNavigation} from '@react-navigation/native';
import moment from 'moment'
import PropTypes from 'prop-types';
import {StyleSheet, TouchableOpacity, Alert, Image, Text, View} from 'react-native';
import ProgressBarGradient from '../ProgressBarGradient';
import FormControl from '../FormControl';
import ButtonPrimary from '../ButtonPrimary';
import ButtonSecondary from '../ButtonSecondary';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500, COLOR_PRIMARY_900, GRADIENT_2, GRAY} from '../../utils/constants';
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';
import ViewCollapsable from '../ViewCollapsable';
import TextSingleLine from '../TextSingleLine';
import GradientView from '../GradientView';
import globalStyles from '../../utils/globalStyles';
import RadioInputObject from '../RadioInputObject';
import CustomAnimatedInput from '../CustomAnimatedInput';
import {callPhoneNumber, uploadUrl} from '../../utils/helpers';
import CancelConfirmModal from '../CancelConfirmModal';
import OrderChat from '../OrderChat';
import {useAuth} from '../../utils/auth';
import ImageGallery from '../ImageGallery';

import {useTranslation} from 'react-i18next';

const TabView = ({tab, onChange}) => {
    let {t} = useTranslation()

    return <View style={styles.tabRow}>
        <View style={styles.tabItemWrapper}>
            <Text
                onPress={() => (onChange&&onChange('info'))}
                style={styles.tabItem}
            >{t('pages.home.information')}</Text>
            {tab === 'info' ? (
                <GradientView style={styles.tabActive} gradient={GRADIENT_2} />
            ) : (
                <View style={styles.tabActive}/>
            )}
        </View>
        <View style={styles.tabItemWrapper}>
            <Text
                onPress={() => (onChange&&onChange('items'))}
                style={styles.tabItem}
            >{t('pages.home.items')}</Text>
            {tab === 'items' ? (
                <GradientView style={styles.tabActive} gradient={GRADIENT_2} />
            ) : (
                <View style={styles.tabActive}/>
            )}
        </View>
    </View>
}

const SubmenuProgress = ({
    order,
    onPickupArrive,
    onPickupComplete,
    onDeliveryArrive,
    onDeliveryComplete,
    onCancel,
    collapsed
}) => {
    let {t} = useTranslation()

    const navigation = useNavigation();
    const auth = useAuth();
   let [tab, setTab] = useState('info')
    let [canceling, setCanceling] = useState(false)
    let [cancelingType, setCancelingType] = useState('Customer no show') // ["Customer no show", "Other reason"]
    let [cancelingReason, setCancelingReason] = useState('')
    let [cancelingValidationEnabled, setCancelingValidationEnabled] = useState(false)
    let [cancelConfirmModalVisible, setCancelConfirmModalVisible] = useState(false)
    let [infoHeight, setInfoHeight] = useState(0)
    let [itemsHeight, setItemsHeight] = useState(0)
    let [cancelingHeight, setCancelingHeight] = useState(0)
    let [waitingTime, setWaitingTime] = useState(null)

    const _onPickupArrive = () => {
        if (onPickupArrive) {
            Alert.alert(
                '',
                t('pages.home.ru_mark_order_pickup_arrived'),
                [
                    {
                        text: t('general.cancel'),
                        onPress: () => {},
                        style: 'cancel',
                    },
                    {
                        text: t('general.yes'),
                        onPress: onPickupArrive,
                    },
                ],
                {cancelable: false},
            );
        }
    }

    const _onPickupComplete = () => {
        if (onPickupComplete) {
            if(order.senderModel === 'business'){
                onPickupComplete()
            }
            else {
                Alert.alert(
                    '',
                    t('pages.home.ru_mark_order_pickup_completed'),
                    [
                        {
                            text: t('general.cancel'),
                            onPress: () => {
                            },
                            style: 'cancel',
                        },
                        {
                            text: t('general.yes'),
                            onPress: onPickupComplete,
                        },
                    ],
                    {cancelable: false},
                );
            }
        }
    }

    const _onDeliveryArrive = () => {
        if (onDeliveryArrive) {
            Alert.alert(
                '',
                t('pages.home.ru_mark_order_delivery_arrived'),
                [
                    {
                        text: t('general.cancel'),
                        onPress: () => {},
                        style: 'cancel',
                    },
                    {
                        text: t('general.yes'),
                        onPress: onDeliveryArrive,
                    },
                ],
                {cancelable: false},
            );
        }
    }

    const _onDeliveryComplete = () => {
        onDeliveryComplete && onDeliveryComplete()
    }

    const _onCancel = (forceCancel) => {
        if(!forceCancel && cancelingType.toLowerCase() === 'other reason'){
           if(!cancelingReason){
               setCancelingValidationEnabled(true);
               return;
           }
        }
        if (onCancel) {
            setCancelConfirmModalVisible(true)
        }
    }

    const canCancel = () => {
       if(!order?.time.pickupComplete)
           return true;
        return (waitingTime === '00:00')
    }

    const renderActionButtons = () => {
        // for business order no need to mark as picked up
        if(canceling){
            return <>
                <FormControl>
                    <ButtonPrimary
                        title={!order.time.pickupComplete ? t('pages.home.cancel_job') : t('pages.home.start_return')}
                        onPress={() => _onCancel()}
                    />
                </FormControl>
                <FormControl>
                    <ButtonSecondary
                        title={t('pages.home.go_back')}
                        onPress={() => setCanceling(false)}
                    />
                </FormControl>
            </>
        }
        let CancelJob = !canCancel() ? null : (
            <FormControl>
                <ButtonSecondary
                    title={!order.time.pickupComplete ? t('pages.home.cancel_job') : t('pages.home.return_package')}
                    onPress={() => {
                        if(!waitingTime)
                            setCancelingType('Other reason')
                        setCanceling(true)
                    }}
                />
            </FormControl>
        );
        if(!order.time.pickupArrival && order.senderModel !== 'business'){
            return <>
                <FormControl>
                    <ButtonPrimary
                        // title="Mark as Picked Up"
                        title={t('pages.home.pickup_arrival')}
                        onPress={_onPickupArrive}
                    />
                </FormControl>
                {CancelJob}
            </>
        }
        else if(!order.time.pickupComplete) {
            return <>
                <FormControl>
                    <ButtonPrimary
                        title={order.senderModel === 'business' ? t('pages.home.start_pickup') : t('pages.home.complete_pickup')}
                        onPress={_onPickupComplete}
                    />
                </FormControl>
                {CancelJob}
            </>
        }
        else if(!order.time.deliveryArrival){
            return <>
                <FormControl>
                    <ButtonPrimary
                        title={t('pages.home.arrived_to_delivery')}
                        onPress={_onDeliveryArrive}
                    />
                </FormControl>
                {CancelJob}
            </>
        }
        else if(!order.time.deliveryComplete){
            return <>
                <FormControl>
                    <ButtonPrimary
                        title={t('pages.home.complete_delivery')}
                        onPress={_onDeliveryComplete}
                    />
                </FormControl>
                {CancelJob}
            </>
        }
    }

    let orderPhotos = useMemo(() => {
        let photoList = []
        order.packages.map(pkg => {
            Array.prototype.push.apply(photoList, pkg.photos || [])
        })
        return photoList;
    }, [JSON.stringify(order.packages)])

    React.useEffect(() => {
        let intervalId = setInterval(() => {
            if(!order?.time?.deliveryArrival && !order?.time?.pickupArrival)
                return null
            let t1 = moment(order.time.deliveryArrival || order.time.pickupArrival).toDate().getTime()
            let t2 = Date.now();

            let secondsLeft = 600 - Math.floor((t2 - t1) / 1000)
            secondsLeft = Math.max(0, secondsLeft)
            setWaitingTime(
                Math.floor(secondsLeft/60).toString().padStart(2,'0')+
                ":"+
                Math.floor(secondsLeft%60).toString().padStart(2,'0')
            );
        }, 1000);
        return () => clearInterval(intervalId)
    }, [JSON.stringify(order?.time)])

    let chatCustomer = useMemo(() => {
        if(!order.time.pickupComplete){
            if(order.senderModel === 'customer')
                return order.sender
        }
        else {
            if(order.receiver.status === 'Registered')
                return order.receiver
        }
        return null;
    }, [JSON.stringify(order.time)])

    let confirmedPackageN = useMemo(() => {
        if(!order)
            return 0
        return order.packages.filter(p => !!p.trackingConfirmation).length
    }, [JSON.stringify(order.packages)])

    let imageGalleryRef;
    return (
        <>
            <ViewCollapsable collapsed={!collapsed}>
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {order.pickup.address.formatted_address}
                    </Text>
                </View>
            </ViewCollapsable>

            <ViewCollapsable collapsed={collapsed}>
                {order.senderModel === 'business' && <TabView tab={tab} onChange={setTab}/>}
                <View style={{height: tab !== 'info'?Math.max(infoHeight, itemsHeight, cancelingHeight):Math.max(infoHeight, cancelingHeight)}}>
                    {/** Canceling form **/}
                    <ViewCollapsable onHeightChange={setCancelingHeight} collapsed={!canceling}>
                        <View style={{paddingVertical: 30}}>
                            {/* <Text style={{textAlign: 'center'}}>{t('pages.home.tell_us_reason')}</Text> */}
                            {!order.time.pickupComplete ? (
                                <Text style={{textAlign: 'center'}}>{t('pages.home.tell_us_reason_canceling_order')}</Text>
                            ) : (
                                <Text style={{textAlign: 'center'}}>{t('pages.home.tell_us_reason_start_order_return')}</Text>
                            )}
                        </View>
                        {!!waitingTime && (
                            <FormControl>
                                <RadioInputObject
                                    items={[{value: 'Customer no show', label: t('pages.home.customer_no_show')}, {value: 'Other reason', label: t('pages.home.other_reason')}]}
                                    value={cancelingType}
                                    onChange={setCancelingType}
                                    vertical
                                />
                            </FormControl>
                        )}
                        {cancelingType.toLowerCase() === 'other reason' && (
                            <FormControl>
                                <CustomAnimatedInput
                                    placeholder={t('pages.home.write_reason') + "..."}
                                    value={cancelingReason}
                                    onChangeText={setCancelingReason}
                                    errorText={
                                        cancelingValidationEnabled
                                        && cancelingType.toLowerCase() === 'other reason'
                                        && !cancelingReason ? "Escribe una razón" : ""}
                                />
                            </FormControl>
                        )}
                    </ViewCollapsable>

                    {/** Information tab **/}
                    <ViewCollapsable onHeightChange={setInfoHeight} collapsed={tab !== 'info' || canceling}>
                        {(
                            (!!order?.time?.pickupArrival && !order?.time?.pickupComplete)
                            ||
                            (!!order?.time?.deliveryArrival && !order?.time?.deliveryComplete)
                        ) && (
                            <Text style={styles.waitingTime}>{t('pages.home.waiting_time')}: {waitingTime}</Text>
                        )}
                        {(
                            (!!order?.time?.pickupArrival && !order?.time?.pickupComplete)
                            ||
                            (!!order?.time?.deliveryArrival && !order?.time?.deliveryComplete)
                        ) && (
                            <View style={styles.orderIdViewer}>
                                <Text>{t('pages.home.order_id')}</Text>
                                <Text>{order.id}</Text>
                            </View>
                        )}
                        <View style={styles.dataWrapper}>
                            <View style={styles.dataContainer}>
                                <View style={{flexGrow: 1, paddingRight: 16}}>
                                    <Text style={styles.title1}>{!order.time.pickupComplete ? t('pages.home.pickup') : 'Ubicación de entrega'}</Text>
                                    <TextSingleLine style={styles.title2}>
                                        {!order.time.pickupComplete ? order.sender.name : order.receiver.name}
                                    </TextSingleLine>
                                    <TextSingleLine style={styles.title3}>
                                        {!order.time.pickupComplete ? order.pickup.address.formatted_address : order.delivery.address.formatted_address}
                                    </TextSingleLine>
                                </View>
                                <View>
                                    <SvgXml
                                        onPress={() => callPhoneNumber(!order.time.pickupComplete ? order.pickup.phone : order.delivery.phone)}
                                        width={30}
                                        xml={svgs['icon-phone']}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.dataWrapper}>
                            <View style={styles.dataContainer}>
                                <View>
                                    <Text style={styles.title1}>{!order.time.pickupComplete ? t('pages.home.pickup_contact') : t('pages.home.delivery_contact')}</Text>
                                    <Text style={styles.title2}>
                                        {!order.time.pickupComplete ? order.sender.name : order.receiver.name}
                                    </Text>
                                    <Text style={styles.title3}>
                                        {!order.time.pickupComplete ? order.sender.mobile : order.receiver.mobile}
                                    </Text>
                                </View>
                                {!!chatCustomer && (
                                    <OrderChat
                                        driver={auth.user}
                                        customer={chatCustomer}
                                        order={order}
                                    />
                                )}
                            </View>
                        </View>
                        {!!order.pickup.note && <View style={styles.dataWrapper}>
                            <View style={styles.dataContainer}>
                                <View>
                                    <Text style={styles.title1}>{t('pages.home.message')}</Text>
                                    <Text style={styles.title3}>{order.pickup.note}</Text>
                                </View>
                            </View>
                        </View>}
                        {/* {orderPhotos.length>0 && <View style={styles.dataWrapper}>
                            <View style={styles.dataContainer}>
                                <View>
                                    <Text style={styles.title1}>Photos</Text>
                                    <View style={styles.thumbContainer}>
                                        {orderPhotos.map((photo, i) => (
                                            <View key={i} style={styles.thumb}>
                                                <Image style={styles.thumbImage}
                                                       source={{uri: uploadUrl(photo)}}/>
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        </View>} */}
                    </ViewCollapsable>

                    {/** Items tab **/}
                    <ViewCollapsable onHeightChange={setItemsHeight} collapsed={tab !== 'items' || canceling}>
                        <Text style={styles.itemTitle}>{order.receiver.name}</Text>
                        <View style={globalStyles.flexRow}>
                            <Text style={[styles.itemDescription, {flexGrow: 1}]}>{t('pages.home.order_id')}: {order.id}</Text>
                            <Text style={styles.itemDescription}>{confirmedPackageN}/{order.packages.length}</Text>
                        </View>
                        {order.packages.map((p, i) => (
                            <View key={i} style={styles.itemWrapper}>
                                <SvgXml style={styles.itemIcon} width={22} xml={svgs['icon-package-closed']}/>
                                <View>
                                    <Text style={styles.itemTitle}>{t('pages.home.tracking_no')}</Text>
                                    <Text style={styles.itemDescription}>
                                        {!!p.trackingConfirmation ? p.trackingCode : "***********"}
                                    </Text>
                                </View>
                            </View>
                        ))}
                        <View style={{height: 16}}/>
                    </ViewCollapsable>
                </View>

                {renderActionButtons()}
            </ViewCollapsable>
            <CancelConfirmModal
                visible={cancelConfirmModalVisible}
                isReturn={!!order?.time?.pickupComplete}
                onRequestClose={() => setCancelConfirmModalVisible(false)}
                onConfirm={() => onCancel(cancelingType.toLowerCase()==='customer no show', cancelingReason)}
            />
        </>
    );
}

SubmenuProgress.propTypes = {
    onPickup: PropTypes.func,
    onCancel: PropTypes.func,
};

const styles = StyleSheet.create({
    dataWrapper: {
        marginBottom: 40,
    },
    waitingTime: {
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: 28,
    },
    title: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: COLOR_PRIMARY_900,
        marginVertical: 15,
    },
    dataContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
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
    thumbContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    thumb: {
        width: 48,
        height: 48,
        borderRadius: 5,
        marginRight: 12,
        marginTop: 4,
        overflow: 'hidden',
    },
    thumbImage: {
        width: 48,
        height: 48,
    },
    tabRow: {
        flex: 1,
        flexDirection: 'row',
        marginTop: 8,
        marginBottom: 32
    },
    tabItemWrapper: {
        width: '50%',
        paddingHorizontal: 16,
    },
    tabItem: {
        textAlign: 'center',
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
    },
    tabActive:{
        height: 3
    },
    itemWrapper: {
        // marginHorizontal: -16,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#f0efef',
        paddingVertical: 12,
    },
    itemIcon:{
        marginRight: 16,
    },
    itemTitle: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
    },
    itemDescription: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    },
    orderIdViewer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    }
});

export default SubmenuProgress;
