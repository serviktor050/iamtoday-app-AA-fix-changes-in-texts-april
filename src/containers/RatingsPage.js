import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import Layout from '../components/componentKit2/Layout'
import {
  setMenuList,
} from '../actions'

import CSSModules from 'react-css-modules'
import styles from './ratingsPage.css'
import Loader from '../components/componentKit/Loader'


const tabs = [
  {
    name: 'personal',
    label: 'Личное первенство'
  },
	{
		name: 'team',
		label: 'Командный зачет'
	},
	{
		name: 'leaders',
		label: 'Рейтинг лидеров'
	}
];

/**
 *  Контейнер RatingsPage.
 *  Используется для отображения страницы реитинги (/ratings)
 *
 */
class RatingsPage extends Component {
  /**
   * @memberof RatingsPage
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.clearRenderChat Очистка чата
   * @prop {func} propTypes.setMenuList установка выбранной старницы в меню
   * @prop {func} propTypes.fetchTaskDayIfNeeded Получение данных для страницы дня
   * @prop {object} propTypes.userInfo Данные пользователя
   *
   * */
  static propTypes = {

    /**
     * Функция Очистка чата
     * @memberof ChatPage
     * @param {number} page - Номер выбранной страницы
     */
    setMenuList: PropTypes.func.isRequired,
    /**
     * Функция Очистка чата
     * @memberof ChatPage
     * @param {string} day - Номер дня.
     */
    userInfo: PropTypes.object.isRequired,
  }

  state = {
    activeTab: 'personal'
  }


  componentDidMount() {
    const { setMenuList } = this.props
    setMenuList(7)
  }

	toggleTab = (activeTab) => {
    this.setState({activeTab})
  }

	onChange= (e) => {
    this.state({[e.target.name] : e.target.value})
  }

// //<LoadingView title="Если вы видите это окно, значит мы делаем личный кабинет для вас удобнее! Напишите нам в чат
// тех подержки (внизу справа) или на почту sb@todayme.ru" taskBack={true}/>

  render() {
    const { userInfo } = this.props
		const isEmpty = !userInfo.data.points;

    return (
    <Layout page={'ratings'} prevSeasons={userInfo.data.prevSeasons}>
			{
				!isEmpty ?
					<div className={styles.rating}>
						<div className={styles.title}>
							Рейтинг
						</div>
						<div className={styles.rank}>
							<div className={styles.ranlItem}>
								<div className={styles.card}>
									<div className={styles.top}>
										<div className={styles.photo}>
											<img className={styles.photoImg} src={userInfo.data.photo} alt=""/>
										</div>
										<div className={styles.user}>
											<div className={styles.userName}>{userInfo.data.lastName}</div>
											<div className={styles.userStatus}>{userInfo.data.points.pointAchievement.name}</div>
											<div className={styles.userProgram}>Название программы</div>
										</div>
									</div>

									<div className={styles.info}>
                    <div className={styles.infoBlock}>
                      <div className={styles.infoPosition}>
                        <span className={styles.infoText}>место</span>
                        <span className={styles.position}>{userInfo.data.points.userRank.common.position}</span>
                        <span className={styles.infoText}>/</span>
                        <span className={styles.position}>{userInfo.data.points.userRank.common.totalUsers}</span>
                      </div>
                      <div className={styles.infoPoints}>
                        <span className={styles.infoText}>баллов</span>
                        <span className={styles.infoText}>{userInfo.data.points.userRank.common.points}</span>
                      </div>
										</div>

										<div className={styles.report}>
											<span className={styles.reportTitle}>Спортивный зачет:</span>
											<span className={styles.position}>{userInfo.data.points.userRank.sport.position}</span>
											<span className={styles.reportText}>место</span>

											<span className={styles.position}>{userInfo.data.points.userRank.sport.points}</span>
											<span className={styles.reportText}>баллов</span>
										</div>

										<div className={styles.report}>
											<span className={styles.reportTitle}>Бизнес зачет:</span>
											<span className={styles.position}>{userInfo.data.points.userRank.business.position}</span>
											<span className={styles.reportText}>место</span>

											<span className={styles.position}>{userInfo.data.points.userRank.business.points}</span>
											<span className={styles.reportText}>баллов</span>
										</div>
									</div>
								</div>
							</div>
							<div className={styles.ranlItem}>
								<div className={styles.card}>
									<div className={styles.top}>
										<div className={styles.photo}>
											<img className={styles.photoImg} src={userInfo.data.photo} alt=""/>
										</div>
										<div className={styles.user}>
											<div className={styles.userTeam}>{`Команда ELS-1`}</div>
										</div>
									</div>
									<div className={styles.info}>
										<div className={styles.infoPosition}>
											<div className={styles.infoText}>место</div>
											<span className={styles.infoText}>{userInfo.data.points.teamRank.common.position}</span>
											<span className={styles.infoText}>/</span>
											<span className={styles.infoText}>{userInfo.data.points.teamRank.common.totalUsers}</span>
										</div>
										<div className={styles.infoPoints}>
											<div className={styles.infoText}>баллов</div>
											<div className={styles.infoText}>{userInfo.data.points.teamRank.common.points}</div>
										</div>

										<div className={styles.report}>
											<span className={styles.reportTitle}>Спортивный зачет:</span>
											<span className={styles.position}>{userInfo.data.points.teamRank.sport.position}</span>
											<span className={styles.reportText}>место</span>

											<span className={styles.position}>{userInfo.data.points.teamRank.sport.points}</span>
											<span className={styles.reportText}>баллов</span>
										</div>

										<div className={styles.report}>
											<span className={styles.reportTitle}>Бизнес зачет:</span>
											<span className={styles.position}>{userInfo.data.points.teamRank.business.points}</span>
											<span className={styles.reportText}>место</span>

											<span className={styles.position}>{userInfo.data.points.teamRank.business.points}</span>
											<span className={styles.reportText}>баллов</span>
										</div>
									</div>
								</div>
							</div>
						</div>

            <div className={styles.tabNav}>
              <div className={styles.tabNavList}>

                {
                  tabs.map((tab) => {
                    return (
											<div
                        key={tab.name}
                        className={styles.tabNavItem}
												onClick={() => this.toggleTab(tab.name)}
                      >
                        {tab.label}
											</div>
                    )
                  })
                }
              </div>

              <div className={styles.myPosition}>
                <div>
                  Мое положение
                </div>
              </div>

							<div className={styles.search}>
								<input
                  type="text"
                  name='search'
                  value={this.state.search}
                  onChange={this.onChange}
									className={styles.searchInput}
                />
							</div>

            </div>

            <div className={styles.tabContent}>
							<div className={styles.table}>
								<div className={styles.tableHead}>
									<div className={styles.tableRow}>
                    <div className={styles.th}>Место</div>
                    <div className={styles.th}>Герой</div>
                    <div className={styles.th}>Город</div>
                    <div className={styles.th}>Спорт(баллы)</div>
                    <div className={styles.th}>Бизнес(баллы)</div>
                    <div className={styles.th}>Общий(баллы)</div>
									</div>
								</div>
								<div className={styles.tableBody}>
                  {this.state.activeTab}
								</div>
							</div>
            </div>

					</div>
					: null
			}
    </Layout>
    )
  }
}

const mapStateToProps = state => {

  const { userInfo } = state;
  return {
    userInfo,
  }
}


RatingsPage = connect(
  mapStateToProps,
  {
    setMenuList
  }

)(RatingsPage)

export default CSSModules(RatingsPage, styles)
