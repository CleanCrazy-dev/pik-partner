import React, {useState, useMemo, useEffect} from 'react';
import _ from 'lodash'
import moment from 'moment'
import {
    StyleSheet,
    View,
    Text
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import {
    COLOR_NEUTRAL_GRAY,
    COLOR_PRIMARY_500,
    COLOR_TERTIARY_ERROR,
    GRAY_LIGHT_EXTRA,
    INPUT_HEIGHT,
} from '../utils/constants';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const NumberInput = ({value, placeholder, items, onChange}) => {
    return <Picker
        selectedValue={value}
        style={styles.picker}
        onValueChange={(itemValue, itemIndex) => onChange(itemValue)}
    >
        <Picker.Item style={styles.pickerItem} label={placeholder} value="" />
        {items.map(m => (
            <Picker.Item
                style={styles.pickerItem}
                label={m.label || m}
                value={m.value || m}
            />
        ))}
    </Picker>
}

const BirthdayPicker = ({value, onChange, placeholder, startYear, deltaYear, reverse, errorText}) => {
    let tempDate = moment(value);
    let [year, setYear] = useState(tempDate.isValid() ? tempDate.format('YYYY') : '999999')
    let [month, setMonth] = useState(tempDate.isValid() ? tempDate.format('MM') : '99')
    let [day, setDay] = useState(tempDate.isValid() ? tempDate.format('DD') : '99')

    let computed = useMemo(() => {
        let temp = moment(`${year}-${month}`, "YYYY-MM")
        let dayCount = temp.isValid() ? temp.daysInMonth() : 29

        let pivotYear = parseInt(moment().format('YYYY'))
        let y1 = pivotYear + startYear;
        let y2 = pivotYear + startYear + deltaYear;
        let yearsList = _.range(Math.min(y1, y2), Math.max(y1, y2)).map(n => n.toString())
        if(reverse)
            yearsList = _.reverse(yearsList);
        return {
            years: yearsList,
            months: [
                {value: '01', label: 'Jan'},
                {value: '02', label: 'Feb'},
                {value: '03', label: 'Mar'},
                {value: '04', label: 'Apr'},
                {value: '05', label: 'May'},
                {value: '06', label: 'Jun'},
                {value: '07', label: 'Jul'},
                {value: '08', label: 'Aug'},
                {value: '09', label: 'Sep'},
                {value: '10', label: 'Oct'},
                {value: '11', label: 'Nov'},
                {value: '12', label: 'Dec'},
            ],
            days: _.range(1, 1+dayCount).map(m => m.toString().padStart(2, '0'))
        }
    }, [year, month, day])

    useEffect(() => {
        if(onChange){
            let result = moment(`${year}-${month}-${day}`, 'YYYY-MM-DD')
            if(result.isValid())
                onChange(result.format('YYYY-MM-DD'))
        }
    }, [year, month, day])

    return <>
        <View style={[styles.container, !!errorText ? styles.hasError : {}]}>
            <Text style={styles.placeholder}>{placeholder}</Text>
            <View style={styles.dateContainer}>
                <NumberInput
                    placeholder="Año"
                    value={year}
                    items={computed.years}
                    onChange={setYear}
                />
                <View style={styles.spacer}/>
                <NumberInput
                    placeholder="Mes"
                    value={month}
                    items={computed.months}
                    onChange={setMonth}
                />
                <View style={styles.spacer}/>
                <NumberInput
                    placeholder="Día"
                    value={day}
                    items={computed.days}
                    onChange={setDay}
                />
            </View>
        </View>
        {!!errorText && <Text style={styles.errorText}>
            <FontAwesome5 name="exclamation-triangle" style={[styles.errorText]}/>
            <Text>  {errorText}</Text>
        </Text>}
    </>
}

BirthdayPicker.defaultProps = {
    startYear: -15,
    deltaYear: -60,
    reverse: true,
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: GRAY_LIGHT_EXTRA,
        borderRadius: 8,
        paddingVertical: 4,
        paddingHorizontal: 16,
        height: INPUT_HEIGHT,
    },
    dateContainer:{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    picker: {
        flexGrow: 1,
        height: 24,
    },
    pickerItem:{
        fontWeight: '400',
        fontSize: 14,
        lineHeight: 24,
    },
    spacer: {
        width: 16,
        backgroundColor: 'white',
    },
    placeholder: {
        fontWeight: '400',
        fontSize: 10,
        lineHeight: 16,
        color: COLOR_PRIMARY_500,
    },
    hasError:{
        borderWidth: 1,
        borderColor: COLOR_TERTIARY_ERROR,
    },
    errorText: {
        color: COLOR_TERTIARY_ERROR,
        fontWeight: '400',
        fontSize: 12,
        lineHeight: 16,
    }
});

export default BirthdayPicker;
