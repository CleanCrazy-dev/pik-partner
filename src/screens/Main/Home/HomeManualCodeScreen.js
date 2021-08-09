import React, {useState, memo} from 'react'
import {
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    View,
    Text, StatusBar,
} from 'react-native';
import KeyboardAvoidingScreen from '../../../components/KeyboardAvoidingScreen';
import PageContainerDark from '../../../components/PageContainerDark';
import HeaderPage from '../../../components/HeaderPage';
import CustomAnimatedInput from '../../../components/CustomAnimatedInput';
import TextInput2 from '../../../components/TextInput2';
import {COLOR_NEUTRAL_GRAY, GRAY, WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/constants';
import KeyPad from '../../../components/KeyPad';
import PageContainerLight from '../../../components/PageContainerLight';

import {useTranslation} from 'react-i18next';

const HomeManualCodeScreen = ({navigation, route}) => {
    let {t} = useTranslation()

    let [code, setCode] = useState('')

    const onKeyPress = key => {
        if(key === 'clear') {
            setCode(code.substr(0, code.length - 1))
        }
        else if(key === 'ok'){
            route?.params?.setCode && route.params.setCode(code)
            navigation.goBack()
        }
        else {
            setCode(code + key)
        }
    }

    return (
        <KeyboardAvoidingScreen>
            <PageContainerLight
                contentWrapperStyle={{backgroundColor: 'black'}}
                contentStyle={styles.pageContainer}
            >
                <StatusBar translucent backgroundColor="transparent"/>
                <View
                    style={{
                        // flex: 1,
                        // flexGrow: 1,
                        paddingTop: StatusBar.currentHeight,
                        width: '100%',
                        minHeight: '100%',
                        backgroundColor: 'black',
                    }}
                >
                    <View style={{flex: 1, paddingHorizontal: 16}}>
                        <HeaderPage color="transparent" title={t('pages.home.enter_manual_code')} />
                        <TextInput2
                            value={code}
                            placeholder={t('pages.home.type')}
                            placeholderTextColor={GRAY}
                            style={{backgroundColor: 'transparent', marginVertical: 32}}
                            inputStyle={{color: "white", fontSize: 40}}
                            iconRight={<ActivityIndicator color="white" size='large'/>}
                        />
                        <KeyPad onKeyPress={onKeyPress}/>
                    </View>
                </View>
            </PageContainerLight>
        </KeyboardAvoidingScreen>
    )
}

const KEY_SIZE = Math.max(
    80,
    (Math.min(WINDOW_WIDTH, WINDOW_HEIGHT)-6*16) / 3
)

const styles = StyleSheet.create({
    pageContainer:{
        marginTop: 0,
        paddingTop: 0,
        borderTopRightRadius: 0,
        borderTopLeftRadius: 0,
        padding: 0,
        backgroundColor: 'black',
    },
    keyRow:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    key: {
        backgroundColor: GRAY,
        width: KEY_SIZE,
        height: KEY_SIZE,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
    },
    keyText:{
        color: 'white',
        fontWeight: '700',
        fontSize: 60,
    }
})

export default HomeManualCodeScreen;
