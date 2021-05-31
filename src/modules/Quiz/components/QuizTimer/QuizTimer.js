import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import moment from 'moment'
import {getDifferenceTimes} from "../../common";
import styles from './styles.css'

class QuizTimer extends Component {

    constructor() {
        super()
        this.countDown = this.countDown.bind(this);
    }

    state = {
        time: null,
        timeRender: null,
    }

    componentDidMount() {
        const {startDate, endDate} = this.props
        const distance = moment.duration(moment(endDate).diff(moment(startDate)))
        this.updateTimer(distance)
        this.setState({
            time: distance,
        });
        this.timer = setInterval(this.countDown, 1000);
    }

    componentWillUnmount() {
        this.stop();
    }

    updateTimer(distance) {
        const diffTimes = getDifferenceTimes(distance)
        const {days, hours, minutes, seconds} = diffTimes;
        if (days <= 0 && hours <= 0 && minutes <= 0 && seconds <= 0) {
            this.stop()
            this.setState({timeRender: this.formatDiffTimes(diffTimes)});
            return;
        }
        this.setState({timeRender: this.formatDiffTimes(diffTimes)});
    }

    countDown() {
        this.state.time.subtract(1, 'seconds')
        this.updateTimer(this.state.time)
    }

    formatDiffTimes(differenceTimes) {
        const days = differenceTimes.days < 10 ? '0' + differenceTimes.days : differenceTimes.days;
        const hours = differenceTimes.hours < 10 ? '0' + differenceTimes.hours : differenceTimes.hours;
        const minutes = differenceTimes.minutes < 10 ? '0' + differenceTimes.minutes : differenceTimes.minutes;
        const seconds = differenceTimes.seconds < 10 ? '0' + differenceTimes.seconds : differenceTimes.seconds
        return {days, hours, minutes, seconds}
    }

    stop() {
        clearInterval(this.timer);
    }

    render() {
        const {timeRender} = this.state;
        return (
            <div className={styles.quizTimer}>
                {timeRender &&
                <div>
                    {`${timeRender.hours}:${timeRender.minutes}:${timeRender.seconds}`}
                </div>
                }
            </div>

        )
    }
}

export default CSSModules(QuizTimer, styles)