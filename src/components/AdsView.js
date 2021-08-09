import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
} from 'react-native';
import {GRADIENT_2, GRADIENT_7} from '../utils/constants';
import GradientView from './GradientView';

const AdsView = ({}) => {
    return (
        <View style={styles.container}>
            <Image
                style={styles.image}
                source={require('../assets/images/ads-01.png')}
                resizeMode="contain"
            />
            <GradientView
                style={styles.gradient}
                gradient={GRADIENT_7}
            />
            <View style={StyleSheet.absoluteFill}>
                <View style={{height: 32}}>
                    <View style={styles.offContainer}>
                        <GradientView style={{borderBottomLeftRadius: 8}} gradient={GRADIENT_2}>
                            <Text style={styles.offText}>-10%</Text>
                        </GradientView>
                    </View>
                </View>
                <Text style={styles.title}>Can't find what are you looking for?</Text>
                <Text style={styles.description}>
                    Lorem ipsum dolor sit amet, consectetur adipiscingelit.
                    Aliquam, nisl nisl cursus dignissim.
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        // borderWidth: 1,
        borderRadius: 8,
        overflow: 'hidden',
        height: 184,
    },
    image: {
        width: '100%',
    },
    gradient: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
    },
    offContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    offText: {
        lineHeight: 32,
        color: 'white',
        paddingHorizontal: 17,
    },
    title: {
        color: 'white',
        fontWeight: '800',
        fontSize: 24,
        lineHeight: 28,
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    description: {
        color: 'white',
        paddingHorizontal: 16,
        fontWeight: '500',
        lineHeight: 24,
        fontSize: 14,
    },
});

export default AdsView;
