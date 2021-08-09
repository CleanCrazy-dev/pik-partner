import React from 'react';
import {
    StyleSheet,
    Text,
} from 'react-native';
import { GRAY_LIGHT } from '../../../utils/constants';
import ButtonPrimary from '../../../components/ButtonPrimary';
import { useAuth } from '../../../utils/auth';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../utils/svgs';
import OrderStatuses from '../../../../../node-back/src/constants/OrderStatuses.js';
import PageContainerLight from '../../../components/PageContainerLight';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import FullWidthImage from '../../../components/FullWidthImage';

import {useTranslation} from 'react-i18next';

const DeliverySuccessScreen = ({ navigation, route }) => {
    let {t} = useTranslation()

    const auth = useAuth();
    let { order } = route.params || {}

    let earning = React.useMemo(() => {
        switch (order?.status) {
            case OrderStatuses.Delivered:
                return order.cost.deliveryFee
            case OrderStatuses.Canceled:
                return order.cost.cancelFee
            case OrderStatuses.Returned:
                return order.cost.returnFee
            default:
                return '0.00'
        }
    }, [order])

    return (
        <KeyboardAvoidingScreen>
            <PageContainerLight>
                {/* <SvgXml width={'100%'} xml={svgs['img-03']} /> */}
                <FullWidthImage
                    source={svgs['img-03']}
                    aspectRatio={1.3}
                />
                <Text style={styles.title}>{t('pages.home.thankyou')} {auth.user.name}!</Text>
                <Text style={[styles.description, { marginBottom: 48 }]}>{t('pages.home.customer_satisfied')}</Text>
                <Text style={styles.description}>{t('pages.home.earning_delivery')}</Text>
                <Text style={styles.earning}>${earning.toFixed(2)}</Text>
                <ButtonPrimary
                    onPress={() => navigation.goBack()}
                    title={t('pages.home.done')}
                />
            </PageContainerLight>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 40,
        marginBottom: 20,
    },
    description: {
        textAlign: 'center',
        color: GRAY_LIGHT,
        fontSize: 16,
        marginBottom: 8,
    },
    earning: {
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 24,
        marginBottom: 24,
    },
});

export default DeliverySuccessScreen;
