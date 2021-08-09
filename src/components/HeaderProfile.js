import React from 'react';
import {useNavigation} from '@react-navigation/native'
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import {COLOR_PRIMARY_1000, COLOR_PRIMARY_500, COLOR_TERTIARY_HYPERLINK} from '../utils/constants';
import Avatar from './Avatar';
import {SvgXml} from 'react-native-svg';
import svgs from '../utils/svgs';
import {uploadUrl} from '../utils/helpers';
import {useAuth} from '../utils/auth';

import {useTranslation} from 'react-i18next';

const HeaderProfile = ({earnings}) => {
    let {t} = useTranslation()

    const auth = useAuth();
    let navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.userContainer}>
                <Text style={styles.hello}>{t('general.Hello')} {auth.user.firstName}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('MainProfileEdit')}>
                    <Avatar
                        source={{uri: uploadUrl(auth.user.avatar)}}
                        borderColor={COLOR_PRIMARY_1000}
                        size={48}
                    />
                </TouchableOpacity>
            </View>
            <View style={styles.boxContainer}>
                <View style={styles.box}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {/*<SvgUri width={24} height={24} source={require('../assets/images/icon-dollar-circle.svg')} />*/}
                        <SvgXml width={24} height={24} xml={svgs['icon-dollar-circle']}/>
                        <Text style={styles.boxEarning}>$ {earnings.total.toFixed(2)}</Text>
                    </View>
                    <Text style={styles.boxTitle}>{t('pages.accountHome.my_earning')}</Text>
                </View>
                <View style={styles.boxSpacer}/>
                <View style={styles.box}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        {/*<SvgUri width={24} height={24} source={require('../assets/images/icon-lock-circle.svg')} />*/}
                        <SvgXml width={24} height={24} xml={svgs['icon-lock-circle']}/>
                        <Text style={styles.boxOrders}>{earnings.totalOrderCount}</Text>
                    </View>
                    <Text style={styles.boxTitle}>{t('pages.accountHome.my_orders')}</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // paddingVertical: 20,
        paddingTop: 25,
        paddingBottom: 16,
    },
    userContainer: {
        // flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    hello: {
        color: COLOR_PRIMARY_500,
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 48,
    },
    boxContainer: {
        // flex: 1,
        flexDirection: 'row',
        // justifyContent: "",
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    boxSpacer: {
        width: 10,
    },
    box: {
        flexGrow: 1,
        backgroundColor: '#4E4B4B',
        padding: 10,
        borderRadius: 8,
    },
    boxEarning: {
        color: COLOR_TERTIARY_HYPERLINK,
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
    },
    boxOrders: {
        color: COLOR_PRIMARY_500,
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
    },
    boxTitle: {
        color: COLOR_PRIMARY_1000,
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
    },
});

export default HeaderProfile;
