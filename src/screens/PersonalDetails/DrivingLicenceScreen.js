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
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';
import BoxShadow from '../../components/BoxShadow';
import {connect} from 'react-redux';
import {setDocumentsLicence} from '../../redux/actions';
import BirthdayPicker from '../../components/BirthdayPicker';
import {useAuth} from '../../utils/auth';
import {uploadUrl} from '../../utils/helpers';


const DrivingLicenceScreen = ({navigation, licence, updateLicence}) => {
    const auth = useAuth();
    const [error, setError] = useState('');
    const [expire, setExpire] = useState('');
    const [frontPhoto, setFrontPhoto] = useState(null);

    let frontPhotoSheetRef = null;

    const getPhotoFromCamera = async () => {
        try {
            const photo = await takePhoto({width: 600, height: 400});
            setFrontPhoto(photo);
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const getPhotoFromLibrary = async () => {
        try {
            const photo = await chooseImage({width: 600, height: 400});
            setFrontPhoto(photo);
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const update = () => {
        updateLicence(expire, frontPhoto);
        navigation.goBack();
    };

    useEffect(() => {
        let {expire, frontPhoto} = licence;
        setExpire(expire);
        setFrontPhoto(frontPhoto);
    }, [licence]);

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={'Complete los datos'}
                    color={HeaderPage.Colors.BLACK}
                />}
                footer={(

                    <View style={{padding: 16}}>
                        {!!error && <Text style={{textAlign: 'center', color: COLOR_TERTIARY_ERROR}}>{error}</Text>}
                        <Button
                            title="Guardar"
                            onPress={update}
                        />
                    </View>
                )}
            >
                <View style={{flexGrow: 1}}>
                    <Text style={styles.title}>Licencia de Conducir</Text>
                    <View style={{height: 40}}/>
                    <View style={styles.inputWrapper}>
                        <BirthdayPicker
                            placeholder="Fecha de expiración"
                            value={expire || auth.user.drivingLicence?.expire}
                            onChange={setExpire}
                            startYear={0}
                            deltaYear={20}
                            reverse={false}
                        />
                    </View>
                    <Text>Suba una foto frontal de su documento</Text>
                    <TouchableOpacity onPress={() => frontPhotoSheetRef.show()}>
                        {(!!frontPhoto || !!auth.user.drivingLicence?.frontPhoto) ? (
                            <BoxShadow>
                                <Image
                                    style={[styles.uploadBtn, {height: 64, width: 100}]}
                                    source={{uri: frontPhoto ? frontPhoto.uri : uploadUrl(auth.user.drivingLicence.frontPhoto)}}
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
                        options={['Tomar una foto', 'Escoger de la galería', 'Cancelar']}
                        cancelButtonIndex={2}
                        onPress={(index) => {
                            if (index === 0) {
                                getPhotoFromCamera(false);
                            } else if (index === 1) {
                                getPhotoFromLibrary(false);
                            }
                        }}
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
    const {licence} = state.documents;
    return {licence};
};

const mapDispatchToProps = dispatch => ({
    updateLicence: (expire, frontPhoto) => dispatch(setDocumentsLicence({expire, frontPhoto})),
});

export default connect(mapStateToProps, mapDispatchToProps)(DrivingLicenceScreen);
