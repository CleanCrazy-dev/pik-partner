import React from 'react';
import CustomButton from './CustomButton';

const ButtonSecondary = ({title, onPress}) => {
    return <CustomButton
        title={title}
        onPress={onPress}
        color={CustomButton.Colors.BLACK}
        border
    />;
};

export default ButtonSecondary;
