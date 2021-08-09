import React from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Alert,
    View,
    Text,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import globalStyles from '../../../utils/styles';
import {useAuth} from '../../../utils/auth';
import Header from '../../../components/HeaderProfile';
import {COLOR_PRIMARY_900, GRADIENT_1, GRADIENT_2} from '../../../utils/constants';

import {connect} from 'react-redux'
import {getEarnings as getEarningsSelector} from '../../../redux/selectors/appSelectors';
import {loadEarnings as loadEarningsAction} from '../../../redux/actions/appActions';
import LangSwitch from '../../../components/LangSwitch';
import Share from 'react-native-share';

import {useTranslation} from 'react-i18next';

const AccountHomeScreen = ({navigation, earnings, loadEarnings}) => {
    const auth = useAuth();
    let {t} = useTranslation()

    const MenuItem = ({title, description, onPress, hasSubMenu = true}) => {
        let Wrapper = !!onPress ? TouchableOpacity : View
        return (
            <Wrapper onPress={onPress}>
                <View style={styles.menuContainer}>
                    <Text style={[globalStyles.textCaption1]}>{description}</Text>
                    <Text style={styles.menuTitle}>{title}</Text>
                    {hasSubMenu && <View style={styles.menuIcon}/>}
                </View>
            </Wrapper>
        );
    };

    const confirmAndLogout = () => {
        Alert.alert(
            'Warning',
            t('pages.accountHome.ru_logout'),
            [
                {
                    text: t('general.no'),
                    onPress: () => {
                    },
                    style: 'cancel',
                },
                {text: t('general.yes'), onPress: () => auth.logout()},
            ],
            {cancelable: true},
        );
    };

    useFocusEffect(
        React.useCallback(() => {
            loadEarnings()
        }, [])
    );

    const shareApp = () => {
        let share = {
            title: t('pages.accountHome.pik_delivery'),//string
            message: `${t('general.Hey')},\n\n${t('pages.accountHome.pik_delivery_awesome_app')}\n${t('pages.accountHome.downloadit')}:\nhttps://pikdelivery.com`,//string
        };
        Share.open(share).catch(err => console.log(err));
    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<Header earnings={earnings}/>}
            >
                <MenuItem
                    description={t('pages.accountHome.menu.profile.description')}
                    title={t('pages.accountHome.menu.profile.title')}
                    onPress={() => navigation.push('MainProfileEdit')}
                />
                <MenuItem
                    description={t('pages.accountHome.menu.earnings.description')}
                    title={t('pages.accountHome.menu.earnings.title')}
                    onPress={() => navigation.push('MyEarnings')}
                />
                <MenuItem
                    description={t('pages.accountHome.menu.bankAccount.description')}
                    title={t('pages.accountHome.menu.bankAccount.title')}
                    onPress={() => navigation.push('MainBankAccount')}
                />
                <MenuItem
                    description={t('pages.accountHome.menu.vehicle.description')}
                    title={t('pages.accountHome.menu.vehicle.title')}
                    onPress={() => navigation.push('MainVehicleInformation')}
                />
                <MenuItem
                    description={t('pages.accountHome.menu.support.description')}
                    title={t('pages.accountHome.menu.support.title')}
                    onPress={() => navigation.push('MainSupportCenter')}
                />
              
                <MenuItem
                    description={t('pages.accountHome.menu.share.description')}
                    title={t('pages.accountHome.menu.share.title')}
                    onPress={shareApp}
                    hasSubMenu={false}
                />
                
                {/*<MenuItem*/}
                {/*    description={t('pages.accountHome.menu.settings.description')}*/}
                {/*    title={t('pages.accountHome.menu.settings.title')}*/}
                {/*    onPress={() => {*/}
                {/*    }}*/}
                {/*/>*/}
                <MenuItem
                    description={t('pages.accountHome.menu.legalTerms.description')}
                    title={t('pages.accountHome.menu.legalTerms.title')}
                    onPress={() => navigation.push('TermsAndConditions')}
                />
                {/* <LangSwitch>
                   <MenuItem
                       description={t("langSwitch.current")}
                       title={t("langSwitch.title")}
                       hasSubMenu={false}
                   />
                </LangSwitch> */}
                <MenuItem
                    description={t('pages.accountHome.menu.logout.description')}
                    title={t('pages.accountHome.menu.logout.title')}
                    hasSubMenu={false}
                    onPress={() => confirmAndLogout()}
                />
              
                <MenuItem
                    description={t('pages.accountHome.menu.version.description')}
                    title={PIK_BUNDLE_VERSION}
                    hasSubMenu={false}
                />
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {},
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 40,
    },
    inputWrapper: {
        marginBottom: 15,
    },
    menuContainer: {
        paddingVertical: 10,
    },
    menuDescription: {},
    menuTitle: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    menuIcon: {
        position: 'absolute',
        width: 0,
        height: 0,
        right: 0,
        top: '50%',
        borderWidth: 5,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: COLOR_PRIMARY_900,
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

export default connect(mapStateToProps, mapDispatchToProps)(AccountHomeScreen);
