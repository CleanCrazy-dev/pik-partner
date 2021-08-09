import React, {useState} from 'react'
import {StyleSheet, View, TextInput,} from 'react-native'
import {INPUT_HEIGHT} from '../utils/constants';

const TextInput2 = ({
    value,
    iconRight,
    iconLeft,
    style,
    inputStyle,
    onChange,
    placeholderTextColor,
    onChangeText,
    ...rest
}) => {
    const _onChange = (ev) => {
        onChange && onChange(ev);
    }

    const _onChangeText = (text) => {
        onChangeText && onChangeText(text);
    }

    return (
        <View>
            <View style={[styles.wrapper, style]}>
                {iconLeft && iconLeft}
                <TextInput
                    value={value}
                    placeholderTextColor={placeholderTextColor}
                    onChange={_onChange}
                    onChangeText={_onChangeText}
                    style={[styles.input, inputStyle]}
                    underlineColorAndroid="transparent"
                    autoCapitalize='none'
                    autoCorrect={false}
                    {...rest}
                />
                {iconRight && iconRight}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapper:{
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: 8,
        borderRadius: 8,
        overflow: 'hidden',
        backgroundColor: 'white',
    },
    input: {
        flexGrow: 1,
        borderWidth: 0,
        padding: 0,
        height: INPUT_HEIGHT,
        lineHeight: INPUT_HEIGHT,
    }
})

export default TextInput2;
