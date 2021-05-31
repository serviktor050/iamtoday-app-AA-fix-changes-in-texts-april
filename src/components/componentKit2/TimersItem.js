import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './timers.css'
import moment from 'moment'
import classNames from 'classnames';
import {pluralize} from '../../utils/helpers';

class TimersItem extends Component {

    constructor() {
        super()
        this.countDown = this.countDown.bind(this);
    }


    state = {
        time: null,
        timeRender: null,
    }

    componentDidMount(){
        const {item} = this.props
        const distance = moment.duration(moment(item.eventDate).diff(moment()))
        this.timeRender(distance)
        this.setState({
            time: distance,
        });
        this.timer = setInterval(this.countDown, 1000);
    }
    componentWillUnmount() {
        this.stop();
    }
    timeRender(distance){
        const day = Math.floor(distance.as('days'))
        const hour = Math.floor(distance.as('hours') % 24)
        const minutes = Math.floor(distance.as('minutes') % 60)
        const seconds = Math.floor(distance.as('seconds') % 60)

        if(day <=0 && hour <= 0 && minutes <= 0 && seconds <= 0){
            this.stop()
            this.setState({ timeRender: null });
            return;
        }
        const timeRender = {
            d:day < 10 ? '0' + day : day,
            h:hour < 10 ? '0' + hour : hour,
            m:minutes < 10 ? '0' + minutes : minutes,
            s:seconds < 10 ? '0' + seconds : seconds
        }
        this.setState({ timeRender: timeRender });
    }
    countDown(){
        this.state.time.subtract(1, 'seconds')
        this.timeRender(this.state.time)
    }
    stop() {
        clearInterval(this.timer);
    }
    render(){
        const {item, toggleTimer } = this.props
        const {timeRender} = this.state
        return (
            <div>
                {timeRender && <div onClick={() => toggleTimer(item)} className={classNames(styles.timersItem, {
                    //[styles.db] : this.state.showTimer
                })}>
                    <div className={styles.content}>
                        <div className={styles.name}>{item.eventName}</div>
                        <div className={styles.time}>
                            <div className={styles.timeItem}>
                                <span className={styles.timeItemNum}>{timeRender.d}</span>
                                <div className={styles.timeItemDesc}>{pluralize(timeRender.d, [ 'день', 'дня', 'дней' ])}</div>
                            </div>
                            <span className={styles.timeItemH}>:</span>
                            <div className={styles.timeItem}>
                                <span className={styles.timeItemNum}>{timeRender.h}</span>
                                <div className={styles.timeItemDesc}>{pluralize(timeRender.h, [ 'час', 'часа', 'часов' ])}</div>
                            </div>
                            <span className={styles.timeItemH}>:</span>
                            <div className={styles.timeItem}>
                                <span className={styles.timeItemNum}>{timeRender.m}</span>
                                <div className={styles.timeItemDesc}>{pluralize(timeRender.m, [ 'минута', 'минуты', 'минут' ])}</div>
                            </div>
                            <span className={styles.timeItemH}>:</span>
                            <div className={styles.timeItem}>
                                <span className={styles.timeItemNum}>{timeRender.s}</span>
                                <div className={styles.timeItemDesc}>{pluralize(timeRender.s, [ 'секунда', 'секунды', 'секунд' ])}</div>
                            </div>
                        </div>
                    </div>
                </div>}
            </div>

        )
    }
}
export default CSSModules(TimersItem, styles)