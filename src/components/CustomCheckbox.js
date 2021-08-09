import React from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {COLOR_TERTIARY_ERROR, INPUT_HEIGHT} from '../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const CustomCheckbox = ({children, errorText, ...props}) => {
    return <View style={styles.wrapper}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center'}}>
            <CheckBox style={styles.checkbox} {...props}/>
            <View style={{flexGrow: 1}}>{children}</View>
        </View>
        {!!errorText && <Text style={styles.errorText}>
            <FontAwesome5 name="exclamation-triangle" style={[styles.errorText]}/>
            <Text>  {errorText}</Text>
        </Text>}
    </View>;
};

const styles = StyleSheet.create({
    wrapper: {
        minHeight: INPUT_HEIGHT,
    },
    checkbox: {
        flexGrow: 0,
        marginLeft: -8,
        marginRight: 8,
    },
    errorText: {
        color: COLOR_TERTIARY_ERROR,
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    }
});

export default CustomCheckbox;
