import React, {useEffect, useState} from 'react';
import {
    StyleSheet,
    Animated,
    TouchableOpacity,
    View,
    Text,
} from 'react-native';
import Avatar from './Avatar';
import {COLOR_NEUTRAL_GRAY, COLOR_PRIMARY_900} from '../utils/constants';
import BoxShadow from './BoxShadow';
import {SvgXml} from 'react-native-svg';
import svgs from '../utils/svgs';
import ButtonPrimary from './ButtonPrimary';

const AvailableItem = ({style}) => {
    const [expanded, setExpanded] = useState(false);
    const [maxHeight, setMaxHeight] = useState(0);
    const [animation] = useState(new Animated.Value(0));

    const toggle = () => {
        let initialValue = expanded ? maxHeight : 0,
            finalValue = expanded ? 0 : maxHeight;

        setExpanded(!expanded);

        animation.setValue(initialValue);
        Animated.spring(
            animation,
            {
                toValue: finalValue,
                useNativeDriver: false,
            },
        ).start();
    };

    const _setMaxHeight = (event) => {
        setMaxHeight(event.nativeEvent.layout.height);
    };

    useEffect(() => {
        let initialValue = expanded ? maxHeight : 0;
        animation.setValue(initialValue);
    }, [maxHeight, expanded]);

    return (
        <BoxShadow>
            <View style={{...style, ...styles.container}}>
                <TouchableOpacity onPress={toggle}>
                    <View>
                        <View style={styles.userInfoContainer}>
                            <Avatar border={1} style={styles.avatar} size={32}/>
                            <View style={{flexGrow: 1}}>
                                <Text style={styles.name}>Miami Box</Text>
                                <Text style={styles.description}>San Fransisco, ave 13 sur</Text>
                            </View>
                            <View style={styles.icon}/>
                        </View>
                    </View>
                </TouchableOpacity>
                <Animated.View style={{height: animation}}>
                    <View onLayout={_setMaxHeight} style={{padding: 16, paddingBottom: 24}}>
                        {['a', 'b'].map(item => (
                            <View key={item} style={{position: 'relative'}}>
                                <View style={{height: 24, marginBottom: 8}}>
                                    <View style={styles.flexRow}>
                                        <SvgXml style={styles.itemIcon} width={12} xml={svgs['icon-document']}/>
                                        <Text style={styles.itemName}>Computer Headphone</Text>
                                    </View>
                                </View>
                                <View style={{height: 24, marginBottom: 24}}>
                                    <View style={styles.flexRow}>
                                        <SvgXml style={styles.itemIcon} width={12} xml={svgs['icon-barcode']}/>
                                        <Text style={styles.itemBarcode}>455 126 708</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                        <ButtonPrimary title="GET PACKAGES"/>
                    </View>
                </Animated.View>
            </View>
        </BoxShadow>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 5,
        backgroundColor: 'white',
        overflow: 'hidden',
    },
    userInfoContainer: {
        position: 'relative',
        paddingVertical: 20,
        paddingHorizontal: 16,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        marginRight: 10,
    },
    name: {
        fontWeight: '700',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    description: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
        color: COLOR_NEUTRAL_GRAY,
    },
    icon: {
        flexGrow: 0,
        width: 0,
        height: 0,
        marginTop: 8,
        borderWidth: 8,
        borderTopColor: COLOR_PRIMARY_900,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
        borderRightColor: 'transparent',
    },
    itemName: {
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
        color: COLOR_PRIMARY_900,
    },
    itemBarcode: {
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 24,
        color: COLOR_NEUTRAL_GRAY,
    },
    itemIcon: {
        marginVertical: 'auto',
        marginRight: 18,
    },
    flexRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default AvailableItem;
