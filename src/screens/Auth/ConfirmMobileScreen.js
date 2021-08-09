import React, {useState, useEffect} from 'react';

import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import HeaderPage from '../../components/HeaderPage';
import CustomAnimatedInput from '../../components/CustomAnimatedInput';
import PhoneInput from '../../components/PhoneInput';
import CustomCheckbox from '../../components/CustomCheckbox';
import {
    BLACK,
    BLUE,
    COLOR_TERTIARY_ERROR,
    COLOR_TERTIARY_HYPERLINK,
    GRAY_LIGHT,
    GRAY_LIGHT_EXTRA,
    PAGE_PADDING,
} from '../../utils/constants';
import Button from '../../components/ButtonPrimary';
import PageContainerDark from '../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import {
    CodeField,
    Cursor,
    useBlurOnFulfill,
    useClearByFocusCell,
} from 'react-native-confirmation-code-field';
import {useAuth} from '../../utils/auth';
import Api from '../../utils/api';
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';

const CELL_COUNT = 5;

const ConfirmMobileScreen = ({navigation, route}) => {
    const auth = useAuth();
    const {user, mobile} = route.params;
    const [inProgress, setInProgress] = useState(false)
    const [timer, setTimer] = useState(60);
    const [value, setValue] = useState('');
    const [error, setError] = useState('');
    const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    let timerHandler = null;

    let successCallback = route.params?.successCallback

    useEffect(() => {
        timerHandler = setInterval(() => {
            setTimer(timer > 0 ? timer - 1 : timer);
        }, 1000);

        return () => {
            clearInterval(timerHandler);
        };
    });

    const confirm = () => {
        setInProgress(true)
        Api.Auth.confirmMobile(user._id, value)
            .then(({success, token, message}) => {
                if (success) {
                    if(successCallback){
                        successCallback()
                    }
                    else{
                        return auth.loginWith(token, user);
                    }
                } else {
                    setError(message || 'Server side error');
                }
            })
            .catch(error => {
                console.log(error);
                setError('Somethings went wrong');
            })
            .then(() => {
                setInProgress(false)
            })
    };

    const resendConfirmCode = () => {
        setInProgress(true)
        Api.Auth.resendConfirmCode(user.email, mobile)
            .then(({success, message}) => {
                if(success) {

                }
                else {
                    setError(message || 'Server side error');
                }
            }) 
            .catch(error => {
                console.log(error);
                setError('Somethings went wrong');
            })
            .then(() => {
                setInProgress(false)
            })
    }

    const goToHome = () => {
        auth.logout()
    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={'Crea tu cuenta'}
                    color={HeaderPage.Colors.BLACK}
                    rightButtons={<SvgXml width={24} height={24} style={{marginRight: 10}} onPress={() => goToHome()} xml={svgs['icon-home-off']}/>}
                />}
                footer={(
                    <View style={{paddingHorizontal: 16, paddingBottom: 16}}>
                        {!!error && <Text style={{textAlign: 'center', color: COLOR_TERTIARY_ERROR}}>{error}</Text>}
                        <Button
                            title="Siguiente"
                            onPress={confirm}
                            inProgress={inProgress}
                            disabled={inProgress}
                        />
                    </View>
                )}
            >
                <Text style={styles.message}>Ingrese el código que ha sido enviado al </Text>
                {/*<Text>{JSON.stringify(user, null, 2)}</Text>*/}
                <Text style={{textAlign: 'center', marginTop: 5}}>{mobile}</Text>
                <View style={styles.inputWrapper}>
                    <CodeField
                        ref={ref}
                        {...props}
                        value={value}
                        onChangeText={setValue}
                        rootStyle={styles.codeFieldRoot}
                        keyboardType="number-pad"
                        textContentType="oneTimeCode"
                        cellCount={CELL_COUNT}
                        renderCell={({index, symbol, isFocused}) => (
                            <Text
                                key={index}
                                style={[styles.cell, isFocused && styles.focusCell]}
                                onLayout={getCellOnLayoutHandler(index)}>
                                {symbol || (isFocused ? <Cursor/> : null)}
                            </Text>
                        )}
                    />
                    {/* <Text style={{textAlign: 'center', color: COLOR_TERTIARY_HYPERLINK}}>For demo app enter any
                        number you want.</Text> */}
                </View>

                <Text style={styles.resendTitle}>Reenviar el código | {timer} segundos</Text>
                <TouchableOpacity onPress={() => {setTimer(60); resendConfirmCode();}}>
                </TouchableOpacity>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    message: {
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: 40,
    },
    inputWrapper: {
        marginVertical: 60,
    },
    link: {
        color: BLUE,
    },
    resendTitle: {
        textAlign: 'center',
    },
    resendLink: {
        textAlign: 'center',
        marginVertical: 10,
        fontSize: 18,
        color: BLUE,
    },


    codeFieldRoot: {
        justifyContent: 'center',
    },
    cell: {
        width: 50,
        height: 50,
        lineHeight: 48,
        fontSize: 35,
        backgroundColor: GRAY_LIGHT_EXTRA,
        borderRadius: 5,
        textAlign: 'center',
        marginHorizontal: 5,
    },
    focusCell: {
        borderColor: '#000',
        borderWidth: 2,
    },
});

export default ConfirmMobileScreen;
