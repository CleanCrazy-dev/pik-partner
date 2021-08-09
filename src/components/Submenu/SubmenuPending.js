import React, {useMemo, useState, useEffect} from 'react';
import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import ProgressBarGradient from '../ProgressBarGradient';
import FormControl from '../FormControl';
import ButtonPrimary from '../ButtonPrimary';
import ButtonSecondary from '../ButtonSecondary';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500, COLOR_PRIMARY_900} from '../../utils/constants';
import ViewCollapsable from '../ViewCollapsable';
import globalStyles from '../../utils/globalStyles';
import SuggestTimoutProgress from '../SuggestTimeoutProgress';

import {useTranslation} from 'react-i18next';

const SubmenuPending = ({order, onAccept, onIgnore, collapsed}) => {
    let {t} = useTranslation()

    let computed = useMemo(() => {
        let totalDistance = !order?.direction?.routes ? 0 : order.direction.routes[0].legs.reduce((total, leg) => (total + leg.distance.value), 0);
        totalDistance = (totalDistance/1000).toFixed(1).toString() + ' km'
        return {
            totalDistance,
        }
    }, [order])

    return (
        <>
            <ViewCollapsable collapsed={!collapsed}>
                <View style={styles.container}>
                    <Text style={styles.title}>{order.pickup.address.formatted_address}</Text>
                </View>
            </ViewCollapsable>
            <ViewCollapsable collapsed={collapsed}>
                <View style={styles.dataWrapper}>
                    <View style={styles.dataContainer}>
                        <View style={{flexGrow: 1, paddingRight: 16}}>
                            <Text style={styles.title1}>{t('pages.home.pickup')}</Text>
                            <View style={globalStyles.flexRow}>
                                <View style={globalStyles.flexColumn}>
                                    <Text numberOfLines={1} style={styles.title2}>
                                        {order.pickup.name}
                                    </Text>
                                </View>
                            </View>
                            <View style={globalStyles.flexRow}>
                                <View style={globalStyles.flexColumn}>
                                    <Text numberOfLines={1} style={styles.title3}>
                                        {order.pickup.address.formatted_address}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.title1}>{t('pages.home.distance')}</Text>
                            <Text style={styles.value}>{computed.totalDistance}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.dataWrapper}>
                    <View style={styles.dataContainer}>
                        <View style={{flexGrow: 1, paddingRight: 16}}>
                            <Text style={styles.title1}>{t('pages.home.dropoff')}</Text>
                            <View style={globalStyles.flexRow}>
                                <View style={globalStyles.flexColumn}>
                                    <Text numberOfLines={1} style={styles.title2}>
                                        {order.delivery.name}
                                    </Text>
                                </View>
                            </View>
                            <View style={globalStyles.flexRow}>
                                <View style={globalStyles.flexColumn}>
                                    <Text numberOfLines={1} style={styles.title3}>
                                        {order.delivery.address.formatted_address}
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <View>
                            <Text style={styles.title1}>{t('pages.home.earning')}</Text>
                            <Text style={styles.value}>${order.cost.deliveryFee.toFixed(2)}</Text>
                        </View>
                    </View>
                </View>
                <SuggestTimoutProgress
                    order={order}
                    onTimeout={() => {
                        onIgnore && onIgnore()
                    }}
                />
                <FormControl>
                    <ButtonPrimary
                        title={t('pages.home.accept_pickup')}
                        onPress={() => {
                            onAccept && onAccept();
                        }}
                    />
                </FormControl>
                <FormControl>
                    <ButtonSecondary
                        title={t('pages.home.ignore')}
                        onPress={() => {
                            onIgnore && onIgnore();
                        }}
                    />
                </FormControl>
            </ViewCollapsable>
        </>
    );
};

const styles = StyleSheet.create({
    dataWrapper: {
        marginBottom: 40,
    },
    dataContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: COLOR_PRIMARY_900,
        marginVertical: 15,
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
});

export default SubmenuPending;
