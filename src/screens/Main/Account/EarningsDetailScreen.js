import React, {useState} from 'react';
import moment from 'moment'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import globalStyles from '../../../utils/styles';
import {SvgXml} from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
import svgs from '../../../utils/svgs';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_900,
    COLOR_TERTIARY_ERROR,
    COLOR_TERTIARY_SUCCESS,
} from '../../../utils/constants';
import {useAuth} from '../../../utils/auth';

import {useTranslation} from 'react-i18next';

const CHART_ICON_SIZE = 60;

const EarningsDetailScreen = ({navigation, route}) => {
    let {t} = useTranslation()

    let auth = useAuth()
    let {earnings} = route.params;
    const [daySelected, setDaySelected] = useState(-1);

    const orderEarning = o => {
        let {cost: {deliveryFee, cancelFee, returnFee}, status} = o
        if(status === 'Delivered')
            return deliveryFee
        if(['Canceled', 'Returned'].includes(status)) {
            if(o.cancel.canceler === auth.user._id)
                return 0
            if(status === 'Canceled')
                return cancelFee
            if(status === 'Returned')
                return parseFloat(returnFee) + parseFloat(deliveryFee)
        }
    }
    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={t('pages.my_earning.header')}
                    color={HeaderPage.Colors.BLACK}
                />}
                contentStyle={{
                    backgroundColor: '#FAFAFA',
                }}
            >
                <View style={{marginBottom: 40}}>
                    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
                        <SvgXml
                            width={CHART_ICON_SIZE}
                            height={CHART_ICON_SIZE}
                            xml={svgs['chart-01']}
                        />
                        <View style={{marginLeft: 10}}>
                            <Text style={[globalStyles.textHeadline2]}>${earnings.total.toFixed(2)}</Text>
                            <Text style={styles.today}>{t('pages.my_earning.' + earnings.title.replace(/\s/g, ''))}</Text>
                        </View>
                    </View>
                </View>
                <View>
                    <Text style={styles.headline}>{t('pages.my_earning.earning_details')}</Text>
                    <View style={styles.box1}>
                        <View style={[styles.flexRow, {paddingVertical: 5}]}>
                            <Text style={styles.title}>{t('pages.my_earning.deliveries')}</Text>
                            <Text style={styles.info}>${earnings.delivery.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.flexRow, {paddingVertical: 5}]}>
                            <Text style={styles.title}>{t('pages.my_earning.returns')}</Text>
                            <Text style={styles.info}>${earnings.return.toFixed(2)}</Text>
                        </View>
                        <View style={[styles.flexRow, {paddingVertical: 5}]}>
                            <Text style={styles.title}>{t('pages.my_earning.discounts')}</Text>
                            {earnings.discount < 0 ? (
                                <Text style={styles.info}>-${(-earnings.discount).toFixed(2)}</Text>
                            ) : (
                                <Text style={styles.info}>${earnings.discount.toFixed(2)}</Text>
                            )}
                        </View>
                    </View>
                    <Text style={styles.headline}>{t('pages.my_earning.orders_delivered')}</Text>
                    <View style={styles.box1}>
                        {earnings.orders.map((o, i) => (
                            <View key={i} style={{paddingVertical: 16}}>
                                <View style={styles.flexRow}>
                                    <Text style={styles.title}>{t('pages.my_earning.id')}: {o.id}</Text>
                                    <Text style={styles.info}>${orderEarning(o).toFixed(2)}</Text>
                                </View>
                                <Text style={styles.subTitle}>
                                    <FontAwesome5 name="clock" size={12} color={COLOR_NEUTRAL_GRAY}/>
                                    <Text> {moment(o.createdAt).format('MMM d, h:mma')}     </Text>
                                    <FontAwesome5 name="map-marker-alt" size={12} color={COLOR_NEUTRAL_GRAY}/>
                                    <Text> {o?.direction?.routes[0].legs[0].distance.text}      </Text>
                                    <FontAwesome5 name="inbox" size={12} color={COLOR_NEUTRAL_GRAY}/>
                                    <Text> {o.packages.length}</Text>
                                </Text>
                            </View>
                        ))}
                        {earnings.customValues.map((cv, i) => (
                            <View key={i} style={{paddingVertical: 16}}>
                                <View style={styles.flexRow}>
                                    <Text style={styles.title}>{t('pages.my_earning.pik_discount')}</Text>
                                    {cv.amount<0 ? (
                                        <Text style={[styles.info, {color: COLOR_TERTIARY_ERROR}]}>
                                            -${(-cv.amount).toFixed(2)}
                                        </Text>
                                    ) : (
                                        <Text style={[styles.info, {color: COLOR_TERTIARY_SUCCESS}]}>
                                            ${cv.amount.toFixed(2)}
                                        </Text>
                                    )}
                                </View>
                                <Text style={styles.subTitle}>{cv.description}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {},
    today: {
        fontWeight: '500',
        color: COLOR_PRIMARY_900,
        fontSize: 14,
        lineHeight: 24,
    },
    headline: {
        fontWeight: '700',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
        marginTop: 16,
        marginBottom: 8,
    },
    box1: {
        backgroundColor: 'white',
        paddingVertical: 8,
        marginHorizontal: -16,
        paddingHorizontal: 16,
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    subTitle: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    info: {
        fontWeight: '900',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
});

export default EarningsDetailScreen;
