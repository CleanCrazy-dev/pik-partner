import React from 'react'
import {useRoute, useNavigation} from '@react-navigation/native';
import {
    StyleSheet,
    TouchableOpacity,
    View,
    Text,
} from 'react-native'
import {SvgXml} from 'react-native-svg';
import svgs from '../utils/svgs';
import {connect} from 'react-redux';
import {useAuth} from '../utils/auth';

const OrderChat = ({driver, order, customer, ...props}) => {
    let auth = useAuth()
    const navigation = useNavigation();
    const {chatList} = props

    let hasUnreadMessage = React.useMemo(() => {
        let chatId = `order_${order?._id}_driver_${driver?._id}_customer_${customer?._id}`
        let chat = chatList.find(({id}) => id===chatId)
        if(!chat)
            return false
        return (chat?.userList[auth.user._id]?.unread > 0)

    }, [driver, order, customer, chatList])

    return (
        <View>
            <SvgXml
                onPress={() => {
                    navigation.navigate('MainOrderChat', {order, customer})
                }}
                width={30} xml={svgs[`icon-comment${hasUnreadMessage ? '-unread' : ''}`]}
            />
        </View>
    )
}

const styles = StyleSheet.create({
})

const mapStateToProps = state => {
    return {
        chatList: state.app.orderChatList
    }
}

export default connect(mapStateToProps)(OrderChat)
