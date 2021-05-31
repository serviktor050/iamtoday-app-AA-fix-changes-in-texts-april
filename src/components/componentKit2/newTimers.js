import React, {Component} from 'react'
import CSSModules from 'react-css-modules'
import styles from './newTimers.css'
import moment from 'moment'
import classNames from 'classnames';
import {pluralize} from "../../utils/helpers";
import cookie from 'react-cookie';
import {Link} from 'react-router';
import {dict} from 'dict';

const currentSeason = 4

//cookie.remove('currentSeason');
class NewTimers extends Component {

    value = () => {
        const {timers, lang} = this.props;
          const distance = moment.duration(moment(timers[0].eventDate).diff(moment()));
          let day = Math.floor(distance.as('days'));
          const days = lang === 'ru' ? ['день', 'дня', 'дней'] : ['day', 'days', 'days'];
          return `${day} ${pluralize(day, days)}`;

    }

    renderTitle = () => {
        const { timers } = this.props

        return timers[0].eventName;
        /*if (!season) {
            title = 'До конца сезона';
        }
        if (season == currentSeason) {
            title = 'До конца сезона';
        }
        if (season == 3) {
            title = <div>
                <div>2-й сезон закончен</div>
                <Link to="/seasons">В новый сезон</Link>
            </div>
        }
        if (season == 2) {
            title = '1-й сезон закончен';
        }*/

    }

    render() {
        const {timers, staticText } = this.props;
        const season = cookie.load('currentSeason');

        return (
            <div className={styles.timers}>
                <div className={styles.timersBlock}>
                    <div className={styles.timersIcon}>
                        <div className={styles.timersCircleWrap}>
                            <div className={styles.timersCircle}>
                                <svg className={styles.icon}>
                                    <use xlinkHref='#clock2'/>
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div className={classNames(styles.timersInfo)}>
                        <div className={classNames(styles.title)}>{ this.renderTitle() }</div>
                        <div className={classNames(styles.value)}>{ this.value() }</div>
                    </div>
                </div>
            </div>
        )
    }
}

export default CSSModules(NewTimers, styles)
