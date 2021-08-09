import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { GRAY_LIGHT, GRAY_LIGHT_EXTRA } from '../../utils/constants';
import ButtonPrimary from '../../components/ButtonPrimary';
import { useAuth } from '../../utils/auth';
import { SvgXml } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
import svgs from '../../utils/svgs';
import FullWidthImage from '../../components/FullWidthImage';

const RegisterSuccessScreen = ({ navigation }) => {
    const auth = useAuth();
    const reloadUser = () => {
        auth.reloadUserInfo()
            .then(() => {
            });
    };

    return <View style={styles.container}>
        <View style={{ flexGrow: 1 }}>
            {/*<SvgUri width={'100%'} source={require('../../assets/images/img-03.svg')} />*/}
            {/* <SvgXml width={'100%'} xml={svgs['img-03']}/> */}
            <FullWidthImage
                source={svgs['img-03']}
                aspectRatio={1.3}
            />
            <Text style={styles.title}>Congratulations</Text>
            <Text style={styles.description}>Your application has been accepted.</Text>
            <Text style={styles.description}>Now you can start working on PIK</Text>
        </View>
        <View style={{ flexGrow: 0 }}>
            <ButtonPrimary
                onPress={reloadUser}
                title={'Siguiente'}
            />
        </View>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20,
        marginTop: 40,
        marginBottom: 20,
    },
    description: {
        textAlign: 'center',
        color: GRAY_LIGHT,
        fontSize: 16,
    },
});

export default RegisterSuccessScreen;
