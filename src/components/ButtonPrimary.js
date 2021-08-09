import React from 'react';
import PropTypes from 'prop-types';
import {} from 'react-native';
import GradientButton from './GradientButton';
import {GRADIENT_2} from '../utils/constants';

const ButtonPrimary = ({title, size, onPress, inProgress, disabled, ...props}) => {
    return (
        <GradientButton
            {...props}
            title={title}
            onPress={onPress}
            inProgress={inProgress}
            disabled={disabled}
            gradient={GRADIENT_2}
        />
    );
};
ButtonPrimary.propTypes = {
    title: PropTypes.string,
    size: PropTypes.oneOf(['lg', 'sm']),
    onPress: PropTypes.func,
};
ButtonPrimary.defaultProps = {
    title: 'Button',
    size: 'lg',
    onPress: () => {
    },
};

export default ButtonPrimary;
