import React from 'react';
import {
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    View,
    Text,
} from 'react-native';
import ButtonPrimary from './ButtonPrimary';
import CustomButton from './CustomButton';
import {WINDOW_HEIGHT} from '../utils/constants';
import useComponentSize from '../utils/useComponentSize';

const BottomDrawer = ({offset, children, topButton, onPress}) => {
    const [size, onLayout] = useComponentSize();
    return (
        <View style={[styles.container, styles.shadow]}>
            <TouchableOpacity onPress={() => (onPress && onPress())}>
                <View style={styles.iconWrapper}>
                    <View style={styles.icon}/>
                </View>
            </TouchableOpacity>
            <ScrollView style={{maxHeight: WINDOW_HEIGHT * 0.6, paddingHorizontal: 16}}>
                {children}
            </ScrollView>
            <View style={[styles.topButtonContainer, size? {transform: [{translateY: -size.height/2}]}:{}]}>
                <View onLayout={onLayout}>{topButton}</View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        position: 'absolute',
        width: '100%',
        left: 0,
        bottom: 0,
        paddingBottom: 0,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    iconWrapper: {
        padding: 8,
    },
    icon: {
        // position: 'absolute',
        alignSelf: 'center',
        width: 80,
        height: 6,
        backgroundColor: '#F0EFEF',
        borderRadius: 8,
    },
    shadow: {
        shadowColor: '#CECDCD',
        shadowRadius: 2,
        shadowOpacity: 5,
        elevation: 15,
    },
    topButtonContainer: {
        position: 'absolute',
        top: 0,
        right: 16,
        zIndex: 100000,
    },
});

export default BottomDrawer;
