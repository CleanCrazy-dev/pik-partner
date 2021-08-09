import React from 'react';
import PropTypes from 'prop-types';
import {
    TouchableWithoutFeedback,
    StyleSheet,
    View,
    Text,
} from 'react-native';
import {BLUE, COLOR_TERTIARY_ERROR, INPUT_HEIGHT} from '../utils/constants';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import svgs from '../utils/svgs';
import {SvgXml} from 'react-native-svg';

const RadioInput = ({items, value, errorText, vertical, onChange}) => {

    const _onChange = val => {
        onChange && onChange(val);
    };
    return <>
        <View style={[!vertical ? styles.wrapper : {}]}>
            {items.map((item, index) => (
                <TouchableWithoutFeedback key={index} onPress={e => _onChange(item)}>
                    <View style={vertical ? {paddingBottom: 16} : {}}>
                        <View style={styles.item}>
                            {/*<Icon*/}
                            {/*    style={styles.icon}*/}
                            {/*    name={value == item ? 'radio-button-checked' : 'radio-button-unchecked'}*/}
                            {/*    size={20}*/}
                            {/*    color="black"*/}
                            {/*/>*/}
                            <SvgXml width={30} xml={svgs[value == item ? 'icon-radio-on' : 'icon-radio-off']}/>
                            <Text style={styles.title}>{item}</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            ))}
            {/*<Icon name="radio-button-checked" size={30} color="black" />*/}
            {/*<Text style={styles.title}>Female</Text>*/}
        </View>
        {!!errorText && <Text style={styles.errorText}>
            <FontAwesome5 name="exclamation-triangle" style={[styles.errorText]}/>
            <Text>  {errorText}</Text>
        </Text>}
    </>
};

RadioInput.propTypes = {
    items: PropTypes.array,
    value: PropTypes.string,
    onChange: PropTypes.func,
};

const styles = StyleSheet.create({
    wrapper: {
        // height: INPUT_HEIGHT,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    item: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon: {
        marginRight: 2,
    },
    title: {
        marginRight: 25,
    },
    errorText: {
        color: COLOR_TERTIARY_ERROR,
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    }
});

export default RadioInput;
