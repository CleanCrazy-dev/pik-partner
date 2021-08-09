import React,{useState, useEffect} from 'react';
import {
    StyleSheet,
    View,
    Text,
    Animated,
    Alert,
    TouchableOpacity,
} from 'react-native';
import {useAuth} from '../utils/auth';
import {COLOR_PRIMARY_500} from '../utils/constants';
import DriverStatuses from '../../../node-back/src/constants/DriverStatuses';

const DriverAccountStatus = ({}) => {
    const auth = useAuth();
    const {status, message} = auth.user;
    const [animation, setAnimation] = useState(new Animated.Value(0))

    const handleAnimation = () => {
        Animated.timing(animation, {
            toValue:1,
            duration: 600,
            useNativeDriver: false,
        }).start( () => {
            Animated.timing(animation,{
                toValue:0,
                duration: 200,
                useNativeDriver: false,
            }).start(handleAnimation)
        })
    }

    const colorInterpolation =  animation.interpolate({
        inputRange: [0, 1],
        outputRange:[COLOR_PRIMARY_500+"00" , COLOR_PRIMARY_500+"ff"]
    })

    useEffect(() => {
        handleAnimation()
        return () => {
            // Animated.stop(animation)
        }
    }, [animation])

    return (
        status === DriverStatuses.Recheck
            ?
            <TouchableOpacity onPress={() => Alert.alert(status, message?.recheck)}>
                <Animated.Text style={[styles.status, {backgroundColor: colorInterpolation}]}>{status}</Animated.Text>
            </TouchableOpacity>
            :
            <Text style={styles.status}>{status}</Text>
    );
};

const styles = StyleSheet.create({
    status: {
        color: 'white',
        backgroundColor: COLOR_PRIMARY_500,
        fontSize: 10,
        lineHeight: 16,
        borderRadius: 8,
        paddingHorizontal: 5,
    },
});

export default DriverAccountStatus;
