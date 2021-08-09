import React from 'react'
import moment from 'moment'
import {
    StyleSheet,
    View,
    Text
} from 'react-native'
import BoxShadow from './BoxShadow';
import GradientView from './GradientView';
import {GRADIENT_2} from '../utils/constants';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import globalStyles from '../utils/globalStyles';

const MapDirectionInfo = ({direction, currentLocation, onInfoChange}) => {

    /** ===================================================================================*/
    // https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
    function sqr(x) { return x * x }
    function dist2(v, w) { return sqr(v.x - w.x) + sqr(v.y - w.y) }
    function distToSegmentSquared(p, v, w) {
        var l2 = dist2(v, w);
        if (l2 == 0) return dist2(p, v);
        var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
        t = Math.max(0, Math.min(1, t));
        return dist2(p, { x: v.x + t * (w.x - v.x),
            y: v.y + t * (w.y - v.y) });
    }
    function distToSegment(p, v, w) { return Math.sqrt(distToSegmentSquared(p, v, w)); }
    /** ===================================================================================*/

    const currentStep = React.useMemo(() => {
        if(!direction || !currentLocation)
            return null;
        let p = {
            x: currentLocation.coords.latitude,
            y: currentLocation.coords.longitude,
        }
        const steps = direction.routes[0].legs[0].steps
        let distances = steps.map(step => {
            let v = {x: step.start_location.lat, y: step.start_location.lng}
            let w = {x: step.end_location.lat, y: step.end_location.lng}

            return distToSegment(p, v, w)
        })

        let index = distances.reduce(function(lowest, next, index, arr) {
                return next < arr[lowest] ? index : lowest; },
            0)

        const formatTime = seconds => {
            const pad = num => num.toString().padStart(2, '0')
            if(seconds < 60)
                return `00:${pad(seconds)}`
            let minutes = Math.floor(seconds / 60)
            seconds = seconds % 60
            if(minutes < 60)
                return `${pad(minutes)}:${pad(seconds)}`
            let hours = Math.floor(minutes / 60)
            minutes = minutes % 60
            return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
        }

        const remainingSeconds = steps.slice(index + 1).reduce((acc, current) => acc + current.duration.value, 0)

        return {
            index,
            remainingSeconds,
            remainingTime: formatTime(remainingSeconds),
            arrivalTime: moment().add(remainingSeconds, 'seconds').format('h:mm a'),
            ...steps[index]
        }
    }, [direction, currentLocation])

    React.useEffect(() => {
        !!onInfoChange && onInfoChange(currentStep)
    }, [currentStep])

    const clearHtml = html => html.replace(/<\/?[^>]+(>|$)/g, "")

    return currentStep ? (
        <View>
            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
                <BoxShadow>
                    <GradientView style={styles.pendingGradient} gradient={GRADIENT_2}>
                        {/*<Text style={{color: 'white'}}>{JSON.stringify(currentStep)}</Text>*/}
                        <View style={globalStyles.flexRow}>
                            <MaterialIcons name="watch-later" style={styles.icon}/>
                            <Text style={styles.time1}> {currentStep.remainingTime}</Text>
                            <Text style={{flexGrow: 1}}/>
                            <Text style={styles.arrival}> {currentStep.arrivalTime}</Text>
                        </View>
                        {/*<Text style={{color: 'white', alignItems: 'center'}}>*/}
                        {/*</Text>*/}
                        <Text style={{color: 'white', alignItems: 'center'}}>
                            <FontAwesome5 name="directions" style={styles.icon} />
                            <Text style={styles.address}>
                                <Text> {currentStep.distance.text}</Text>
                                <Text> {clearHtml(currentStep.html_instructions)}</Text>
                            </Text>
                        </Text>
                    </GradientView>
                </BoxShadow>
            </View>
        </View>
    ) : null
}

const styles = StyleSheet.create({
    icon: {
        color: 'white',
        fontWeight: '900',
        fontSize: 20,
    },
    time1: {
        color: 'white',
        fontWeight: '700',
        fontSize: 24,
        lineHeight: 24,
    },
    arrival: {
        color: 'white',
        fontWeight: '400',
        fontSize: 16,
        lineHeight: 24,
    },
    address: {
        fontWeight: '600',
        fontSize: 20,
        lineHeight: 24,
    },
    pendingGradient: {
        borderRadius: 5,
        padding: 12,
    },
})

export default MapDirectionInfo
