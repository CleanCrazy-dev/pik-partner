import React, {useState} from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import globalStyles from '../../../utils/styles';
import {SvgXml} from 'react-native-svg';
import svgs from '../../../utils/svgs';
import {connect} from 'react-redux'
import {getEarnings as getEarningsSelector} from '../../../redux/selectors/appSelectors';
import {loadEarnings as loadEarningsAction} from '../../../redux/actions/appActions';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_900} from '../../../utils/constants';

import {useTranslation} from 'react-i18next';

const CHART_ICON_SIZE = 60;

const Header = ({currentWeek}) => {
    let {t} = useTranslation()

    return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}}>
            <SvgXml
                width={CHART_ICON_SIZE}
                height={CHART_ICON_SIZE}
                xml={svgs['chart-01']}
            />
            <View style={{marginLeft: 10}}>
                <Text style={[globalStyles.textHeadline2]}>${currentWeek.toFixed(2)}</Text>
                <Text style={styles.today}>{t('pages.my_earning.CurrentWeek')}</Text>
            </View>
        </View>
    );
};

const EarningsScreen = ({navigation, earnings, loadEarnings}) => {
    let {t} = useTranslation()

    let [refreshing, setRefreshing] = useState(false)

    console.log(earnings);

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

    return (
        <KeyboardAvoidingScreen >
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={t('pages.my_earning.header')}
                    color={HeaderPage.Colors.BLACK}
                />}
                refreshing={refreshing}
                onRefresh={onRefresh}
            >
                <View style={{marginBottom: 40}}>
                    <Header currentWeek={earnings.currentWeek}/>
                </View>
                <React.Fragment>
                    {earnings.weeks.map((item, index) => {
                        return (
                            <TouchableOpacity key={index} onPress={() => navigation.navigate('MyEarningsDetail', {earnings: item})}>
                                <View style={[styles.weekWrapper, index < 7 ? styles.hasSpacer : {}]}>
                                    <View style={{paddingRight: 16}}>
                                        <SvgXml width={17} xml={svgs['icon-dollar-black']}/>
                                    </View>
                                    <View style={{flexGrow: 1}}>
                                        <Text style={styles.weekTitle}>{t('pages.my_earning.' + item.title.replace(/\s/g, ''))}</Text>
                                    </View>
                                    <Text style={styles.weekAmount}>${item.total.toFixed(2)}</Text>
                                    <View style={styles.weekIcon}/>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </React.Fragment>
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
    },
    weekWrapper: {
        padding: 0,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
    },
    hasSpacer: {
        borderBottomWidth: 1,
        borderBottomColor: '#F0EFEF',
    },
    weekTitle: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    weekAmount: {
        fontWeight: '600',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
        marginRight: 16,
    },
    weekIcon: {
        width: 12,
        height: 12,
        borderWidth: 6,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: COLOR_NEUTRAL_GRAY,
    },
});

const mapStateToProps = state => {
    return {
        earnings: getEarningsSelector(state)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadEarnings: () => dispatch(loadEarningsAction())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(EarningsScreen);
