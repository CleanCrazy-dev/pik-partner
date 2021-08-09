import React from 'react'
import {
    TouchableOpacity,
    TouchableWithoutFeedback,
    SafeAreaView,
    StyleSheet,
    Modal,
    View,
    Text
} from 'react-native'
import FullWidthImage from './FullWidthImage';
import { SvgXml } from 'react-native-svg';
import svgs from '../utils/svgs';
import { COLOR_NEUTRAL_GRAY } from '../utils/constants';
import ButtonPrimary from './ButtonPrimary';
import ButtonSecondary from './ButtonSecondary';
import globalStyles from '../utils/globalStyles';

import {useTranslation} from 'react-i18next';

const CancelConfirmModal = ({ visible, onRequestClose, onConfirm, isReturn }) => {
    let {t} = useTranslation()

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onRequestClose}>
            <SafeAreaView style={{ flex: 1 }}>
                <View style={{
                    backgroundColor: "white",
                    flex: 1,
                    padding: 16,
                }}>
                    <View style={{ flexGrow: 1 }}>
                        <FullWidthImage
                            source={svgs['img-04']}
                            aspectRatio={1.4}
                        />
                        <Text style={styles.title}>{isReturn ? t('pages.home.return_order') : 'Cancelar viaje'}</Text>
                        <Text style={styles.description}>{isReturn ? t('pages.home.return_order_affect_profile') : t('pages.home.cancel_order_affect_profile')}</Text>
                        <Text style={styles.description}>
                            {t('pages.home.cancel_description')}
                        </Text>
                    </View>
                    <View style={{ flexGrow: 0 }}>
                        <View style={globalStyles.inputWrapper}>
                            <ButtonPrimary
                                title='Volver al viaje'
                                onPress={() => (onRequestClose && onRequestClose())}
                            />
                        </View>
                        <ButtonSecondary
                            title={isReturn ? t('pages.home.start_return') : 'Confirmar'}
                            onPress={() => (onConfirm && onConfirm())}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </Modal>
    )
}

const styles = StyleSheet.create({
    title: {
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 24,
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 16,
    },
    description: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'center',
        color: COLOR_NEUTRAL_GRAY,
    },
})

export default CancelConfirmModal;
