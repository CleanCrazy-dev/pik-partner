import React, {useState} from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import {useAuth} from '../../../utils/auth';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import GradientButton from '../../../components/GradientButton';
import {GRADIENT_2} from '../../../utils/constants';
import {SvgXml} from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
import svgs from '../../../utils/svgs';

const ProfileScreen = ({navigation}) => {
    const auth = useAuth();
    const [firstName, setFirstName] = useState('sadegh');

    return (
        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<HeaderPage
                    navigation={navigation}
                    title={'Vehicle Edit'}
                    color={HeaderPage.Colors.BLACK}
                />}
            >
                <View style={{flexGrow: 1}}>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput value="Car" placeholder="Vehicle Type"/>
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput value="DA0414" placeholder="Plate ID"/>
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput value="Navy Green" placeholder="Color"/>
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput value="Toyota prius" placeholder="make / model"/>
                    </View>
                    <View style={styles.inputWrapper}>
                        <CustomAnimatedInput value="2000" placeholder="Year"/>
                    </View>
                    <Text>Vehicle Images</Text>
                    {/*<SvgUri style={styles.uploadBtn} width={64} height={64} source={require('../../../assets/images/icon-plus-square.svg')} />*/}
                    <SvgXml style={styles.uploadBtn} width={64} height={64} xml={svgs['icon-plus-square']}/>
                    <Text>Vehicle Insurance</Text>
                    {/*<SvgUri style={styles.uploadBtn} width={64} height={64} source={require('../../../assets/images/icon-plus-square.svg')} />*/}
                    <SvgXml style={styles.uploadBtn} width={64} height={64} xml={svgs['icon-plus-square']}/>
                </View>
                <View style={{flexGrow: 0}}>
                    <GradientButton onPress={() => navigation.navigate('MainVehicleEditSuccess')}
                                    title="Complete Request" gradient={GRADIENT_2}/>
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

export default ProfileScreen;
