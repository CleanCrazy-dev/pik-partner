import React, { useEffect } from 'react';
import {useNavigation} from '@react-navigation/native'
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import {GRAY_LIGHT} from '../../utils/constants';
import ButtonPrimary from '../../components/ButtonPrimary';
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';
import FullWidthImage from '../../components/FullWidthImage';
import {useAuth} from '../../utils/auth';

const UploadSuccessScreen = () => {
    const auth = useAuth();
    let navigation = useNavigation();

    // useEffect(() => {
    //     const timerHandler = setInterval(() => {auth.reloadUserInfo();}, 10000);

    //     return () => clearInterval(timerHandler);
    // }, []);

    return <View style={styles.container}>
        <View style={{flexGrow: 1}}>
            {/*<SvgUri width={'100%'} source={require('../../assets/images/img-03.svg')} />*/}
            {/* <SvgXml width={'100%'} xml={svgs['review']}/> */}
            <FullWidthImage
                source={svgs['validate']}
                aspectRatio={1.3}
            />
            <Text style={styles.title}>Validación de documentos</Text>
            <Text style={styles.description}>Estamos revisando tu aplicación.</Text>
            <Text style={styles.description}>Si necesitas ayuda envíanos un email a partners@pikdelivery.com</Text>
        </View>
        <View style={{flexGrow: 0}}>
           <ButtonPrimary
                onPress={() => auth.logout()}
                title={'Cerrar sesión'}
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

export default UploadSuccessScreen;
