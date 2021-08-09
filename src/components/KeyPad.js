import React from 'react'
import {
    TouchableWithoutFeedback,
    TouchableNativeFeedback,
    View,
    Text, StyleSheet,
} from 'react-native';
import {GRAY, WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/constants';


const KEY_SIZE = Math.max(
    80,
    (Math.min(WINDOW_WIDTH, WINDOW_HEIGHT)-6*16) / 3
)

const Key = React.memo(({onPress, children, small}) => {
    return <TouchableNativeFeedback onPress={onPress}>
        <View style={styles.key}>
            <Text style={small ? styles.keyTextSmall : styles.keyText}>{children}</Text>
        </View>
    </TouchableNativeFeedback>
})

const KeyPad = ({onKeyPress}) => {
    return <View>
        <View>
            <View style={styles.keyRow}>
                <Key onPress={() => onKeyPress('7')}>7</Key>
                <Key onPress={() => onKeyPress('8')}>8</Key>
                <Key onPress={() => onKeyPress('9')}>9</Key>
            </View>
        </View>
        <View>
            <View style={styles.keyRow}>
                <Key onPress={() => onKeyPress('4')}>4</Key>
                <Key onPress={() => onKeyPress('5')}>5</Key>
                <Key onPress={() => onKeyPress('6')}>6</Key>
            </View>
        </View>
        <View>
            <View style={styles.keyRow}>
                <Key onPress={() => onKeyPress('1')}>1</Key>
                <Key onPress={() => onKeyPress('2')}>2</Key>
                <Key onPress={() => onKeyPress('3')}>3</Key>
            </View>
        </View>
        <View>
            <View style={styles.keyRow}>
                <Key onPress={() => onKeyPress('clear')} small>{"<"}</Key>
                <Key onPress={() => onKeyPress('0')}>0</Key>
                <Key onPress={() => onKeyPress('ok')} small>OK</Key>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
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
    },
    keyTextSmall:{
        color: 'white',
        fontWeight: '700',
        fontSize: 30,
    },
})

export default React.memo(KeyPad);
