import React, {useState} from 'react'
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text
} from 'react-native'
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import {GRAY_LIGHT} from '../../../utils/constants';
import globalStyles from '../../../utils/globalStyles';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import RadioInputObject from '../../../components/RadioInputObject';
import FormControl from '../../../components/FormControl';
import CustomPicker from '../../../components/CustomPicker';
import ButtonPrimary from '../../../components/ButtonPrimary';
import Api from '../../../utils/api'
import AlertBootstrap from '../../../components/AlertBootstrap';
import {isEmail} from '../../../utils/validator';
import _ from 'lodash';
import PhoneInput from '../../../components/PhoneInput';

import {useTranslation} from 'react-i18next';

const BankAccountScreen = ({navigation}) => {
    let {t} = useTranslation()

    const [inProgress, setInProgress] = useState(false)
    const [accountName, setAccountName] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [accountType, setAccountType] = useState('')
    const [accountBank, setAccountBank] = useState('')

    const [validationEnabled, setValidationEnabled] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')

    // ================ Validations ====================
    const validateAccountName = () => {
        if(!accountName.trim())
            return t('pages.bank.enter_account_name')
    }
    const validateAccountNumber = () => {
        if(!accountNumber.trim())
            return t('pages.bank.enter_account_number')
    }
    const validateAccountType = () => {
        if(!accountType.trim())
            return t('pages.bank.select_account_type')
    }
    const validateAccountBank = () => {
        if(!accountBank.trim())
            return t('pages.bank.select_account_bank')
    }
    // =================================================

    const saveChanges = () => {
        setMessage('')
        setMessageType('')
        let error = [
            validateAccountName(),
            validateAccountNumber(),
            validateAccountType(),
            validateAccountBank(),
        ].filter(_.identity)

        if(error.length > 0){
            setValidationEnabled(true);
            return;
        }

        setInProgress(true)
        Api.Driver.postBankAccount(accountName, accountNumber, accountType,accountBank)
            .then(({success, message}) => {
                if(success){
                    setMessageType('success')
                    setMessage(t('pages.bank.bank_register_success'))
                }
                else{
                    setMessageType('danger')
                    setMessage(message || "Somethings went wrong")
                }
            })
            .catch(error => {
                setMessageType('danger')
                setMessage(
                    error?.response?.data?.message ||
                    error?.message ||
                    'Somethings went wrong',)
            })
            .then(() => {
                setInProgress(false)
            })
    }

    React.useEffect(() => {
        Api.Driver.getBankAccount()
            .then(({success, account, message}) => {
                if(success && account) {
                    setAccountName(account.accountName)
                    setAccountNumber(account.accountNumber)
                    setAccountType(account.accountType)
                    setAccountBank(account.accountBank)
                }
            })
    }, [])

    return (
        <KeyboardAvoidingScreen >
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={t('pages.bank.get_paid')}
                />}
                footer={(
                    <View style={{padding: 16}}>
                        <ButtonPrimary
                            title={t('general.save')}
                            onPress={() => saveChanges()}
                            inProgress={inProgress}
                            disabled={inProgress}
                        />
                    </View>
                )}
            >
                <Text style={styles.title}>{t('pages.bank.enter_bank_detail')}</Text>
                <Text style={styles.description}>
                    {t('pages.bank.enter_bank_detail_for_avoid_delay')}
                </Text>
                <View style={globalStyles.inputWrapper}>
                    <CustomAnimatedInput
                        placeholder={t('pages.bank.account_name')}
                        value={accountName}
                        onChangeText={setAccountName}
                        errorText={validationEnabled && validateAccountName()}
                    />
                </View>
                <View style={globalStyles.inputWrapper}>
                    <CustomAnimatedInput
                        placeholder={t('pages.bank.account_no')}
                        value={accountNumber}
                        onChangeText={setAccountNumber}
                        errorText={validationEnabled && validateAccountNumber()}
                    />
                </View>
                <View style={globalStyles.inputWrapper}>
                    <RadioInputObject
                        items={[{value: 'Savings Accounts', label: t('pages.bank.saving_accounts')}, {value: 'Checking Accounts', label: t('pages.bank.checking_accounts')}]}
                        value={accountType}
                        onChange={setAccountType}
                        errorText={validationEnabled && validateAccountType()}
                        // vertical
                    />
                </View>
                <View style={globalStyles.inputWrapper}>
                    <CustomPicker
                        placeholder={t('pages.bank.select_your_bank')}
                        items={[
                            // https://www.panamabanks.info/list-of-banks-in-panama
                            'Banco Aliado', 'Banco Delta', 'Banco General', 'Banco Lafise Panama',
                            'Banco Prival', 'Canal Bank', 'Capital Bank', 'Credicorp Bank', 'Global Bank',
                            'La Hipotecaria', 'Metrobank', 'MMG Bank', 'Multibank', 'Towerbank', 'Unibank',
                            'Banco Nacional de Panama', 'Caja de Ahorros'
                        ]}
                        selectedValue={accountBank}
                        onValueChange={setAccountBank}
                        errorText={validationEnabled && validateAccountBank()}
                    />
                </View>
                {!!message && (
                    <View style={globalStyles.inputWrapper}>
                        <AlertBootstrap
                            message={message}
                            type={messageType}
                            onClose={() => {
                                setMessageType('')
                                setMessage('')
                            }}
                        />
                    </View>
                )}
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    )
}

const styles = StyleSheet.create({
    title: {
        fontWeight: 'bold',
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    description: {
        fontSize: 13,
        textAlign: 'center',
        color: GRAY_LIGHT,
        marginBottom: 40,
    },
})

export default BankAccountScreen;
