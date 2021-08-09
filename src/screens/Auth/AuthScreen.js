import React from 'react';
import {
    StyleSheet,
    Image,
    View,
    Text, StatusBar,
} from 'react-native';
import {ORANGE, GRAY_LIGHT, GRAY, WINDOW_WIDTH, PAGE_PADDING, GRADIENT_2} from '../../utils/constants';
import Button from '../../components/CustomButton';
import ButtonPrimary from '../../components/ButtonPrimary';
import FullWidthImage from '../../components/FullWidthImage';
import DevConfigModal from '../../components/DevConfigModal';

const AuthScreen = ({navigation}) => {
    let [devModalVisible, setDevModalVisible] = React.useState(false)
    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content"/>
            <FullWidthImage
                source={require('../../assets/images/img-01.png')}
                aspectRatio={1.3}
            />
            <View style={{flexGrow: 1}}>
                <Text style={styles.title}>Bienvenido a PIK Partner</Text>
                <Text style={styles.description}>Sé tu propio jefe!</Text>
                <View style={{marginBottom: 10}}>
                    <ButtonPrimary
                        title="Iniciar sesión"
                        onPress={() => navigation.push('AuthLogin')}
                    />
                </View>
                <Button
                    title="Regístrate"
                    onPress={() => navigation.push('AuthRegister')}
                    color={Button.Colors.BLACK}
                    border
                />
            </View>
            <View style={{flexGrow: 0}}>
                <Text onPress={() => setDevModalVisible(true)} style={styles.copyright}>Copyright @ PIK Delivery</Text>
            </View>
            <DevConfigModal
                visible={devModalVisible}
                onRequestClose={() => setDevModalVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: PAGE_PADDING,
        flex: 1,
        backgroundColor: 'white',
    },
    title: {
        fontSize: Math.min(25, WINDOW_WIDTH / 15),
        marginBottom: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'black',
    },
    description: {
        textAlign: 'center',
        color: GRAY_LIGHT,
        marginBottom: 20,
    },
    copyright: {
        fontSize: 12,
        lineHeight: 25,
        color: GRAY,
        textAlign: 'center',
    },
    imageContainer: {
        flexGrow: 0,
        padding: 20,
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        // backgroundColor: "gray",
    },
    image: {
        width: '100%',
        // backgroundColor: 'blue',
        flex: 1,
        aspectRatio: 1.4,
    },
});

export default AuthScreen;
