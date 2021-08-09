import React, { useMemo } from 'react';
import {
    StyleSheet,
    View,
    Text,
} from 'react-native';
import { COLOR_PRIMARY_900, GRAY_LIGHT, GRAY_LIGHT_EXTRA } from '../../utils/constants';
import ButtonPrimary from '../../components/ButtonPrimary';
import { useAuth } from '../../utils/auth';
import { SvgXml } from 'react-native-svg';
import svgs from '../../utils/svgs';
import DriverStatuses from '../../../../node-back/src/constants/DriverStatuses';
import FullWidthImage from '../../components/FullWidthImage';

const DocumentAlertScreen = ({ navigation }) => {
    let auth = useAuth();
    let { status, message } = auth.user;

    let alert = useMemo(() => {
        switch (status) {
            // case DriverStatuses.Pending: return {
            //     title: 'Waiting',
            //     message: ''
            // }
            case DriverStatuses.InReview: return {
                title: 'Documents In Review',
                message: 'Your Documents is in review\nIts may take a while'
            }
            case DriverStatuses.Recheck: return {
                title: 'Revisa tus documentos',
                message: 'Si necesitas ayuda envíanos un email a\n partners@pikdelivery.com'
            }
            case DriverStatuses.Rejected: return {
                title: 'LO SENTIMOS',
                message: message.reject + '\nTus documentos han sido rechazados.\nSi tienes alguna pregunta, escríbenos a partners@pikdelivery.com'
            }
        }
    }, [auth.user])

    const canGoAhead = () => {
        let sList = [
            // DriverStatuses.Pending,
            DriverStatuses.InReview,
            DriverStatuses.Recheck,
        ]
        return sList.includes(status);
    }

    return <View style={styles.container}>
        <View style={{ flexGrow: 1 }}>
            {/*<SvgUri width={'100%'} source={require('../../assets/images/img-03.svg')} />*/}
            {/* <SvgXml width={'100%'} xml={svgs.review}/> */}
            <FullWidthImage
                source={svgs['validate']}
                aspectRatio={1.3}
            />
            <Text style={styles.title}>{alert?.title}</Text>
            <Text style={styles.description}>{alert?.message}</Text>
        </View>
        {canGoAhead() && <View style={{ flexGrow: 0 }}>
            <ButtonPrimary
                onPress={() => navigation.navigate('PersonalDetailDocumentsScreen')}
                title={'Ok'}
            />
        </View>}
    </View>;
};

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flex: 1,
    },
    title: {
        color: COLOR_PRIMARY_900,
        textAlign: 'center',
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 24,
        marginTop: 40,
        marginBottom: 20,
    },
    description: {
        textAlign: 'center',
        color: GRAY_LIGHT,
        fontSize: 16,
        lineHeight: 24,
    },
});

export default DocumentAlertScreen;
