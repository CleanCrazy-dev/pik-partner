import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
} from 'react-native';
import {chooseImage, takePhoto} from '../../utils/images';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../components/PageContainerDark';
import HeaderPage from '../../components/HeaderPage';
import CustomAnimatedInput from '../../components/CustomAnimatedInput';
import { setDocumentsVehicle } from '../../redux/actions';
import { connect } from 'react-redux';
import ButtonPrimary from '../../components/ButtonPrimary';
import CustomPicker from '../../components/CustomPicker';
import VehicleTypes from '../../../../node-back/src/constants/VehicleTypes'
import { useAuth } from '../../utils/auth';
import BoxShadow from '../../components/BoxShadow';
import svgs from '../../utils/svgs';
import {SvgXml} from 'react-native-svg';
import ActionSheet from 'react-native-actionsheet';
import {uploadUrl} from '../../utils/helpers';


const VehicleInfoScreen = ({ navigation, vehicle, updateVehicle }) => {
    let auth = useAuth();

    const [type, setType] = useState('');
    const [makeModel, setMakeModel] = useState('');
    const [color, setColor] = useState('');
    const [plate, setPlate] = useState('');
    const [year, setYear] = useState('');
    const [carNumberPhoto, setCarNumberPhoto] = useState(null);
    const update = () => {
        updateVehicle({ type, makeModel, color, plate, year,carNumberPhoto })
        navigation.goBack();
    }
    let carNumberPhotoSheetRef = null;
    const getPhotoFromCamera = async () => {
        try {
            const photo = await takePhoto({width: 600, height: 400});
            setCarNumberPhoto(photo);
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    const getPhotoFromLibrary = async () => {
        try {
            const photo = await chooseImage({width: 600, height: 400});
            setCarNumberPhoto(photo);
        } catch (err) {
            console.log('error >> ', err);
        }
    };

    useEffect(() => {
        let { type, makeModel, plate, year, color,carNumberPhoto } = vehicle;
        setType(type);
        setMakeModel(makeModel)
        setPlate(plate)
        setYear(year)
        setColor(color)
        setCarNumberPhoto(carNumberPhoto)
    }, [])

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={'Información del Vehículo'}
                    color={HeaderPage.Colors.BLACK}
                />}
            >
                <View style={{ flexGrow: 1 }}>
                    <View style={styles.inputWrapper}>
                        {/*<CustomAnimatedInput value={type} onChangeText={setType} placeholder="Vehicle Type"/>*/}
                        <CustomPicker
                            selectedValue={type || auth?.user?.vehicle?.type}
                            onValueChange={(itemValue, itemIndex) => setType(itemValue)}
                            items={Object.values(VehicleTypes)}
                            placeholder={'Tipo de vehículo'}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput
                            value={plate || auth?.user.vehicle?.plate}
                            onChangeText={setPlate}
                            placeholder="Placa"
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput
                            value={color || auth?.user.vehicle?.color}
                            onChangeText={setColor}
                            placeholder="Color"
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput
                            value={makeModel || auth.user.vehicle?.makeModel}
                            onChangeText={setMakeModel}
                            placeholder="Marca  / Modelo"
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput
                            value={year || (auth.user.vehicle?.year || '').toString()}
                            onChangeText={setYear}
                            placeholder="Año"
                            type="number"
                        />
                    </View>
                    <Text>Foto del Registro Vehicular</Text>
                    <TouchableOpacity onPress={() => carNumberPhotoSheetRef.show()}>
                        {(!!carNumberPhoto || !!auth.user.vehicle?.carNumberPhoto) ? (
                            <BoxShadow>
                                <Image
                                    style={[styles.uploadBtn, {height: 64, width: 100}]}
                                    source={{uri: carNumberPhoto ? carNumberPhoto.uri : uploadUrl(auth.user.vehicle.carNumberPhoto)}}
                                />
                            </BoxShadow>
                        ) : (
                            <SvgXml style={styles.uploadBtn} width={64} height={64} xml={svgs['icon-plus-square']}/>
                        )}
                    </TouchableOpacity>


                    <ActionSheet
                        testID="PhotoActionSheet"
                        ref={(o) => {
                            carNumberPhotoSheetRef = o;
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
                <View style={{ flexGrow: 0 }}>
                    <ButtonPrimary onPress={update} title="Guardar" />
                </View>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {},
    headline: {
        fontWeight: 'bold',
        fontSize: 40,
    },
    inputWrapper: {
        marginBottom: 15,
    },
    uploadBtn: {
        marginVertical: 20,
    },
});

const mapStateToProps = state => {
    const { documents: { vehicle } } = state;
    return { vehicle };
};

const mapDispatchToProps = dispatch => ({
    updateVehicle: vehicleInfo => dispatch(setDocumentsVehicle(vehicleInfo)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VehicleInfoScreen);
