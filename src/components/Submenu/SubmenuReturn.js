import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import FormControl from '../FormControl';
import ButtonPrimary from '../ButtonPrimary';
import ViewCollapsable from '../ViewCollapsable';
import { useTranslation } from 'react-i18next';
import { SvgXml } from 'react-native-svg';
import svgs from '../../utils/svgs';
import TextSingleLine from '../TextSingleLine';
import { COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_900 } from '../../utils/constants';
import OrderChat from '../OrderChat';
import { callPhoneNumber, uploadUrl } from '../../utils/helpers';
import { useAuth } from '../../utils/auth';
const SubmenuReturn = ({
    order,
    onReturnComplete,
    collapsed
}) => {

    let { t } = useTranslation()
    const auth = useAuth();
    const _onReturnComplete = () => {
        onReturnComplete && onReturnComplete()
    }
    let chatCustomer = useMemo(() => {
        if (!order.time.pickupComplete) {
            if (order.senderModel === 'customer')
                return order.sender
        }
        else {
            if (order.receiver.status === 'Registered')
                return order.receiver
        }
        return null;
    }, [JSON.stringify(order.time)])
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
                <View style={styles.container}>
                    <Text style={styles.title}>
                        {order.pickup.address.formatted_address}
                    </Text>
                    <View style={styles.dataWrapper}>
                        <View style={styles.dataContainer}>
                            <View style={{ flexGrow: 1, paddingRight: 16 }}>
                                <Text style={styles.title1}>{t('pages.home.pickup')}</Text>
                                <TextSingleLine style={styles.title2}>
                                    {order.sender.name}
                                </TextSingleLine>
                                <TextSingleLine style={styles.title3}>
                                    {order.pickup.address.formatted_address}
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
                                <Text style={styles.title1}>{t('pages.home.pickup_contact')}</Text>
                                <Text style={styles.title2}>
                                    {order.sender.name}
                                </Text>
                                <Text style={styles.title3}>
                                    {order.sender.mobile}
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
                </View>
            </ViewCollapsable>
            <ViewCollapsable collapsed={collapsed}>
                <FormControl>
                    <ButtonPrimary
                        title={t('pages.home.complete_return')}
                        onPress={_onReturnComplete}
                    />
                </FormControl>
            </ViewCollapsable>
        </>
    );
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: COLOR_PRIMARY_900,
        marginVertical: 15,
    },
    dataWrapper: {
        marginBottom: 40,
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
});

export default SubmenuReturn;
