import React from 'react';
import {Picker} from '@react-native-community/picker';
import {
    StyleSheet, Text,
    View,
} from 'react-native';
import {
    COLOR_PRIMARY_500,
    COLOR_PRIMARY_900,
    COLOR_TERTIARY_ERROR,
    GRAY_LIGHT,
    GRAY_LIGHT_EXTRA,
    INPUT_HEIGHT,
} from '../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

import {useTranslation} from 'react-i18next';

const pickerStyle = {
    inputIOS: {
        color: 'white',
        paddingTop: 13,
        paddingHorizontal: 10,
        paddingBottom: 12,
        height: INPUT_HEIGHT,
    },
    inputAndroid: {
        color: 'white',
        height: INPUT_HEIGHT,
    },
    placeholderColor: 'white',
    underline: {borderTopWidth: 0},
    icon: {
        position: 'absolute',
        backgroundColor: 'transparent',
        borderTopWidth: 5,
        borderTopColor: '#00000099',
        borderRightWidth: 5,
        borderRightColor: 'transparent',
        borderLeftWidth: 5,
        borderLeftColor: 'transparent',
        width: 0,
        height: 0,
        top: 20,
        right: 15,
    },
};

const CustomPicker = ({selectedValue, onValueChange, items, placeholder, getLabel, getValue, errorText}) => {
    let {t} = useTranslation()
    
    return <React.Fragment>
        <View style={[styles.wrapper, !!errorText ? styles.hasError : {}]}>
            <Picker
                placeholder={placeholder}
                selectedValue={selectedValue}
                onValueChange={onValueChange}
            >
                <Picker.Item color={GRAY_LIGHT} label={placeholder} value={null}/>
                {items.map((item, index) => (
                    <Picker.Item
                        color={COLOR_PRIMARY_900}
                        key={index}
                        label={getLabel ? getLabel(item) : (item.title || item)}
                        value={getValue ? getValue(item) : (item.value || item)}
                    />
                ))}
            </Picker>
        </View>
        {!!errorText && <Text style={styles.errorText}>
            <FontAwesome5 name="exclamation-triangle" style={[styles.errorText]}/>
            <Text>  {errorText}</Text>
        </Text>}
    </React.Fragment>
};

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: GRAY_LIGHT_EXTRA,
        height: INPUT_HEIGHT,
        borderRadius: 5,
        justifyContent: 'center',
        paddingHorizontal: 8,
    },
    hasError:{
        borderWidth: 1,
        borderColor: COLOR_TERTIARY_ERROR,
    },
    errorText: {
        color: COLOR_TERTIARY_ERROR,
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    }
});

export default CustomPicker;
