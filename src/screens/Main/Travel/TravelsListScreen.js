import React, {useState, useMemo} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {connect} from 'react-redux';
import moment from 'moment'
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native'
import {
        getOrdersList as getOrdersListSelector
} from '../../../redux/selectors/appSelectors';
import {
        loadEarnings as loadEarningsAction
} from '../../../redux/actions/appActions';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import {
    COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_500,
    COLOR_TERTIARY_ERROR,
    COLOR_TERTIARY_HYPERLINK,
    COLOR_TERTIARY_SUCCESS,
} from '../../../utils/constants';
import globalStyles from '../../../utils/globalStyles';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {useTranslation} from 'react-i18next';

const OrderItem = ({order}) => {
    let {t} = useTranslation()

    const statusTitle = useMemo(() => {
        let map = {
            "Created": "Pending",
            "Scheduled": "Pending",
            "Pending": "Pending",
            "Progress": "In Progress",
            "Reschedule": "Reschedule",
            "Canceled": "Canceled",
            "Returned": "Returned",
            "Delivered": "Completed",
        }
        return map[order?.status] || order?.status || 'Unknown';
    }, [order])
    return (
        <View style={styles.orderItem}>
            <View style={styles.row}>
                <Text style={styles.orderItemTitle}>{t('pages.jobs.id')}: {order.id}</Text>
                <Text style={styles.orderItemCost}>${(order.cost.deliveryFee).toFixed(2)}</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.orderItemDescription}>
                    <FontAwesome5 name="clock"/>
                    <Text> {moment(order.time.driverAssign).format("h:mma")}     </Text>
                    <FontAwesome5 name="map-marker-alt"/>
                    <Text> {order.direction.routes[0].legs[0].distance.text}</Text>
                </Text>
                <Text style={[styles.orderItemStatus, styles[`statusColor${statusTitle}`]]}>{t(('pages.jobs.status.' + statusTitle).replace(/\s/g, ''))}</Text>
            </View>
        </View>
    )
}

const TravelsListScreen = ({navigation, route, ordersList, loadEarnings}) => {
    let {t} = useTranslation()

    let [refreshing, setRefreshing] = useState(false)
    let onSelect = route.params?.onSelect;
    let pageTitle = route.params?.title;

    useFocusEffect(
        React.useCallback(() => {
            loadEarnings()
        }, [])
    );

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await loadEarnings()
        setRefreshing(false);
    }, []);

    const dayOrdersSort = (a, b) => {
        if(a.updatedAt > b.updatedAt)
            return -1
        else if(a.updatedAt < b.updatedAt)
            return 1
        else
            return 0
    }

    return (
        <KeyboardAvoidingScreen >
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={pageTitle || t('tabs.jobs')}
                    color={HeaderPage.Colors.BLACK}
                />}
                contentStyle={{paddingTop: 0}}
                refreshing={refreshing}
                onRefresh={onRefresh}
            >
                {Object.keys(ordersList.days).length == 0 && (
                    <Text style={styles.noOrder}>{t('pages.jobs.complete_your_first_ride')}</Text>
                )}
                {Object.keys(ordersList.days).map((day, i) => (
                    <View key={i}>
                        <Text style={[styles.dayTitle, i==0?{paddingTop: 24}:{}]}>{ordersList.days[day].title}</Text>
                        {ordersList.days[day].orders.sort(dayOrdersSort).map((order, index) => (
                            <TouchableOpacity key={index} onPress={() => (onSelect && onSelect(order))}>
                                <OrderItem order={order} key={order._id} />
                            </TouchableOpacity>
                        ))}
                    </View>
                ))}
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    )
}

const styles = StyleSheet.create({
    noOrder:{
        padding: 16,
        fontWeight: '700',
        fontSize: 14,
        textAlign: 'center',
    },
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    dayTitle: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: 'white',
        paddingTop: 16,
        paddingBottom: 12,
        backgroundColor: COLOR_PRIMARY_500,
        marginHorizontal: -16,
        padding: 16
    },
    orderItem: {
        paddingVertical: 16,
    },
    orderItemTitle: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
    },
    orderItemCost: {
        fontWeight: 'bold',
        fontSize: 16,
        lineHeight: 24,
    },
    orderItemDescription: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    orderItemStatus: {
        fontWeight: '500',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_TERTIARY_HYPERLINK,
    },
    "statusColorCompleted":{color: COLOR_TERTIARY_SUCCESS},
    "statusColorCanceled":{color: COLOR_TERTIARY_ERROR},
    "statusColorReturned":{color: COLOR_TERTIARY_ERROR},
})

const mapStateToProps = state => {
    return {
        ordersList: getOrdersListSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadEarnings: () => dispatch(loadEarningsAction())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TravelsListScreen);
