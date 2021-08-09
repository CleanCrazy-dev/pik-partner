import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    Picker,
    Image,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import {chooseImage, takePhoto} from '../../utils/images';
import ActionSheet from 'react-native-actionsheet';
import HeaderPage from '../../components/HeaderPage';
import CustomAnimatedInput from '../../components/CustomAnimatedInput';
import {BLUE, COLOR_TERTIARY_ERROR, GRAY_LIGHT} from '../../utils/constants';
import Button from '../../components/ButtonPrimary';
import PageContainerDark from '../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import CustomPicker from '../../components/CustomPicker';
import {useAuth} from '../../utils/auth';
import {connect} from 'react-redux';
import {setDocumentsPersonalId} from '../../redux/actions/documentsActions';
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';
import BoxShadow from '../../components/BoxShadow';
import {uploadUrl} from '../../utils/helpers';


const PersonalIDScreen = ({navigation, personalId, updatePersonalId}) => {
    const auth = useAuth();
    const [error, setError] = useState('');
    const [type, setType] = useState('');
    const [id, setId] = useState('');
    const [frontPhoto, setFrontPhoto] = useState(null);
    const [rearPhoto, setRearPhoto] = useState(null);

    let frontPhotoSheetRef = null;
    let rearPhotoSheetRef = null;

    const getPhotoFromCamera = async (isRearPhoto) => {
        try {
            const photo = await takePhoto({width: 600, height: 400});
            isRearPhoto ? setRearPhoto(photo) : setFrontPhoto(photo);
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const getPhotoFromLibrary = async (isRearPhoto) => {
        try {
            const photo = await chooseImage({width: 600, height: 400});
            isRearPhoto ? setRearPhoto(photo) : setFrontPhoto(photo);
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const update = () => {
        updatePersonalId(type, id, frontPhoto, rearPhoto);
        navigation.goBack();
        // Api.Driver.updatePersonalId({
        //     type, id, frontPhoto, rearPhoto
        // })
        //     .then(({success, message}) => {
        //         if(success) {
        //             return auth.reloadUserInfo()
        //         }
        //         else{
        //             throw {message: message || "Somethings went wrong"}
        //         }
        //     })
        //     .then(() => {
        //         navigation.goBack();
        //     })
        //     .catch(error => {
        //         setError(error?.response?.data?.message || error?.message || "Somethings went wrong")
        //     })
    };

    useEffect(() => {
        let {type, id, frontPhoto, rearPhoto} = personalId;
        setType(type);
        setId(id);
        setFrontPhoto(frontPhoto);
        setRearPhoto(rearPhoto);
    }, [personalId]);

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={'Complete los datos'}
                    color={HeaderPage.Colors.BLACK}
                />}
            >
                <View style={{flexGrow: 1}}>
                    <Text style={styles.title}>Cédula o pasaporte</Text>
                    <View style={{height: 40}}/>
                    <View style={styles.inputWrapper}>
                        <CustomPicker
                            selectedValue={type || auth.user.personalId?.type}
                            onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                            items={['Pasaporte', 'Cédula de identidad personal']}
                            placeholder={'Seleccione tipo de documento'}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput
                            value={id || auth.user.personalId?.id}
                            onChangeText={setId}
                            placeholder={'Escriba su número de cédula o pasaporte'}
                        />
                    </View>
                    <Text>Suba una foto frontal de su documento</Text>
                    <TouchableOpacity onPress={() => frontPhotoSheetRef.show()}>
                        {(!!frontPhoto || auth.user.personalId?.frontPhoto) ? (
                            <BoxShadow>
                                <Image
                                    style={[styles.uploadBtn, {height: 64, width: 100}]}
                                    source={{uri: frontPhoto ? frontPhoto.uri : uploadUrl(auth.user.personalId.frontPhoto)}}
                                />
                            </BoxShadow>
                        ) : (
                            <SvgXml style={styles.uploadBtn} width={64} height={64} xml={svgs['icon-plus-square']}/>
                        )}
                    </TouchableOpacity>
                    <Text>Suba una foto trasera de su documento</Text>
                    <TouchableOpacity onPress={() => rearPhotoSheetRef.show()}>
                        {(!!rearPhoto || auth.user.personalId?.rearPhoto) ? (
                            <BoxShadow>
                                <Image
                                    style={[styles.uploadBtn, {height: 64, width: 100}]}
                                    source={{uri: rearPhoto ? rearPhoto.uri : uploadUrl(auth.user.personalId.rearPhoto)}}
                                />
                            </BoxShadow>
                        ) : (
                            <SvgXml style={styles.uploadBtn} width={64} height={64} xml={svgs['icon-plus-square']}/>
                        )}
                    </TouchableOpacity>


                    <ActionSheet
                        testID="PhotoActionSheet"
                        ref={(o) => {
                            frontPhotoSheetRef = o;
                        }}
                        title="Seleccione una foto"
                        options={['Tomar una foto', 'Escoger de la galería', 'cancel']}
                        cancelButtonIndex={2}
                        onPress={(index) => {
                            if (index === 0) {
                                getPhotoFromCamera(false);
                            } else if (index === 1) {
                                getPhotoFromLibrary(false);
                            }
                        }}
                    />
                    <ActionSheet
                        testID="PhotoActionSheet"
                        ref={(o) => {
                            rearPhotoSheetRef = o;
                        }}
                        title="Seleccione una foto"
                        options={['Tomar una foto', 'Escoger de la galería', 'Cancelar']}
                        cancelButtonIndex={2}
                        onPress={(index) => {
                            if (index === 0) {
                                getPhotoFromCamera(true);
                            } else if (index === 1) {
                                getPhotoFromLibrary(true);
                            }
                        }}
                    />
                </View>
                <View style={{flexGrow: 0}}>
                    {!!error && <Text style={{textAlign: 'center', color: COLOR_TERTIARY_ERROR}}>{error}</Text>}
                    <Button
                        title="Guardar"
                        onPress={update}
                    />
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
    },
    inputWrapper: {
        marginBottom: 15,
    },
    link: {
        color: BLUE,
    },
    uploadBtn: {
        marginVertical: 20,
    },
});

const mapStateToProps = state => {
    const {personalId} = state.documents;
    return {personalId};
};

const mapDispatchToProps = dispatch => ({
    updatePersonalId: (type, id, frontPhoto, rearPhoto) => dispatch(setDocumentsPersonalId({
        type,
        id,
        frontPhoto,
        rearPhoto,
    })),
});

export default connect(mapStateToProps, mapDispatchToProps)(PersonalIDScreen);
