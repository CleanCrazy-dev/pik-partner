import React, { useState, useRef, useEffect, useMemo } from 'react';
import { connect } from 'react-redux'
import getCurrentPosition from '../../../utils/getCurrentPosition';
import {
    StyleSheet,
    Alert,
    View,
    Text,
    Vibration,
    TouchableOpacity,
    Image,
    Platform,
    PermissionsAndroid
} from 'react-native';
import MapView from 'react-native-maps';
import { useAuth } from '../../../utils/auth';
import OnlineOfflineBtn from '../../../components/OnlineOfflineBtn';
import BottomDrawer from '../../../components/BottomDrawer';
import SubmenuPending from '../../../components/Submenu/SubmenuPending';
import Api from '../../../utils/api';
import globalStyles from '../../../utils/styles';
import { OrderStatuses, DriverStatuses, GRADIENT_2, WINDOW_HEIGHT } from '../../../utils/constants';
import SubmenuProgress from '../../../components/Submenu/SubmenuProgress';
import { SvgXml } from 'react-native-svg';
import svgs from '../../../utils/svgs';
import useAsyncStorage from '../../../utils/useAsyncStorage';
import SubmenuReturn from '../../../components/Submenu/SubmenuReturn';
import {
    setCurrentOrder as setCurrentOrderAction,
    setLocationAvailable,
    reloadCurrentOrder as reloadCurrentOrderAction,
} from '../../../redux/actions/appActions'
import MapDirection from '../../../components/MapDirection';
import ButtonPrimary from '../../../components/ButtonPrimary';
import BoxShadow from '../../../components/BoxShadow';
import GradientView from '../../../components/GradientView';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MapDirectionInfo from '../../../components/MapDirectionInfo';
import NavigationButton from '../../../components/NavigationButton';
import openNavigation from '../../../utils/openNavigation';
import GestureRecognizer from '../../../components/GestureRecognizer';
import MapCenterButton from '../../../components/MapCenterButton';
import ProgressModal from '../../../components/ProgressModal';
import SoundPlayer from 'react-native-sound-player';
import RNAndroidInstalledApps from 'react-native-android-installed-apps-categories'

import { useTranslation } from 'react-i18next';
import BackgroundTimer from 'react-native-background-timer';


