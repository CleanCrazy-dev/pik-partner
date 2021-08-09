import React, {useState} from 'react';
import _ from 'lodash';
import {
    StyleSheet,
    View,
    Text, StatusBar,
} from 'react-native';
import HeaderPage from '../../components/HeaderPage';
import CustomAnimatedInput from '../../components/CustomAnimatedInput';
import PhoneInput from '../../components/PhoneInput';
import CustomCheckbox from '../../components/CustomCheckbox';
import {BLACK, BLUE, COLOR_TERTIARY_ERROR, GRAY_LIGHT, PAGE_PADDING} from '../../utils/constants';
import Button from '../../components/ButtonPrimary';
import PageContainerDark from '../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import {isEmail, isMobile} from '../../utils/validator';
import Api from '../../utils/api';
import AlertBootstrap from '../../components/AlertBootstrap';

const RegisterScreen = ({navigation}) => {
    let [validationEnabled, setValidationEnabled] = useState(false)
    let [mobileUnformatted, setMobileUnformatted] = useState('');
    let [mobile, setMobile] = useState('');
    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');
    let [iAccept, setIAccept] = useState(false)
    let [error, setError] = useState('');
    let [inProgress, setInProgress] = useState(false)

    // ================ Validations ====================
    const validateEmail = () => {
        if(!email.trim())
            return "Ingrese su email"
        if(!isEmail(email.trim()))
            return "Dirección de E-Mail incorrecta"
    }
    const validatePassword = () => {
        if(!password)
            return "Ingrese una contraseña";
    }
    const validateMobile = () => {
        if(!mobile.trim())
            return "Ingrese un teléfono";
        if(!isMobile(mobile.trim()))
            return "Incorrect mobile number";
    }
    const validateConditionAccept = () => {
        if(!iAccept)
            return "Usted debe aceptar estos términos para continuar";
    }
    // =================================================

    const register = () => {
        setError('')
        let error = [
            validateEmail(),
            validatePassword(),
            validateMobile(),
            validateConditionAccept(),
        ].filter(_.identity)

        if(error.length > 0){
            setError(`Por favor verifique los campos para continuar`)
            setValidationEnabled(true);
            return;
        }

        setInProgress(true);
        Api.Auth.register(mobile, email, password)
            .then(({success, user, message}) => {
                if (success) {
                    navigation.push('AuthConfirmMobile', {user, mobile});
                } else {
                    setError(message || 'Server side error');
                }
            })
            .catch(error => {
                console.log(error);
            })
            .then(() => {
                setInProgress(false)
            })
    };
    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={'Crea tu cuenta'}
                    color={HeaderPage.Colors.BLACK}
                />}
                footer={(
                    <View style={{paddingHorizontal: 16, paddingBottom: 16}}>
                        {!!error && (
                            <View style={styles.inputWrapper}>
                                <AlertBootstrap
                                    type="danger"
                                    message={error}
                                    onClose={() => setError('')}
                                />
                            </View>
                        )}
                        <Button
                            title="Siguiente"
                            onPress={register}
                            inProgress={inProgress}
                            disabled={inProgress}
                        />
                    </View>
                )}
            >
                <Text style={styles.title}>Ingrese los detalles de su cuenta</Text>
                <Text style={styles.description}>Asegurese de ingresar los datos correctamente</Text>
                <View style={styles.inputWrapper}>
                    <PhoneInput
                        value={mobileUnformatted}
                        onChangeText={setMobileUnformatted}
                        onChangeFormattedText={setMobile}
                        errorText={validationEnabled && validateMobile()}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        placeholder={'Correo electrónico'}
                        type="email"
                        value={email}
                        onChangeText={setEmail}
                        errorText={validationEnabled && validateEmail()}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        placeholder={'Contraseña'}
                        type="password"
                        value={password}
                        onChangeText={setPassword}
                        errorText={validationEnabled && validatePassword()}
                    />
                </View>

                <View style={styles.inputWrapper}>
                    <CustomCheckbox
                        value={iAccept}
                        disabled={false}
                        onValueChange={n => setIAccept(n)}
                        errorText={validationEnabled && validateConditionAccept()}
                    >
                         <Text style={{fontWeight: '400', fontSize: 14, lineHeight: 24,paddingRight:30}}>
                            Al crear esta cuenta acepto los
                            <Text onPress={() => navigation.navigate('AuthTermsAndConditions')} style={styles.link}> Términos , Condiciones </Text>
                           y
                            <Text onPress={() => navigation.navigate('AuthDataPrivacy')} style={styles.link}> las Políticas de Privacidad </Text>
                            de PIK Delivery
                        </Text>
                    </CustomCheckbox>
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

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
    inputWrapper: {
        marginBottom: 15,
    },
    link: {
        color: BLUE,
    },
});

export default RegisterScreen;
