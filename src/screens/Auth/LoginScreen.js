import React, {useState} from 'react';
import _ from 'lodash';
import {
    ScrollView,
    KeyboardAvoidingView,
    StyleSheet,
    Image,
    View,
    Text, StatusBar,
} from 'react-native';
import {ORANGE, GRAY_LIGHT, GRAY, WINDOW_WIDTH, DEVICE_IOS, PAGE_PADDING} from '../../utils/constants';
import ButtonPrimary from '../../components/ButtonPrimary';
import FullWidthImage from '../../components/FullWidthImage';
import CustomAnimatedInput from '../../components/CustomAnimatedInput';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import {isEmail, isMobile} from '../../utils/validator';
import {useAuth} from '../../utils/auth';
import AlertBootstrap from '../../components/AlertBootstrap';
import globalStyles from '../../utils/globalStyles';
import PageContainerLight from '../../components/PageContainerLight';
import messaging from '@react-native-firebase/messaging';
import { getDeviceInfo } from '../../utils/helpers';
import Api from '../../utils/api'

async function requestUserNotificationPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Authorization status:', authStatus);
        const fcmToken = await messaging().getToken();
        let deviceInfo = getDeviceInfo()
        Api.Driver.registerDevice({ fcmToken, ...deviceInfo })
            .then(async data => {
                if (data.success) {
                    console.log('device registered successfully')
                    // await AsyncStorage.setItem('device-info', JSON.stringify({fcmToken, ...deviceInfo}))
                }
                else {
                    console.log(data)
                }
            })
            .catch(console.error)
    }
}

const LoginScreen = ({navigation}) => {
    const auth = useAuth();

    let [validationEnabled, setValidationEnabled] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loginInProgress, setLoginInProgress] = useState(false)

    // ================ Validations ====================
    const validateEmail = () => {
        if (!email.trim()) {
            return 'Ingrese su email';
        }
        if (!isEmail(email.trim())) {
            return 'Dirección de E-Mail incorrecta';
        }
    };
    const validatePassword = () => {
        if (!password) {
            return 'Ingresa tu contraseña';
        }
    };
    // =================================================

    const _signIn = () => {
        setError('');
        let error = [
            validateEmail(),
            validatePassword(),
        ].filter(_.identity);

        if (error.length > 0) {
            setError('Por favor verifique los campos para continuar');
            setValidationEnabled(true);
            return;
        }

        setLoginInProgress(true)
        auth.login(email, password)
            .then(({success, message, token}) => {
                console.log({success, message, token});
                if (!success) {
                    setError(message || 'Something went wrong');
                }
            })
            .catch(() => {})
            .then(() => {
                setLoginInProgress(false)
                requestUserNotificationPermission()
            })
    };
    return (
        <KeyboardAvoidingScreen>
            <PageContainerLight
                footer={(
                    <View style={{padding: 16}}>
                        {!!error && (
                            <View style={globalStyles.inputWrapper}>
                                <AlertBootstrap
                                    type="danger"
                                    message={error}
                                    onClose={() => setError('')}
                                />
                            </View>
                        )}
                        <ButtonPrimary
                            title="Iniciar Sesión"
                            onPress={_signIn}
                            inProgress={loginInProgress}
                            disabled={loginInProgress}
                        />
                    </View>
                )}
            >
                {/*<StatusBar barStyle="light-content"/>*/}
                    <FullWidthImage
                        source={require('../../assets/images/img-02.png')}
                        aspectRatio={1.4}
                    />
                    <View style={{flexGrow: 1}}>
                        <Text style={styles.title}>Ingrese a su cuenta</Text>
                        <View style={styles.inputWrapper}>
                            <CustomAnimatedInput
                                value={email}
                                onChangeText={text => setEmail(text)}
                                placeholder={'Correo electrónico'}
                                type="email"
                                errorText={validationEnabled && validateEmail()}
                            />
                        </View>
                        <View style={styles.inputWrapper}>
                            <CustomAnimatedInput
                                value={password}
                                onChangeText={text => setPassword(text)}
                                placeholder={'Contraseña'}
                                type="password"
                                errorText={validationEnabled && validatePassword()}
                            />
                            <Text onPress={() => navigation.navigate('AuthPasswordRecovery')}
                                  style={styles.forgetPassTitle}>¿Olvidaste tu contraseña?</Text>
                        </View>
                    </View>
            </PageContainerLight>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    title: {
        fontSize: Math.min(20, WINDOW_WIDTH / 18),
        marginBottom: 30,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
    },
    inputWrapper: {
        marginBottom: 15,
    },
    forgetPassTitle: {
        marginTop: 10,
        color: ORANGE,
        textAlign: 'right',
    },
    errorMessage: {
        color: 'red',
        padding: 10,
        backgroundColor: '#fdd',
        borderWidth: 1,
        borderColor: '#fbb',
        borderRadius: 5,
        marginBottom: 5,
    }
});

export default LoginScreen;
