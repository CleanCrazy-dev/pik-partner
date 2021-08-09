import { createSelector } from 'reselect'

const getOrders = state => state.app.orders;
const getUser = state => state.auth.user; // Available
const getAvailables = createSelector(
    [getOrders, getUser],
    (orders, user) => {
        let availables = orders.filter(({receiver, senderModel, status}) => {
            return senderModel === 'business' && status === 'Created' && receiver._id === user._id
        })
        return {
            list: availables,
            count: availables.reduce((sum ,order) => (sum+order.packages.length), 0)
        };
    }
)

export {
    getAvailables,
}
