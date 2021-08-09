import React from 'react'
import {
    TouchableOpacity,
    StyleSheet,
    View,
    Text
} from 'react-native'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import GradientView from './GradientView';
import {GRADIENT_2} from '../utils/constants';
import globalStyles from '../utils/globalStyles';

import {useTranslation} from 'react-i18next';

const NavigationButton = ({onPress}) => {
    let {t} = useTranslation()

    return (
        <TouchableOpacity onPress={onPress}>
            <GradientView style={styles.container} gradient={GRADIENT_2}>
                <View style={globalStyles.flexRowCenter}>
                    <MaterialIcons style={styles.icon} name="navigation"/>
                    <Text style={styles.title}>{t('pages.home.NAVIGATE')}</Text>
                </View>
            </GradientView>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 8,
        borderRadius: 16,
    },
    icon: {
        color: 'white',
        fontSize: 16,
        marginRight: 8,
    },
    title: {
        color: 'white',
        fontSize: 14,
        lineHeight: 32,
    }
})

export default NavigationButton
