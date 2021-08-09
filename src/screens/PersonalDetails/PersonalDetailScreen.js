import React, {useState, useEffect} from 'react';
import moment from 'moment'
import {
    StyleSheet,
    Picker,
    View,
    Text,
    TouchableOpacity,
} from 'react-native';
import VehicleTypes from '../../../../node-back/src/constants/VehicleTypes'
import HeaderPage from '../../components/HeaderPage';
import CustomAnimatedInput from '../../components/CustomAnimatedInput';
import {BLUE, COLOR_TERTIARY_ERROR, GRAY_LIGHT} from '../../utils/constants';
import Button from '../../components/ButtonPrimary';
import PageContainerDark from '../../components/PageContainerDark';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import RadioInput from '../../components/RadioInput';
import CustomPicker from '../../components/CustomPicker';
import {useAuth} from '../../utils/auth';
import Api from '../../utils/api';
import BirthdayPicker from '../../components/BirthdayPicker';
import _ from 'lodash';
import globalStyles from '../../utils/globalStyles';
import AlertBootstrap from '../../components/AlertBootstrap';
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';


const PersonalDetailsScreen = ({navigation}) => {
    const auth = useAuth();
    let [validationEnabled, setValidationEnabled] = useState(false)
    const [error, setError] = useState('');
    const [firstName, setFirstName] = useState(auth.user.firstName || '');
    const [lastName, setLastName] = useState(auth.user.lastName || '');
    const [address, setAddress] = useState(auth.user.address || '');
    const [birthDate, setBirthDate] = useState(auth.user.birthDate || '');
    const [gender, setGender] = useState(auth.user.gender || null);
    const [vehicle, setVehicle] = useState(auth.user.vehicle?.type || null);
    const [inProgress, setInProgress] = useState(false)

    // ================ Validations ====================
    const validateFirstName = () => {
        if(!firstName.trim())
            return "Ponga su primer nombre"
    }
    const validateLastName = () => {
        if(!lastName.trim())
            return "Ingrese su apellido"
    }
    const validateAddress = () => {
        if(!address.trim())
            return "Ingrese su direccion"
    }
    const validateBirthDate = () => {
        if(!birthDate.trim())
            return "Selecciona tu cumpleaños"
        if(!moment(birthDate, 'YYYY-MM-DD').isValid())
            return "Fecha incorrecta"
    }
    const validateGender = () => {
        if(!gender)
            return "Selecciona tu género"
    }
    const validateVehicle = () => {
        if(!vehicle)
            return "Selecciona tu género"
    }
    // =================================================

    const update = () => {
        setError('')
        let error = [
            validateFirstName(),
            validateLastName(),
            validateAddress(),
            validateBirthDate(),
            validateGender(),
            validateVehicle(),
        ].filter(_.identity)

        if(error.length > 0){
            setError(`Por favor verifique los campos para continuar`)
            setValidationEnabled(true);
            return;
        }

        setInProgress(true)
        Api.Driver.updatePersonalInfo({
            firstName, lastName, address, birthDate, gender, vehicleType: vehicle,
        })
            .then(({success, message}) => {
                if (success) {
                    auth.reloadUserInfo();
                    navigation.push('PersonalDetailDocumentsScreen');
                } else {
                    setError(message || 'Somethings went wrong');
                }
            })
            .catch(error => {
                setError(error?.response?.data?.message || error?.message || 'Somethings went wrong');
            })
            .then(() => {
                setInProgress(false)
            })
    };

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
            >
                <View style={{flexGrow: 1}}>
                    <Text style={styles.title}>Ingrese sus detalles personales</Text>
                    <Text style={styles.description}>El registro es únicamente para mayores de edad.</Text>
                    <Text style={styles.description}>Ingrese su nombre completo tal como aparece en la documentación.</Text>

                    <View style={{height: 40}}/>

                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput
                            value={firstName}
                            onChangeText={setFirstName}
                            placeholder={'Nombre'}
                            errorText={validationEnabled && validateFirstName()}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput
                            value={lastName}
                            onChangeText={setLastName}
                            placeholder={'Apellido'}
                            errorText={validationEnabled && validateLastName()}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput
                            value={address}
                            onChangeText={setAddress}
                            placeholder={'Dirección'}
                            errorText={validationEnabled && validateAddress()}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <BirthdayPicker
                            placeholder="Fecha de nacimiento"
                            value={birthDate}
                            onChange={setBirthDate}
                            errorText={validationEnabled && validateBirthDate()}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <RadioInput
                            items={['Masculino', 'Femenino']}
                            value={gender}
                            onChange={g => setGender(g)}
                            errorText={validationEnabled && validateGender()}
                        />
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomPicker
                            selectedValue={vehicle}
                            onValueChange={(itemValue, itemIndex) => setVehicle(itemValue)}
                            items={Object.values(VehicleTypes)}
                            placeholder={'seleccione un tipo de vehículo'}
                            errorText={validationEnabled && validateVehicle()}
                        />
                    </View>
                </View>
                <View style={{flexGrow: 0}}>
                    {!!error && (
                        <View style={globalStyles.inputWrapper}>
                            <AlertBootstrap
                                type="danger"
                                message={error}
                                onClose={() => setError('')}
                            />
                        </View>
                    )}
                    <Button
                        title="Siguiente"
                        onPress={update}
                        inProgress={inProgress}
                        disabled={inProgress}
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
});

export default PersonalDetailsScreen;