const HomeMainScreen = ({ navigation, ...props }) => {
    let { t } = useTranslation()

    const auth = useAuth();
    // const [order, setOrder] = useState(null);
    const { order, setOrder, reloadCurrentOrder } = props;
    const [submenuCollapsed, setSubmenuCollapsed] = useState(false)
    const [mapView, setMapView] = useState(null)
    const { currentLocation, locationAvailable } = props
    const [pickupDirection, setPickupDirection] = useState(null)
    const [deliveryDirection, setDeliveryDirection] = useState(null)
    const [returnDirection, setReturnDirection] = useState(null)
    const [directionInfo, setDirectionInfo] = useState(null)
    const [ignoreList, setIgnoreList] = useAsyncStorage('job-ignore-list', useState({}))
    const [cancelInProgress, setCancelInProgress] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState(0);
    const [firstAlarm, setFirstAlarm] = useState(true);
    const [showNavigationMap, setShowNavigationMap] = useState(false);
    const [mapList, setMapList] = useState([]);
    const [openMap, setOpenMap] = useState('Google');
    let [region, setRegion] = useState({
        latitude: 8.985936,
        longitude: -79.518217,
        latitudeDelta: 0.5,
        longitudeDelta: 0.5,
    })

    const onAssignDriver = () => {
        setCurrentOrderId(order.id);
        Api.Driver.assignDriver(order._id)
            .then(({ success, order, message }) => {
                if (success) {
                    setSubmenuCollapsed(true)
                    setOrder(order);
                }
                else {
                    Alert.alert("Attention", message || 'Somethings went wrong');
                }
            })
    }

    const onPickupArrive = () => {
        setCurrentOrderId(order.id);
        if (order.senderModel === 'Business') {
            navigation.navigate('MainHomePickup')
        }
        else {
            Api.Driver.setPickupArrived(order._id)
                .then(({ success, order, message }) => {
                    if (success) {
                        setOrder(order);
                    }
                    else {
                        Alert.alert("Error", message || 'Somethings went wrong');
                    }
                })
        }
    }

    const onPickupComplete = () => {
        setCurrentOrderId(order.id);
        if (order.senderModel === 'business') {
            navigation.navigate('MainHomePickup', { order, setOrder })
        }
        else {
            Api.Driver.setPickupComplete(order._id)
                .then(({ success, order, message }) => {
                    if (success) {
                        setOrder(order);
                    }
                    else {
                        Alert.alert("Error", message || 'Somethings went wrong');
                    }
                })
        }
    }

    const onDeliveryArrive = () => {
        setCurrentOrderId(order.id);
        if (order.senderModel === 'Business') {
            navigation.navigate('MainHomePickup')
        }
        else {
            Api.Driver.setDeliveryArrived(order._id)
                .then(({ success, order, message }) => {
                    if (success) {
                        setOrder(order);
                    }
                    else {
                        Alert.alert("Error", message || 'Somethings went wrong');
                    }
                })
        }
    }

    const onDeliveryComplete = () => {
        setCurrentOrderId(order.id);
        navigation.navigate('MainCompleteDelivery', { order, setOrder })
    }

    const onReturnComplete = () => {
        setCurrentOrderId(order.id);
        navigation.navigate('MainCompleteDelivery', { order, setOrder, isReturn: true })
    }

    const onOrderCancel = (customerNoShow, cancelingReason) => {
        setCurrentOrderId(0);
        setCancelInProgress(true)
        Api.Driver.cancelOrder(order._id, customerNoShow, cancelingReason)
            .then(({ success, order: newOrder, message }) => {
                if (success) {
                    if (newOrder.status === "Returned") {
                        setOrder(newOrder)
                    }
                    else {
                        // Alert.alert(t('general.Success'), t('pages.home.delivery_canceled_by_you'))
                        setOrder(null);
                    }
                }
                else {
                    Alert.alert("Error", message || 'Somethings went wrong');
                }
            })
            .catch(() => { })
            .then(() => {
                setCancelInProgress(false)
            })
    }

    const onSuggestIgnore = () => {
        setCurrentOrderId(0);
        Api.Driver.ignoreSuggest(order._id)
            .then(({ success, message }) => {
                if (success) {
                    setOrder(null);
                }
                else {
                    Alert.alert("Error", message || 'Somethings went wrong');
                }
            })
    }

    const renderOrderSubmenu = () => {
        if (!order) {
            return null;
        }
        if (order.status === OrderStatuses.Pending) {
            return (
                <SubmenuPending
                    onAccept={onAssignDriver}
                    onIgnore={onSuggestIgnore}
                    order={order}
                    collapsed={submenuCollapsed}
                />
            );
        }
        else if (order.status === OrderStatuses.Progress) {
            return (
                <SubmenuProgress
                    order={order}
                    onPickupArrive={onPickupArrive}
                    onPickupComplete={onPickupComplete}
                    onDeliveryArrive={onDeliveryArrive}
                    onDeliveryComplete={onDeliveryComplete}
                    onCancel={onOrderCancel}
                    collapsed={submenuCollapsed}
                />
            );
        }
        else if (order.status === OrderStatuses.Returning || order.status === OrderStatuses.Returned) {
            return (
                <SubmenuReturn
                    order={order}
                    onReturnComplete={onReturnComplete}
                    collapsed={submenuCollapsed}
                />
            );
        }
        else {
            return null;
        }
    };

    useEffect(() => {
        if (!order?.direction?.routes || !mapView)
            return;
        let { northeast: ne, southwest: sw } = order.direction.routes[0].bounds;
        let directionRegion = {
            latitude: (ne.lat + sw.lat) / 2,
            longitude: (ne.lng + sw.lng) / 2,
            latitudeDelta: Math.abs(ne.lat - sw.lat) * 1.5,
            longitudeDelta: Math.abs(ne.lng - sw.lng) * 1.5,
        }
        mapView.animateToRegion(directionRegion);
    }, [order, mapView])

    // useEffect(() => {
    //     reloadCurrentOrder();
    // }, [auth.user.online, locationAvailable]);

    useEffect(() => {
        BackgroundTimer.runBackgroundTimer(() => {
            reloadCurrentOrder();
        }, 8500);
        return () => {
            BackgroundTimer.stopBackgroundTimer();
        };
    }, [auth.user.online, locationAvailable]);

    let navigationType = useMemo(() => {
        if (
            !order
            || !['Returning', 'Progress'].includes(order?.status)
        ) {
            return '';
        }

        if (order.status === 'Progress') {
            return !order?.time?.pickupComplete ? 'pickup' : 'delivery'
        }
        else {
            return 'return'
        }
    }, [order?.status, JSON.stringify(order?.time)])

    useEffect(() => {
        if (!navigationType) {
            if (!!pickupDirection)
                setPickupDirection(null)
            if (!!deliveryDirection)
                setDeliveryDirection(null)
            if (!!returnDirection)
                setReturnDirection(null)
            return;
        }

        if (navigationType === 'pickup') {
            getPickupDirection()
        }
        else if (navigationType === 'delivery') {
            getDeliveryDirection()
        }
        else if (navigationType === 'return') {
            getReturnDirection()
        }
    }, [navigationType, JSON.stringify(currentLocation), locationAvailable])

    function getPickupDirection() {
        if (!!pickupDirection || !currentLocation)
            return;
        Api.Driver.getOrderDirection('pickup', order._id, currentLocation)
            .then(({ success, direction }) => {
                setPickupDirection(direction)
            })
    }

    function getDeliveryDirection() {
        if (!!deliveryDirection || !currentLocation)
            return;
        Api.Driver.getOrderDirection('delivery', order._id, currentLocation)
            .then(({ success, direction }) => {
                setDeliveryDirection(direction)
            })
    }

    function getReturnDirection() {
        if (!!returnDirection || !currentLocation)
            return;
        Api.Driver.getOrderDirection('pickup', order._id, currentLocation)
            .then(({ success, direction }) => {
                setReturnDirection(direction)
            })
    }

    useEffect(() => {
        if (!navigationDirection || !directionInfo || !currentLocation)
            return;
        let trackingData = {
            headingTo: navigationType,
            timeToArrive: directionInfo.duration.value,
            location: {
                latitude: currentLocation.coords.latitude,
                longitude: currentLocation.coords.longitude,
            }
        }
        Api.Driver.putOrderTrack(order._id, trackingData)
            .then(({ success, message }) => {
                // if(!success)
                // console.log({
                //     method: 'PUT_ORDER_TRACK',
                //     response: { success, message }
                // })
            })
            .catch(console.error)
    }, [navigationDirection, directionInfo])

    const subAlert = useMemo(() => {
        if (!locationAvailable)
            return { style: globalStyles.alertDanger, message: t('pages.home.gps_off') }
        if (auth.user.status === DriverStatuses.InReview)
            return { style: globalStyles.alertWarning, message: t('pages.home.document_in_review') }
        if (!auth.user.online)
            return { style: globalStyles.alertWarning, message: t('pages.home.status_off') }
        return null;
    }, [auth, locationAvailable])

    useEffect(() => {
        if (!mapView)
            return;
        getCurrentPosition()
            .then(info => {
                let userRegion = {
                    latitude: info?.coords?.latitude,
                    longitude: info?.coords?.longitude,
                    latitudeDelta: 0.008,
                    longitudeDelta: 0.008,
                }
                setRegion(userRegion)

                mapView.animateToRegion(userRegion, 100);
            })
            .catch(() => { })
    }, [mapView])

    useEffect(async () => {
        setMapList([]);
        if (Platform.OS === 'android') {
            RNAndroidInstalledApps.getApps()
                .then((apps) => {
                    if (apps.length > 0) {
                        apps.map(app => {
                            switch (app.packageName) {
                                case 'com.google.android.apps.maps':
                                    setMapList(oldArray => [...oldArray, 'Google']);
                                    break;
                                case 'com.waze':
                                    setMapList(oldArray => [...oldArray, 'Waze']);
                                    break;
                            }
                        })
                    }
                })
                .catch((error) => {
                })
        }
        if (Platform.OS === 'ios') { }

    }, []);

    const startNavigate = () => {
        if (mapList.length > 1) {
            setOpenMap(mapList[0]);
            setSubmenuCollapsed(true);
            setShowNavigationMap(true);
        }
        else if (mapList.length == 1) {
            setOpenMap(mapList[0]);

            navigationDirection && showMap(navigationDirection, mapList[0]);
        }

    }

    const showMap = (direction, openMapName) => {
        const data = {
            origin: {
                latitude: direction.routes[0].legs[0].start_location.lat,
                longitude: direction.routes[0].legs[0].start_location.lng
            },
            destination: {
                latitude: direction.routes[0].legs[0].end_location.lat,
                longitude: direction.routes[0].legs[0].end_location.lng
            },
            params: [
                {
                    key: "travelmode",
                    value: "driving"        // may be "walking", "bicycling" or "transit" as well
                },
                {
                    key: "dir_action",
                    value: "navigate"       // this instantly initializes navigation using the given travel mode
                }
            ],
            // waypoints: [
            //     {
            //         latitude: -33.8600025,
            //         longitude: 18.697452
            //     },
            //     {
            //         latitude: -33.8600026,
            //         longitude: 18.697453
            //     },
            //     {
            //         latitude: -33.8600036,
            //         longitude: 18.697493
            //     }
            // ]
        }

        openNavigation(data, openMapName)
    }
    const navigationDirection = useMemo(() => {
        switch (navigationType) {
            case 'pickup': return pickupDirection;
            case 'delivery': return deliveryDirection;
            case 'return': return returnDirection;
            default: return null;
        }
    }, [navigationType, pickupDirection, deliveryDirection, returnDirection])

    const moveToMyLocation = () => {
        if (!mapView || !locationAvailable || !currentLocation)
            return;

        let userRegion = {
            latitude: currentLocation?.coords?.latitude,
            longitude: currentLocation?.coords?.longitude,
            latitudeDelta: 0.008,
            longitudeDelta: 0.008,
        }
        setRegion(userRegion)

        mapView.animateToRegion(userRegion, 200);
    }
    useEffect(() => {
        function alarmFunction() {
            Vibration.vibrate([500, 1000, 500]);

            try {
                // play the file tone.mp3
                SoundPlayer.playSoundFile('tone', 'mp3');
            } catch (e) {
                console.log(`cannot play the sound file`, e);
            }

        };

        if (!subAlert && auth.user.online && order != null && (currentOrderId != order.id) && (((order.status == 'Created') || (order.status == 'Pending')) && (!order.time.pickupComplete))) {
            const alarmTimerHandler = setInterval(() => { alarmFunction(); }, 7000);
            if (firstAlarm == true) {
                alarmFunction();
                setFirstAlarm(false);
            }
            return () => { clearInterval(alarmTimerHandler); setFirstAlarm(true); };
        }
    }, [subAlert, auth.user.online, currentOrderId, order]);
    return <View styles={styles.container}>
        {showNavigationMap && (
            <TouchableOpacity style={styles.navigationMapBack} activeOpacity={1} onPress={() => { setShowNavigationMap(false); }}>
            </TouchableOpacity>
        )}
        {showNavigationMap && navigationDirection && (
            <View style={styles.navigationMap}>
                {mapList.map((item, index) => {
                    switch (item) {
                        case 'Google':
                            return (
                                <TouchableOpacity key={index} onPress={() => { setOpenMap('Google'); showMap(navigationDirection, 'Google'); setShowNavigationMap(false); }} style={[(index == mapList.length - 1) ? styles.navigationMapItemLast : styles.navigationMapItem, (openMap == 'Google') && { backgroundColor: '#00000015' }]}>
                                    <Image style={{ width: 50, height: 50 }} source={require('../../../assets/images/googleMapsIcon.png')} />
                                    <Text style={styles.navigationMapItemText}>Google Maps</Text>
                                </TouchableOpacity>
                            )
                        case 'Waze':
                            return (
                                <TouchableOpacity key={index} onPress={() => { setOpenMap('Waze'); showMap(navigationDirection, 'Waze'); setShowNavigationMap(false); }} style={[(index == mapList.length - 1) ? styles.navigationMapItemLast : styles.navigationMapItem, (openMap == 'Waze') && { backgroundColor: '#00000015' }]}>
                                    <Image style={{ width: 50, height: 50 }} source={require('../../../assets/images/wazeIcon.png')} />
                                    <Text style={styles.navigationMapItemText}>Waze</Text>
                                </TouchableOpacity>
                            )
                    }
                })}
                {/* <TouchableOpacity onPress={() => { setShowNavigationMap(false); showMap(navigationDirection); }} style={styles.navigationMapOpen}>
                    <Text style={styles.navigationMapOpenText}>Open</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setShowNavigationMap(false); }} style={styles.navigationMapClose}>
                    <Text style={styles.navigationMapCloseText}>Close</Text>
                </TouchableOpacity> */}
            </View>
        )}
        <MapView
            ref={setMapView}
            style={styles.map}
            initialRegion={region}
            showsUserLocation={false}
            showsMyLocationButton={false}
            zoomControlEnabled={false}
            userLocationPriority={"low"}
        // showsUserLocation={true}
        >
            {(!!order && !navigationType) && (
                <MapDirection
                    direction={order?.direction}
                    startMarker={(
                        <SvgXml
                            // onLayout={onMarkerLayout}
                            size={32}
                            xml={svgs['map-marker-home']}
                        />
                    )}
                    endMarker={(
                        <SvgXml
                            // onLayout={onMarkerLayout}
                            size={32}
                            xml={svgs['map-marker-destination']}
                        />
                    )}
                />
            )}
            {!!navigationDirection && (
                <MapDirection
                    direction={navigationDirection}
                    endMarker={(
                        <SvgXml
                            // onLayout={onMarkerLayout}
                            size={32}
                            xml={svgs[`map-marker-${navigationType === 'delivery' ? 'destination' : 'home'}`]}
                        />
                    )}
                />
            )}
            {!!currentLocation && locationAvailable && (
                <MapView.Marker
                    coordinate={{
                        latitude: currentLocation.coords.latitude,
                        longitude: currentLocation.coords.longitude,
                    }}
                    anchor={{ x: 0.5, y: 0.5 }}
                >
                    <SvgXml size={32} xml={svgs['map-marker-current-location']} />
                </MapView.Marker>
            )}
        </MapView>
        <View style={[styles.toolbar, (!subAlert && auth.user.online && order != null) ? { paddingBottom: 180 } : { paddingBottom: 85 }]}>
            <View style={{ flexGrow: 1 }}>
                {(order === null || !auth.user.online) && <OnlineOfflineBtn setLocationAvailable={setLocationAvailable} locationAvailable={locationAvailable} />}
                {(auth.user.online && order != null) && (
                    <React.Fragment>
                        {!!navigationDirection && (
                            <MapDirectionInfo
                                // direction={pickupDirection}
                                direction={navigationDirection}
                                currentLocation={currentLocation}
                                onInfoChange={info => setDirectionInfo(info)}
                            />
                        )}
                    </React.Fragment>
                )}
                {navigationDirection && (
                    <View style={{ flexDirection: 'row', paddingTop: 16, justifyContent: 'flex-end' }}>
                        <NavigationButton onPress={() => startNavigate(navigationDirection)} />
                    </View>
                )}
            </View>
            <View>
                <View style={{ marginLeft: 'auto' }}>
                    <MapCenterButton
                        status={locationAvailable ? 'on' : 'off'}
                        onPress={moveToMyLocation}
                    />
                </View>
            </View>
        </View>
        {(!subAlert && auth.user.online && order != null) && (
            <BottomDrawer
                offset={49}
                onPress={() => { setSubmenuCollapsed(!submenuCollapsed); setShowNavigationMap(false); }}
            >
                <GestureRecognizer
                    onSwipeUp={() => setSubmenuCollapsed(false)}
                    onSwipeDown={() => setSubmenuCollapsed(true)}
                >
                    {renderOrderSubmenu()}
                </GestureRecognizer>
            </BottomDrawer>
        )}
        {cancelInProgress && (
            <ProgressModal
                title={t('pages.home.please_wait') + " ..."}
            />
        )}
        <View style={styles.alertContainer}>
            {subAlert && <Text style={[globalStyles.alert, subAlert.style]}>{subAlert.message}</Text>}
        </View>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    map: {
        width: '100%',
        height: '100%',
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 40,
    },
    alertContainer: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        width: '100%',
    },
    toolbar: {
        position: 'absolute',
        top: 0,
        left: 0,
        padding: 16,
        width: '100%',
        minHeight: WINDOW_HEIGHT
    },
    navigationMapBack: {
        position: 'absolute',
        zIndex: 2,
        top: 0,
        // bottom: 0,
        left: 0,
        right: 0,
        width: '100%',
        height: 3000,
        backgroundColor: '#00000080'
    },
    navigationMap: {
        position: 'absolute',
        zIndex: 999,
        top: 100,
        padding: 10,
        justifyContent: 'center',
        alignSelf: 'center',
        backgroundColor: '#FFF',
        borderRadius: 6
    },
    navigationMapItem: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5,
        borderBottomWidth: 1,
        borderBottomColor: '#00000050'
    },
    navigationMapItemLast: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 5
    },
    navigationMapItemText: {
        marginLeft: 10,
        fontSize: 18
    },
    navigationMapOpen: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#00000050'
    },
    navigationMapOpenText: {
        fontSize: 18
    },
    navigationMapClose: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 5
    },
    navigationMapCloseText: {
        fontSize: 18,
        color: '#FF0000'
    }
});

const mapStateToProps = state => {
    return {
        order: state.app.currentOrder,
        currentLocation: state.app.location.current,
        locationAvailable: state.app.location.available,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setOrder: order => dispatch(setCurrentOrderAction(order)),
        setLocationAvailable: available => dispatch(setLocationAvailable(available)),
        reloadCurrentOrder: () => dispatch(reloadCurrentOrderAction()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeMainScreen);
