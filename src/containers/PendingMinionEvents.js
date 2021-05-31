import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import {connect} from 'react-redux'
import {fetchPendingExams} from '../actions'
import ReactPaginate from 'react-paginate'
import Textarea from 'react-textarea-autosize'

import ExamsList from '../components/userReports/ExamsList'
import UserReportsMenu from '../components/userReports/UserReportsMenu'
import CSSModules from 'react-css-modules'
import styles from './pendingMinionEvents.css'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_COUNT = 10
let currentStatus = 'waiting'
let isExam = true
/**
 *  Контейнер PendingEvents.
 *  Используется для отображения страницы экзаменов в админке (/userReports/exams)
 *
 */
class PendingEvents extends Component {
  /**
   * @memberof PendingEvents
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.fetchPendingExams Получение данных с сервера(массив экзаменов)
   * @prop {array} propTypes.list Массив экзаменов
   *
   * */

  static propTypes = {
    /**
     * Функция для выбора дня
     * @memberof PendingEvents
     * @param {string} currentStatus - статус.
     * @param {number} page - Страница.
     * @param {boolean} isExam - Флаг эказмена.
     */
    fetchPendingExams: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired
  }
  componentWillMount() {
    const {fetchPendingExams} = this.props

    this.state = {
      list: [],
      page: DEFAULT_PAGE,
      pageCount: DEFAULT_PAGE_COUNT
    }

    fetchPendingExams(currentStatus, DEFAULT_PAGE, isExam)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isFetching && this.props.isFetching) {
      this.setState({
        list: [...nextProps.list],
        pageCount: nextProps.pageCount
      })
    }
  }

  loadMore() {
    const {fetchPendingExams} = this.props
    const nextPage = this.state.page + 1

    fetchPendingExams(currentStatus, nextPage)

    this.setState({page: nextPage})
  }

  render() {
    const {isFetching = true, fetchPendingExams} = this.props
    const {list = true} = this.state

    const handlePageClick = data => {
      const nextPage = data.selected + 1

      fetchPendingExams(currentStatus, nextPage, isExam)

      this.setState({page: nextPage})
    }

    const examsTypes = [
      { text: 'Экзамены', val: true },
      { text: 'Зачёты', val: false }
    ]

    const filterText = () => {
      this.state = {
        list: [],
        page: DEFAULT_PAGE
      }

      fetchPendingExams(currentStatus, DEFAULT_PAGE, isExam, undefined, this.refs.filterText.value)
    }

    const filterId = () => {
      this.state = {
        list: [],
        page: DEFAULT_PAGE
      }

      fetchPendingExams(currentStatus, DEFAULT_PAGE, isExam, this.refs.filterId.value, undefined)
    }

    return (
      <div className={styles.layout}>

        <div className={styles.header}>
          <div className={styles.gridHeaderInner}>
            <h1 className={styles.gridCellHeaderLogo}>
              Ясегодня
              <img src="/assets/img/ys_logo.svg" alt="Ясегодня"/>
            </h1>
          </div>
        </div>

        <div className={styles.layoutInner}>
          <div className={styles.grid}>

          <div className={styles.gridCellLayoutMenu14}>
            <div className={styles.gridLayoutMenuInner}>
              <div className={styles.gridCellLayout66}>
                <UserReportsMenu/>
              </div>
            </div>
          </div>
          <div className={styles.gridCellLayoutContentPocket34}>
            <div className={styles.stageBoxSmallPadding}>
                {
                  !isFetching || list.length ? (
                      <div className={styles.chatsGroups}>
                        <button className={styles.btnPrimary} onClick={e => {
                          e.preventDefault()
                          currentStatus = 'waiting'

                          this.state = {
                            list: [],
                            page: DEFAULT_PAGE
                          }

                          fetchPendingExams(currentStatus, DEFAULT_PAGE, isExam)
                        }}>
                          Waiting
                        </button>

                        <div className="divider" />

                        <button className={styles.btnAction} onClick={e => {
                          e.preventDefault()
                          currentStatus = 'done'

                          this.state = {
                            list: [],
                            page: DEFAULT_PAGE
                          }

                          fetchPendingExams(currentStatus, DEFAULT_PAGE, isExam)
                        }}>
                          Done
                        </button>

                        <div className="divider" />

                        <ul className={styles.optionsWhiteMtd30} style={{ display: 'inline-block' }}>
                          {examsTypes.map((val, index) => (
                            <label key={index} style={{ display: 'inline-block' }}>
                              <li name="examsTypes" className={ isExam === val.val ? styles.optionsItemIsActive : styles.optionsItem} id={`examsTypes[${index}]`} onClick={e => {
                                document.getElementById(`examsTypes[${index}]`).className += ' is-active'
                                examsTypes.forEach((v, i) => {
                                  if (index !== i) {
                                    document.getElementById(`examsTypes[${i}]`).className = styles.optionsItem
                                  }
                                })
                              }}>
                                <Field
                                  component='input'
                                  type='radio'
                                  name='examsTypes'
                                  style={{visibility: 'hidden', margin: -5}}
                                  value={val.val}
                                  onClick={() => {
                                    isExam = val.val

                                    this.state = {
                                      list: [],
                                      page: DEFAULT_PAGE
                                    }

                                    fetchPendingExams(currentStatus, DEFAULT_PAGE, isExam)
                                  }}/>
                                {val.text}
                              </li>
                              <span/>
                            </label>
                          ))}
                        </ul>

                        <div className={styles.chatForm}>
                          <div className={styles.chatFormInner}>

                            <Textarea
                              ref="filterId"
                              onKeyDown={e => {
                                if (e.keyCode === 13 && !e.shiftKey) {
                                  this.confirmChoice()
                                }
                              }}
                              placeholder="Поиск..."
                              className={styles.chatFormInnerTextarea}
                            />
                            <div className={styles.btnChat}
                                 onClick={filterId}>
                              <div className={styles.btnChatTitle}>Поиск ID</div>
                              <div className={styles.btnChatIco}>
                                <svg className={styles.svgIcoArrowUp}>
                                  <use xlinkHref="#ico-arrow-up"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={styles.chatForm}>
                          <div className={styles.chatFormInner}>

                            <Textarea
                              ref="filterText"
                              onKeyDown={e => {
                                if (e.keyCode === 13 && !e.shiftKey) {
                                  this.confirmChoice()
                                }
                              }}
                              placeholder="Поиск..."
                              className={styles.chatFormInnerTextarea}
                            />
                            <div className={styles.btnChat}
                                 onClick={filterText}>
                              <div className={styles.btnChatTitle}>Поиск</div>
                              <div className={styles.btnChatIco}>
                                <svg className={styles.svgIcoArrowUp}>
                                  <use xlinkHref="#ico-arrow-up"/>
                                </svg>
                              </div>
                            </div>
                          </div>
                        </div>

                        <ExamsList key="exams" title={isExam ? 'Экзамены' : 'Зачёты'} list={list} isFetching={isFetching} onLoadMore={() => this.loadMore()} unread={0}/>
                        <ReactPaginate previousLabel={'<'}
                          nextLabel={'>'}
                          breakLabel={<a href=''>...</a>}
                          breakClassName={'break-me'}
                          pageCount={this.state.pageCount}
                          marginPagesDisplayed={2}
                          pageRangeDisplayed={5}
                          onPageChange={handlePageClick}
                          containerClassName={'pagination'}
                          subContainerClassName={'pages pagination'}
                          activeClassName={'active'}
                        />
                        {/* <ExamsList key="ladders" title="Зачёты" list={ladders} isFetching={isFetching} onLoadMore={() => this.loadMore()} unread={0}/> */}
                      </div>
                    ) : <div className={styles.textCenter}>
                          <div className={styles.loaderMain}></div>
                        </div>
                }
              </div>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

PendingEvents = reduxForm({
  form: 'examsForm'
})(PendingEvents)

const mapStateToProps = state => {
  const {isFetching, list = [], pageCount} = state.pendingEvents

  return {
    isFetching,
    list,
    pageCount
    // exams: list.filter(event => event.isExam),
    // ladders: list.filter(event => !event.isExam)
  }
}

const mapDispatchToProps = {
  fetchPendingExams
}

PendingEvents = connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingEvents)

export default CSSModules(PendingEvents, styles)
