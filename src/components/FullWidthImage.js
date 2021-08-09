import React from 'react';
import PropTypes from 'prop-types';
import {
    Image,
    StyleSheet,
    View,
} from 'react-native';

const FullWidthImage = ({source, aspectRatio}) => {
    return (
        <View style={styles.imageContainer}>
            <Image
                style={[styles.image, aspectRatio ? {aspectRatio} : {}]}
                resizeMode={'contain'}
                source={source}
            />
        </View>
    );
};

FullWidthImage.propTypes = {
    aspectRatio: PropTypes.number,
};

const styles = StyleSheet.create({
    imageContainer: {
        flexGrow: 0,
        padding: 20,
        // flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // borderWidth: 1,
        // backgroundColor: "gray",
    },
    image: {
        width: '100%',
        // backgroundColor: 'blue',
        flex: 1,
        aspectRatio: 1,
    },
});

export default FullWidthImage;
