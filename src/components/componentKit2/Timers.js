import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './timers.css'
import moment from 'moment'
import TimersItem from './TimersItem'
import classNames from 'classnames';

class Timers extends Component {

    state = {
        show: false,
        timers: []
    }

    componentDidMount(){
        this.initTimers(this.props.timers)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.timers !== this.props.timers){
            this.initTimers(nextProps.timers)
        }
    }

    initTimers = (timers) => {

        timers = timers.map((item, idx) => {
            return {
                ...item,
                id: `timers-${idx}`,
                isActive: !idx
            }
        })

        const loadTimer = localStorage.getItem('t-timer');

        if(loadTimer){
            timers = timers.map((item) => {
                item.isActive = item.id === loadTimer;
                return item;
            })
        }
        this.setState({
            timers: this.setActive(timers)
        })
    }

    setActive = (timers) => {
        const newTimers = [];
        timers.forEach(item => {

            if(item.isActive){
                newTimers.unshift(item);
            } else {
                newTimers.push(item);
            }
        })

        return newTimers;
    }

    toggleTimer = (item) => {
        if(item.isActive) {
            return;
        }
        localStorage.setItem('t-timer', item.id)
        const timers = this.state.timers

        const timers2 = timers.map(i => {

            i.isActive = item.id === i.id;
            return i;
        })

        this.setState({
            timers: this.setActive(timers)
        })
    }

    show = () => {
        this.setState({
            show: !this.state.show
        })
    }


    render() {
        return (
            <div className={classNames(styles.timersBlock, {
                [styles.timersBlockShow]: this.state.show
            })}
             onClick={this.show}
            >
                {
                    this.state.timers.map((item) => {
                        return (
                            <TimersItem
                                key={item.id}
                                toggleTimer={this.toggleTimer}
                                item={item}
                            />
                        )
                    })
                }
            </div>
        )
    }
}
export default CSSModules(Timers, styles)
