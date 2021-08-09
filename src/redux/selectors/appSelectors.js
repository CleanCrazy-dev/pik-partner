import { createSelector } from 'reselect'
import moment from 'moment';
import 'moment/locale/es';

const getAuthUser = state => state.auth.user;
const getOrders = state => state.app.orders;
const getCustomValues = state => state.app.customValues;

const getSpanishDate = (date, format) => {
    let localDate = moment(date);
    moment.locale('es');
    return localDate.format(format);
}

const getEarnings = createSelector(
    [getAuthUser, getOrders, getCustomValues],
    (authUser, orders, customValues) => {
        let totalEarnings = 0;
        let currentWeekEarnings = 0
        let totalOrderCount = 0
        let totalPackageCount = 0
        let weeks = {};
        let currentWeekStart = moment().startOf('isoWeek');

        const getEmptyWeek = weeksAgo => {
            return {
                // title: `${weeksAgo} Weeks Ago`,
                title: weeksAgo==0 ? 'Current Week' : (weeksAgo == 1 ? 'Last Week' : `${weeksAgo} Weeks Ago`),
                total: 0,
                delivery: 0,
                return: 0,
                discount: 0,
                orders: [],
                customValues: []
            }
        }

        orders.map(o => {
            if(!['Delivered', 'Canceled', 'Returned'].includes(o.status))
                return

            let date = null
            switch (o.status) {
                case 'Delivered':
                    date = moment(o?.time?.deliveryComplete)
                    break;
                case 'Returned':
                    date = moment(o?.time?.returnComplete)
                    break;
                case 'Canceled':
                    date = moment(o?.cancel?.date)
                    break;
                default:
                    break;
            }
            let weekKey = date.startOf('isoWeek').format('YYYY-MM-DD')
            let weeksAgo = currentWeekStart.diff(date, "weeks")
            let cost = parseFloat(o.cost.deliveryFee)
            let returnFee = 0;
            if(['Canceled', 'Returned'].includes(o.status)){
                cost = 0;
                console.log(`ID: ${o.id} & canceler: ${o.cancel?.canceler} & authUser: ${authUser._id}`)
                if(o.cancel?.canceler !== authUser._id) {
                    returnFee = parseFloat(o.cost.cancelFee)
                    if (o.status === 'Returned')
                        returnFee += parseFloat(o.cost.deliveryFee)
                }
            }
            if(weeksAgo == 0){
                currentWeekEarnings += cost + returnFee
            }
            totalEarnings += cost + returnFee
            if(weeks[weekKey] === undefined){
                weeks[weekKey] = getEmptyWeek(weeksAgo)
            }
            weeks[weekKey].total += cost + returnFee
            weeks[weekKey].delivery += cost
            weeks[weekKey].return += returnFee
            weeks[weekKey].orders.push(o);

            totalOrderCount += 1
            totalPackageCount += o.packages.count
        })
        customValues.map(cv => {
            let date = moment(cv.date)
            let weekKey = date.startOf('isoWeek').format('YYYY-MM-DD')
            let weeksAgo = currentWeekStart.diff(date, "weeks")
            let cost = parseFloat(cv.amount)
            if(weeksAgo == 0){
                currentWeekEarnings += cost
            }
            totalEarnings += cost
            if(weeks[weekKey] === undefined){
                weeks[weekKey] = getEmptyWeek(weeksAgo)
            }
            weeks[weekKey].total += cost
            weeks[weekKey].discount += cost
            weeks[weekKey].customValues.push(cv);
        })
        let sortedKeys = Object.keys(weeks).sort((a, b) => (a < b))
        return {
            total: totalEarnings,
            totalOrderCount,
            totalPackageCount,
            currentWeek: currentWeekEarnings,
            weeks: sortedKeys.map(key => weeks[key])
        }
    }
)

const getOrdersList = createSelector(
    [getOrders],
    (orders) => {
        let totalEarnings = 0;
        let currentDayEarnings = 0
        let totalOrderCount = 0
        let totalPackageCount = 0
        let days = {};
        let currentDay = moment().startOf('day');

        const getEmptyDay = (date, daysAgo) => {
            return {
                title: daysAgo==0 ? 'Hoy' : (daysAgo == 1 ? 'Ayer' : getSpanishDate(date, 'MMMM D')),
                total: 0,
                delivery: 0,
                return: 0,
                discount: 0,
                orders: [],
            }
        }

        orders.map(o => {
            let date = moment(o.time.driverAssign)
            let dayKey = date.startOf('day').format('YYYY-MM-DD')
            let daysAgo = currentDay.diff(date, "days")
            let cost = parseFloat(o.cost.deliveryFee)
            let returnFee = 0;
            if(o.status === 'Canceled'){
                cost = 0;
                returnFee = parseFloat(o.cost.cancelFee)
            }
            else if(o.status === 'Returned'){
                cost = 0;
                returnFee = parseFloat(o.cost.cancelFee) + parseFloat(o.cost.deliveryFee)
            }
            if(daysAgo == 0){
                currentDayEarnings += cost + returnFee
            }
            totalEarnings += cost + returnFee
            if(days[dayKey] === undefined){
                days[dayKey] = getEmptyDay(date, daysAgo)
            }
            days[dayKey].total += cost + returnFee
            days[dayKey].delivery += cost
            days[dayKey].return += returnFee
            days[dayKey].orders.push(o);

            totalOrderCount += 1
            totalPackageCount += o.packages.count
        })
        let sortedKeys = Object.keys(days).sort((a, b) => (a < b))
        return {
            total: totalEarnings,
            totalOrderCount,
            totalPackageCount,
            currentDay: currentDayEarnings,
            days: sortedKeys.map(key => days[key])
        }
    }
)

export {
    getEarnings,
    getOrdersList,
}
