import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import * as actions from '../actions'
import { browserHistory } from 'react-router'
import Header from '../components/componentKit/Header'
import CalendarList from '../components/todayTask/CalendarList'
import Menu from '../components/todayTask/Menu'
import cookie from 'react-cookie'
import ScrollToTop from 'react-scroll-up'
import LogoLink from '../components/componentKit/LogoLink'
import Modal from 'boron-react-modal/FadeModal'
import LoadingView from '../components/componentKit/LoadingView'
import CSSModules from 'react-css-modules'
import styles from './seasons.css'
import Layout from '../components/componentKit2/Layout'
let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}
const scrollUpStyle = {
  zIndex: 2000,
  position: 'fixed',
  fontSize: 16,
  bottom: 60,
  left: 30,
  cursor: 'pointer',
  transitionDuration: '0.2s',
  transitionTimingFunction: 'linear',
  transitionDelay: '0s'
}

const seasons = [
  {
    season: 4,
    img:'els_season_3.jpg',
    imgBw:'els_season_3_bw.jpg'
  },
  {
    season: 3,
    img:'els_season_2.jpg',
    imgBw:'els_season_2_bw.jpg'
  },
  {
    season: 2,
    img:'els_season_1.jpg',
    imgBw:'els_season_1_bw.jpg'
  }
]

const currentSeason = 4
/**
 *  Контейнер Seasons.
 *  Используется для отображения страницы 'Сезоны' (/seasons)
 */
class Seasons extends Component {
  /**
   * @memberof Seasons
   * @prop {Object} propTypes - the props that are passed to this component
   * @prop {Object} propTypes.taskDay Данные для ренденринга страницы 'Сезоны'
   *
   * */
  static propTypes = {
    taskDay: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(actions.fetchTaskDayIfNeeded('reactjs'))
  }

  render() {
    const { isFetching, taskDay, dispatch, userInfo, location } = this.props
    const isEmpty = !taskDay || !taskDay.data || taskDay.data.length === 0
    return (
      <Layout page={'seasons'} prevSeasons={userInfo.data.prevSeasons} location={location}>
        {isEmpty
          ? (isFetching ? <LoadingView title="Загружается..."/> : <LoadingView title="Если вы видите это окно, значит мы делаем личный кабинет для вас удобнее! Напишите нам в чат тех поддержки (внизу справа)"/>)
          : <div>
            {
              seasons.map((item, index) => {
								if(item.season == currentSeason){
									item.active = true;
								}
								userInfo.data.prevSeasons && userInfo.data.prevSeasons.length && userInfo.data.prevSeasons.map(i => {
                  if(item.season === i.season){
                    item.active = true
                  }
                })

                  if(item.active){
                    if(item.last){
                      return (
                        <div
                          className='text-center'
                          key={'seasons-' + index}
                          onClick={() => {
                            if(cookie.load('userPaidState') == 0 || cookie.load('userPaidState') == -1){
                              browserHistory.push('/season')
                            } else {
                              dispatch({ type: 'SELECT_DAY_ID', id: '' })
                              cookie.save('currentSeason', item.season, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                              browserHistory.push('/task')
                            }
                            cookie.remove('userPaidState', { path: '/'})
                          }}
                        >
                          <img
                            role="presentation"
                            src={`/assets/img/els/${item.img}`}
                            className={styles.imgActive}
                          />
                        </div>)
                    } else {
                      return (
                        <div
                          className='text-center'
                          key={'seasons-' + index}
                          onClick={() => {
                            dispatch({ type: 'SELECT_DAY_ID', id: '' })
                            cookie.save('currentSeason', item.season, { path: '/', maxAge: 60 * 60 * 24 * 365 * 10 })
                            browserHistory.push('/task')
                          }}
                        >
                          <img
                            role="presentation"
                            src={`/assets/img/els/${item.img}`}
                            className={styles.imgActive}
                          />
                        </div>)
                    }
                  } else {
                    return (
                      <div key={'seasons-' + index}  className='text-center'>
                        <img
                          role="presentation"
                          src={`/assets/img/els/${item.imgBw}`}
                          className={styles.img}
                        />
                      </div>)
                  }
              })
            }
            <ScrollToTop style={scrollUpStyle} showUnder={160}>
              <div className={styles.btnGoBack}>
                <svg className={styles.svgIcoArrowUp}>
                  <use xlinkHref="#ico-arrow-up"></use>
                </svg>
              </div>
            </ScrollToTop>

          <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
            <div className={styles.entryHeader}>
              <h2 className={styles.entryTitleCenter}>Загружается...</h2>
            </div>
            <div className={styles.textCenter}>
              <div className={styles.loaderMain}></div>
            </div>
          </Modal>

          </div>
        }
      </Layout>
    )
  }
}

const mapStateToProps = state => {
  const { selectedTaskDay, recivedTaskDay, userToken, userInfo } = state

  const { taskDay, isFetching } = recivedTaskDay[selectedTaskDay] || {
    isFetching: true,
    taskDay: {}
  }

  return {
    isFetching,
    taskDay,
    userInfo,
    recivedTaskDay,
    token: userToken.token
  }
}

Seasons = connect(
  mapStateToProps
)(Seasons)

export default CSSModules(Seasons, styles)
