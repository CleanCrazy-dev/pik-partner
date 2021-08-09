import React, {useState} from 'react';
import {
    TouchableOpacity,
    StyleSheet,
    Image,
    View,
    Text, TouchableWithoutFeedback,
} from 'react-native';
import DropShadow from 'react-native-drop-shadow';
import MapView from 'react-native-maps';
import {useAuth} from '../../utils/auth';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_900, COLOR_TERTIARY_SUCCESS} from '../../utils/constants';
import KeyboardAvoidingScreen from '../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../components/PageContainerDark';
import Header from '../../components/HeaderHome';
import AdsView from '../../components/AdsView';
import {SvgXml} from 'react-native-svg';
import svgs from '../../utils/svgs';
import BoxShadow from '../../components/BoxShadow';
import AvailableItem from '../../components/AvailableItem';

const CustomerHomeScreen = ({navigation}) => {
    const auth = useAuth();
    const [isOnline, setIsOnline] = useState(false);

    return (

        <KeyboardAvoidingScreen>
            <PageContainerDark
                Header={<Header navigation={navigation}/>}
            >
                <BoxShadow opacity={0.4}>
                    <AdsView/>
                </BoxShadow>
                <Text style={styles.headline}>Actions</Text>
                <View>
                    <View style={styles.actionsRow}>
                        <BoxShadow style={{flexGrow: 1}}>
                            <View style={styles.actionBox}>
                                <SvgXml width={40} height={44} xml={svgs['icon-package-closed']}/>
                                <Text style={styles.actionTitle}>Send Package</Text>
                            </View>
                        </BoxShadow>
                        <View style={{width: 16}}/>
                        <BoxShadow style={{flexGrow: 1}}>
                            <View style={styles.actionBox}>
                                <SvgXml width={44} height={40} xml={svgs['icon-package-open']}/>
                                <Text style={styles.actionTitle}>Request Package</Text>
                            </View>
                        </BoxShadow>
                    </View>
                </View>
                <Text style={styles.headline}>Availables</Text>
                <AvailableItem style={{marginBottom: 16}}/>
                <AvailableItem style={{marginBottom: 16}}/>
                <AvailableItem/>
            </PageContainerDark>
        </KeyboardAvoidingScreen>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 40,
    },
    headline: {
        fontWeight: '700',
        fontSize: 18,
        lineHeight: 24,
        marginTop: 24,
        marginBottom: 16,
    },
    actionsRow: {
        flex: 1,
        flexDirection: 'row',
    },
    actionBox: {
        flexGrow: 1,
        // flexShrink: 1,
        padding: 16,
        // borderWidth: 1,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    actionTitle: {
        fontWeight: '500',
        fontSize: 16,
        lineHeight: 24,
        marginTop: 12,
    },
});

export default CustomerHomeScreen;
