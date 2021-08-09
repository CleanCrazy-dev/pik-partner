import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Alert} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import Avatar from '../../../components/Avatar';
import globalStyles from '../../../utils/styles';
import {useAuth} from '../../../utils/auth';
import PhoneInput from '../../../components/PhoneInput';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import GradientButton from '../../../components/GradientButton';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {DEVICE_ANDROID, GRADIENT_1, GRADIENT_2} from '../../../utils/constants';
import {uploadUrl} from '../../../utils/helpers';
import DocumentUpload from '../../../components/DocumentUpload';
import ActionSheet from 'react-native-actionsheet';
import {AVATAR_IMAGE_OPTIONS, chooseImage, takePhoto} from '../../../utils/images';
import Api from '../../../utils/api';
import _ from 'lodash';
import {isEmail, isMobile} from '../../../utils/validator';
import phoneNumber from 'react-native-phone-input/lib/phoneNumber';
import AlertBootstrap from '../../../components/AlertBootstrap';
import ButtonPrimary from '../../../components/ButtonPrimary';

import {useTranslation} from 'react-i18next';

const ProfileScreen = ({navigation}) => {
    let {t} = useTranslation()

    const auth = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [mobileUnFormatted, setMobileUnFormatted] = useState('');
    const [password, setPassword] = useState('');
    const [inProgress, setInProgress] = useState(false)
    const [validationEnabled, setValidationEnabled] = useState(false)
    const [message, setMessage] = useState('')
    const [messageType, setMessageType] = useState('')

    let avatarSheetRef = null;
    const uploadAvatar = photo => {
        let formData = new FormData();
        formData.append("avatar", {
            name: photo.fileName,
            type: photo.mime,
            uri: DEVICE_ANDROID ? photo.uri : photo.uri.replace("file://", "")
        });
        Api.Driver.updateDriverDocument(formData)
            .then(response => {
                console.log("Response", response)
                let {success, message} = response
                if(success){
                    return auth.reloadUserInfo();
                }
                else{
                    Alert.alert("Error", message || "Somethings went wrong")
                    // setError(message || "Somethings went wrong")
                }
            })
            .catch(error => {
                // setError(error.message || "Somethings went wrong")
                console.error(JSON.stringify(error, null, 2), Date.now())
            })
    }
    const getPhotoFromLibrary = async () => {
        try {
            const photo = await chooseImage(AVATAR_IMAGE_OPTIONS);
            uploadAvatar(photo)
        } catch (err) {
            console.log('error >> ', err);
        }
    };
    const getPhotoFromCamera = async () => {
        try {
            const photo = await takePhoto(AVATAR_IMAGE_OPTIONS);
            uploadAvatar(photo)
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    // ================ Validations ====================
    const validateEmail = () => {
        if(!!email && !isEmail(email.trim()))
            return "Incorrect email address"
    }
    const validateMobile = () => {
        if(!!mobile && !isMobile(mobile.trim()))
            return "Enter correct mobile number"
    }
    const validatePassword = () => {
        if(!!password && password.length < 6)
            return "Enter at least 6 character"
    }
    // =================================================

    const updateProfile = () => {
        setMessage('')
        setMessageType('')

        let error = [
            validateEmail(),
            validatePassword(),
            validateMobile(),
        ].filter(_.identity)

        if(error.length > 0){
            setValidationEnabled(true);
            return;
        }

        let update = _.pickBy({firstName, lastName, email, mobile, password}, _.identity)
        if(Object.keys(update).length > 0){
            setInProgress(true)
            Api.Driver.updateProfile(update)
                .then(({success, message, needConfirmMobile}) => {
                    if(success) {
                        setMessage("Profile updated successfully")
                        setMessageType('success')
                        if(needConfirmMobile){
                            navigation.navigate(
                                'AccountConfirmMobile', {
                                    user: auth.user,
                                    successCallback: () => {
                                        auth.reloadUserInfo()
                                        navigation.goBack()
                                    }
                                })
                        }
                        return auth.reloadUserInfo();
                    }
                    else{
                        setMessage(message || "Somethings went wrong")
                        setMessageType('danger')
                    }
                })
                .catch(console.error)
                .then(() => {
                    setInProgress(false);
                })
        }
        else {
            setMessage("No any edit to update server")
            setMessageType('warning')
        }
    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={
                    <HeaderPage
                        navigation={navigation}
                        title={t('pages.profile.my_profile')}
                        color={HeaderPage.Colors.BLACK}
                    />
                }>
                <View style={{paddingVertical: 20}}>
                    <View
                        style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                        <TouchableOpacity onPress={() => avatarSheetRef.show()}>
                            <Avatar source={{uri: uploadUrl(auth.user.avatar)}}/>
                        </TouchableOpacity>
                    </View>
                    <ActionSheet
                        testID="PhotoActionSheet"
                        ref={(o) => {
                            avatarSheetRef = o;
                        }}
                        title={t('photo.select_photo')}
                        options={[t('photo.take_photo'), t('photo.choose_library'), t('photo.cancel')]}
                        cancelButtonIndex={2}
                        onPress={(index) => {
                            if (index === 0) {
                                getPhotoFromCamera();
                            } else if (index === 1) {
                                getPhotoFromLibrary();
                            }
                        }}
                    />
                </View>
                <Text
                    style={[
                        globalStyles.textHeadline5,
                        {textAlign: 'center'},
                    ]}>{`${auth.user.firstName} ${auth.user.lastName}`}</Text>
                <Text
                    style={[
                        globalStyles.textCaption1,
                        {textAlign: 'center', marginBottom: 40},
                    ]}>
                    {t('pages.profile.rider')}
                </Text>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={firstName || auth.user.firstName}
                        onChangeText={setFirstName}
                        placeholder={t('pages.profile.first_name')}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={lastName || auth.user.lastName}
                        onChangeText={setLastName}
                        placeholder={t('pages.profile.last_name')}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={email || auth.user.email}
                        onChangeText={setEmail}
                        placeholder={t('pages.profile.email')}
                        errorText={validationEnabled && validateEmail()}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <PhoneInput
                        value={mobileUnFormatted || auth.user.mobile}
                        onChangeText={setMobileUnFormatted}
                        onChangeFormattedText={setMobile}
                        errorText={validationEnabled && validateMobile()}
                    />
                </View>
                <View style={styles.inputWrapper}>
                    <CustomAnimatedInput
                        value={password}
                        onChangeText={setPassword}
                        placeholder={t('pages.profile.password')}
                        errorText={validationEnabled && validatePassword()}
                    />
                </View>
                {!!message && (
                    <View style={styles.inputWrapper}>
                        <AlertBootstrap
                            message={message}
                            type={messageType}
                            onClose={() => {
                                setMessage('')
                                setMessageType('')
                            }}
                        />
                    </View>
                )}
                <View style={styles.inputWrapper}>
                    <ButtonPrimary
                        title={t('pages.profile.update_profile')}
                        onPress={updateProfile}
                        inProgress={inProgress}
                        disabled={inProgress}
                    />
                </View>
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
});

export default ProfileScreen;
