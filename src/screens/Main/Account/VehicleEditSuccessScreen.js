import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { GRAY_LIGHT, GRAY_LIGHT_EXTRA } from '../../../utils/constants';
import CustomButton from '../../../components/CustomButton';
import { StackActions } from '@react-navigation/native';
import { SvgXml } from 'react-native-svg';
import SvgUri from 'react-native-svg-uri';
import svgs from '../../../utils/svgs';
import FullWidthImage from '../../../components/FullWidthImage';

const VehicleEditSuccessScreen = ({ navigation }) => {
    const done = () => {
        const popAction = StackActions.pop({ n: 2 });
        navigation.dispatch(popAction);
    };
    return <View style={styles.container}>
        <View style={{ flexGrow: 1 }}>
            {/*<SvgUri width={'100%'} source={require('../../../assets/images/img-03.svg')} />*/}
            {/* <SvgXml width={'100%'} xml={svgs['img-03']}/> */}
            <FullWidthImage
                source={svgs['review']}
                aspectRatio={1.3}
            />
            <View style={{ height: 40 }} />
            <Text style={styles.description}>Thank you for information</Text>
            <Text style={styles.description}>We will review it soon and wee will contact you is required for
                approval</Text>
            <Text>{JSON.stringify(navigation.state)}</Text>
        </View>
        <View style={{ flexGrow: 0 }}>
            <CustomButton
                color={CustomButton.Colors.ORANGE}
                onPress={done}
                title={'Done'}
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
    },
});

export default VehicleEditSuccessScreen;
