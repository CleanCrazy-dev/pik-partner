import React, {useState, useEffect} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    Modal,
    ActivityIndicator,
    Alert,
    Image,
    View,
    Text,
} from 'react-native';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../components/PageContainerDark';
import HeaderPage from '../../components/HeaderPage'
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';
import {setDocumentsVehicle} from '../../redux/actions';
import {connect} from 'react-redux';
import ButtonPrimary from '../../components/ButtonPrimary';
import {COLOR_PRIMARY_500, COLOR_PRIMARY_900} from '../../utils/constants';
import {chooseImage, takePhoto} from '../../utils/images';
import DocumentUpload from '../../components/DocumentUpload';
import ActionSheet from 'react-native-actionsheet';
import BoxShadow from '../../components/BoxShadow';
import {useAuth} from '../../utils/auth';
import {uploadUrl} from '../../utils/helpers';
import Api from '../../utils/api'

const DeleteProgress = ({visible}) => {
    return <Modal
        transparent
        visible={visible}
    >
        <View style={{ flex:1,backgroundColor:"rgba(0,0,0,0.7)", justifyContent:"center",alignItems:"center"}}>
            <View style={{backgroundColor:"white",padding:10,borderRadius:5, width:"80%", alignItems:"center"}}>
                <Text style={{fontWeight: '900', fontSize: 18, lineHeight: 32}}>Deleting...</Text>
                <ActivityIndicator size="large" color="#f35588"/>
            </View>
        </View>
    </Modal>
}

const VehiclePhotosScreen = ({navigation, vehicle, updateVehicle}) => {
    let auth = useAuth()

    const [deleteInProgress, setDeleteInProgress] = useState(false);
    const [photos, setPhotos] = useState([]);

    let photoSheetRef = null;

    const getPhotoFromLibrary = async (options={}) => {
        try {
            const newPhotos = await chooseImage(options);
            setPhotos([...photos, ...newPhotos])
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const getPhotoFromCamera = async (options={}) => {
        try {
            const photo = await takePhoto(options);
            setPhotos([...photos, photo])
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const update = () => {
        updateVehicle({photos})
        navigation.goBack()
    }

    useEffect(() => {
        setPhotos(vehicle.photos)
    }, [])

    const deleteLocal = (index) => {
        let newList = [...photos]
        newList.splice(index, 1)
        setPhotos(newList);
    }

    const deleteFromServer = (url) => {
        setDeleteInProgress(true);
        Api.Driver.deleteVehiclePhoto(url)
            .then(({success, message, user}) => {
                if(success){
                    console.log(user.vehicle.photos)
                    auth.reloadUserInfo()
                }
                else{
                    Alert.alert('Error', message || "Somethings went wrong")
                }
            })
            .catch(error => {
                console.log(error);
            })
            .then(() => {
                setDeleteInProgress(false);
            })
    }

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

                    <Text style={styles.headline}>Fotos del vehículo</Text>
                    <Text>Suba una foto clara de cada lado de su vehículo incluyendo la placa.</Text>
                    <View style={{height: 40}}/>
                    <View>
                        <View style={styles.imageRow}>
                            {!!auth.user.vehicle?.photos && (
                                (auth?.user?.vehicle?.photos || []).map(photo => (
                                    <BoxShadow>
                                        <View style={styles.imageContainer}>
                                            <Image style={styles.image} source={{uri: uploadUrl(photo)}}/>
                                            <Text onPress={() => deleteFromServer(photo)} style={styles.removeBtn}>Quitar</Text>
                                        </View>
                                    </BoxShadow>
                                )
                            ))}
                            {photos.map((photo, index) => (
                                <BoxShadow>
                                    <View style={styles.imageContainer}>
                                        <Image style={styles.image} source={{uri: photo.uri}}/>
                                        <Text onPress={()=>deleteLocal(index)} style={styles.removeBtn}>Quitar</Text>
                                    </View>
                                </BoxShadow>
                            ))}
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => photoSheetRef.show()}>
                        <SvgXml style={styles.uploadBtn} width={64} height={64} xml={svgs['icon-plus-square']}/>
                    </TouchableOpacity>
                    <ActionSheet
                        testID="PhotoActionSheet"
                        ref={(o) => {
                            photoSheetRef = o;
                        }}
                        title="Seleccione una foto"
                        options={['Tomar una foto', 'Escoger de la galería', 'Cancelar']}
                        cancelButtonIndex={2}
                        onPress={(index) => {
                            if (index === 0) {
                                getPhotoFromCamera();
                            } else if (index === 1) {
                                getPhotoFromLibrary({multiple: true});
                            }
                        }}
                    />
                </View>
                <View style={{flexGrow: 0}}>
                    <ButtonPrimary onPress={update} title="Guardar"/>
                </View>
                <DeleteProgress visible={deleteInProgress} />
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {},
    headline: {
        fontWeight: '700',
        color: COLOR_PRIMARY_900,
        textAlign: 'center',
        fontSize: 24,
        lineHeight: 24
    },
    inputWrapper: {
        marginBottom: 15,
    },
    imageRow:{
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    imageContainer:{
        borderRadius: 5,
        overflow: 'hidden',
        margin: 5
    },
    image: {
        width: 100,
        height: 100,
        borderWidth: 1,
        backgroundColor: "#999",
    },
    removeBtn:{
        backgroundColor: COLOR_PRIMARY_500 + "aa",
        color: 'white',
        position: 'absolute',
        left: 5,
        right: 5,
        bottom: 5,
        lineHeight: 24,
        textAlign: 'center',
        borderRadius: 5
    },
    uploadBtn: {
        marginVertical: 20,
    },
});

const mapStateToProps = state => {
    const {documents: {vehicle}} = state;
    return {vehicle};
};

const mapDispatchToProps = dispatch => ({
    updateVehicle: vehicleInfo => dispatch(setDocumentsVehicle(vehicleInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VehiclePhotosScreen)
