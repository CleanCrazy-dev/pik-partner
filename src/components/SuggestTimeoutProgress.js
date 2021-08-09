import React from 'react'
import PropTypes from 'prop-types'
import {TouchableOpacity} from 'react-native';
import ProgressBarGradient from './ProgressBarGradient';
import Api from '../utils/api';

class SuggestTimoutProgress extends React.Component {

    constructor(props){
        super(props)

        this.state = {
            timeInfo: {
                expireIn: 60,
                passed: 0,
            },
            counter: 0
        }

        this.reloadTimeInfo = this.reloadTimeInfo.bind(this)
        this.tick = this.tick.bind(this)
    }

    componentDidMount() {
        this.reloadTimeInfo()
    }
    componentWillUnmount(){
        this.stopTimer()
    }

    startTimer() {
        this.timer = setInterval(this.tick, 1000);
    }
    stopTimer() {
        clearInterval(this.timer)

    }

    tick() {
        let {timeInfo: {expireIn}, counter} = this.state;
        this.setState({counter: Math.min(counter + 1 , 100)})
        if(counter >= expireIn && this.props.onTimeout) {
            this.props.onTimeout()
        }
    }

    reloadTimeInfo() {
        let {order} = this.props;

        Api.Driver.getSuggestTimeInfo(order._id)
            .then(data => {
                if(data.success) {
                    let {passed} = data.timeInfo
                    this.setState({
                        timeInfo: data.timeInfo,
                        counter: passed
                    })
                    this.startTimer()
                }
            })
    }

    render(){
        let {timeInfo: {expireIn}, counter} = this.state
        return <TouchableOpacity onPress={() => this.reloadTimeInfo()}>
            <ProgressBarGradient style={{marginBottom: 65}} value={Math.ceil(100 * counter/expireIn)}/>
        </TouchableOpacity>
    }
}

SuggestTimoutProgress.propTypes = {
    order: PropTypes.object,
    onTimeout: PropTypes.func
}

export default SuggestTimoutProgress;
