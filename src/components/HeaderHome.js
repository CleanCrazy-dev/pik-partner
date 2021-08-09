import React from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import {COLOR_NEUTRAL_WHITE, COLOR_PRIMARY_1000, COLOR_PRIMARY_500} from '../utils/constants';
import Avatar from './Avatar';

const HeaderHome = ({navigation}) => {
    return (
        <View style={styles.container}>
            <View style={styles.userContainer}>
                <View>
                    <Text style={styles.hello}>Hello Maria</Text>
                    <Text style={styles.help}>How can we help?</Text>
                </View>
                <Avatar borderColor={COLOR_PRIMARY_1000} size={48}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingVertical: 20,
    },
    userContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
    },
    hello: {
        color: COLOR_PRIMARY_500,
        fontWeight: '600',
        fontSize: 14,
        lineHeight: 24,
    },
    help: {
        color: COLOR_NEUTRAL_WHITE,
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 24,
    },
});

export default HeaderHome;
