import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Image,
    View,
    Text,
} from 'react-native';
import {COLOR_PRIMARY_500, ORANGE, WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/constants';

const SPLASH_BG_COLOR = '#f1962a';

const LoadingScreen = ({}) => {
    return <View style={styles.container}>
        <StatusBar backgroundColor={SPLASH_BG_COLOR} barStyle="light-content" />
        <Image
            style={styles.logo}
            source={require('../assets/images/PIK-Partners-logo.png')}
        />
    </View>;
};

const logoSize = Math.min(1345, Math.min(WINDOW_HEIGHT, WINDOW_WIDTH)* 0.6);

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFill,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: SPLASH_BG_COLOR,
    },
    logo: {
        width: logoSize,
        height: logoSize,
        resizeMode: "contain"
    }
});

export default LoadingScreen;
