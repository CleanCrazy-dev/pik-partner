import React, {useState, useEffect} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import HeaderPage from '../../components/HeaderPage';
import CustomAnimatedInput from '../../components/CustomAnimatedInput';
import {
    COLOR_NEUTRAL_GRAY,
} from '../../utils/constants';
import Button from '../../components/ButtonPrimary';
import PageContainerDark from '../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import Api from '../../utils/api';
import globalStyles from '../../utils/globalStyles';
import {isEmail, isMobile} from '../../utils/validator';
import ViewCollapsable from '../../components/ViewCollapsable';
import AlertBootstrap from '../../components/AlertBootstrap';
import {useAuth} from '../../utils/auth';

const PasswordRecoveryScreen = ({navigation, route}) => {
    const auth = useAuth();

    let [error, setError] = useState('')
    let [step, setStep] = useState(0);
    let [validationEnabled, setValidationEnabled] = useState(false)
    let [email, setEmail] = useState('')
    let [securityCode, setSecurityCode] = useState('')
    let [password, setPassword] = useState('')
    let [password2, setPassword2] = useState('')
    let [inProgress, setInProgress] = useState(false)

    // ================ Validations ====================
    const validateEmail = () => {
        if(!email.trim())
            return "Ingrese su email"
        if(!isEmail(email.trim()))
            return "Incorrect email address"
    }
    const validateSecurity = () => {
        if(!securityCode)
            return "Ingresa el Código de Seguridad";
    }
    const validatePassword = () => {
        if(!password)
            return "Ingresa tu contraseña";
    }
    const validatePassword2 = () => {
        if(!password2)
            return "Reescribe tu contraseña";
        if(password !== password2)
            return "La contraseña y la contraseña reescrita no son iguales.";
    }
    // =================================================

    const recoverEmail = () => {
        if(validateEmail()){
            setValidationEnabled(true)
            return;
        }
        setInProgress(true)
        Api.Auth.recoverPassword({step: 0, email})
            .then(({success, message}) => {
                if(success){
                    setValidationEnabled(false)
                    setStep(step + 1);
                }
                else
                    setError(message || "Somethings went wrong")
            })
            .catch(error => {
                setError(error.message || "Somethings went wrong")
                console.error(error)
            })
            .then(() => {
                setInProgress(false)
            })
    }

    const verifyEmail = () => {
        if(validateSecurity()){
            setValidationEnabled(true)
            return;
        }
        setInProgress(true)
        Api.Auth.recoverPassword({step: 1, email, securityCode})
            .then(({success, message}) => {
                if(success){
                    setValidationEnabled(false)
                    setStep(step + 1);
                }
                else
                    setError(message || "Somethings went wrong")
            })
            .catch(error => {
                setError(error.message || "Somethings went wrong")
                console.error(error)
            })
            .then(() => {
                setInProgress(false)
            })
    }

    const resetPassword = () => {
        if(validatePassword() || validatePassword2()){
            setValidationEnabled(true)
            return;
        }
        setInProgress(true)
        Api.Auth.recoverPassword({step: 2, email, securityCode, password})
            .then(({success, message, token, user}) => {
                if(success){
                    setValidationEnabled(false)
                    if(!token || !user){
                        throw {message: 'Somethings went wrong. user missing'}
                    }
                    auth.loginWith(token, user);
                }
                else
                    setError(message || "Somethings went wrong")
            })
            .catch(error => {
                setError(error.message || "Somethings went wrong")
                console.error(error)
            })
            .then(() => {
                setInProgress(false)
            })
    }

    const callNext = () => {
        setError('')
        if(step === 0)
            recoverEmail()
        else if(step === 1)
            verifyEmail()
        else
            resetPassword()
    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    title={'Recupera tu contraseña'}
                    color={HeaderPage.Colors.BLACK}
                />}
            >
                <View style={{flexGrow: 1}}>
                    <ViewCollapsable collapsed={step != 0}>
                        <Text style={styles.description}>
                            Te enviaremos un código a tu email para reiniciar tu contraseña.
                        </Text>
                        <View style={[globalStyles.inputWrapper, {marginTop: 48}]}>
                            <CustomAnimatedInput
                                placeholder="Correo electrónico"
                                type="email"
                                value={email}
                                onChangeText={setEmail}
                                errorText={validationEnabled && validateEmail()}
                            />
                        </View>
                    </ViewCollapsable>
                    <ViewCollapsable collapsed={step != 1}>
                        <Text style={styles.h1}>Verifica tu cuenta</Text>
                        <Text style={styles.description}>
                            Te envíamos un código de seguridad para completar la verificación de la cuenta.
                        </Text>
                        <View style={[globalStyles.inputWrapper, {marginTop: 48}]}>
                            <CustomAnimatedInput
                                placeholder="ingrese el código de seguridad"
                                value={securityCode}
                                onChangeText={setSecurityCode}
                                errorText={validationEnabled && validateSecurity()}
                            />
                        </View>
                    </ViewCollapsable>
                    <ViewCollapsable collapsed={step != 2}>
                        <Text style={styles.h1}>Enter a new password</Text>
                        <View style={[globalStyles.inputWrapper, {marginTop: 48}]}>
                            <CustomAnimatedInput
                                placeholder="Contraseña"
                                type="password"
                                value={password}
                                onChangeText={setPassword}
                                errorText={validationEnabled && validatePassword()}
                            />
                        </View>
                        <View style={globalStyles.inputWrapper}>
                            <CustomAnimatedInput
                                placeholder="Contraseña"
                                type="password"
                                value={password2}
                                onChangeText={setPassword2}
                                errorText={validationEnabled && validatePassword2()}
                            />
                        </View>
                    </ViewCollapsable>
                </View>
                <View style={{flexGrow: 0}}>
                    {!!error && <View style={globalStyles.inputWrapper}>
                        <AlertBootstrap
                            type="danger"
                            message={error}
                            onClose={() => setError('')}
                        />
                    </View>}
                    <Button
                        title="Siguiente"
                        onPress={() => callNext()}
                        inProgress={inProgress}
                        disabled={inProgress}
                    />
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    h1: {
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 24,
        textAlign: 'center',
        marginVertical: 16
    },
    description: {
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
        textAlign: 'center',
        color: COLOR_NEUTRAL_GRAY
    },
});

export default PasswordRecoveryScreen
