import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import { fetchPendingPhotos } from '../actions'
import ReactPaginate from 'react-paginate'
import Textarea from 'react-textarea-autosize'

import UserReportsMenu from '../components/userReports/UserReportsMenu'
import PhotosList from '../components/userReports/PhotosList'
import CSSModules from 'react-css-modules'
import styles from './pendingPhotos.css'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_COUNT = 10
let isChecked = null
/**
 *  Контейнер Photos.
 *  Используется для отображения страницы фотографий в админке (/userReports/photos)
 *
 */
class PendingPhotos extends Component {
  /**
   * @memberof PendingPhotos
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {array} propTypes.list Массив с данными
   * @prop {func} propTypes.fetchPendingPhotos Получение данных с сервера
   *
   * */
  static propTypes = {
    list: PropTypes.array.isRequired,
    /**
     * Получение данных с сервера с фото
     * @memberof PendingPhotos
     * @param {number} page - Номер страницы
     * @param {boolean} isChecked - Флаг о проверке
     * @param {number} user - id пользователя
     * @param {string} userFilterText- фильтр
     */
    fetchPendingPhotos:PropTypes.func.isRequired
  }
  componentWillMount() {
    const {fetchPendingPhotos} = this.props
    this.state = {
      list: [],
      page: DEFAULT_PAGE,
      pageCount: DEFAULT_PAGE_COUNT
    }

    fetchPendingPhotos()
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.isFetching && this.props.isFetching) {
      this.setState({
        list: [...nextProps.list],
        pageCount: nextProps.pageCount
      })
    }
  }

  render() {
    const { list, isFetching = true, fetchPendingPhotos } = this.props

    const photosTypes = [
      { text: 'Новые', isChecked: null },
      { text: 'Принятые', isChecked: true },
      { text: 'Отклоненные', isChecked: false }
    ]

    const handlePageClick = data => {
      const nextPage = data.selected + 1
      fetchPendingPhotos(nextPage, isChecked)
      this.setState({page: nextPage})
    }

    // const filterText = () => {
    //   this.state = {
    //     list: [],
    //     page: DEFAULT_PAGE
    //   }
    //
    //   fetchPendingPhotos(DEFAULT_PAGE, isChecked, undefined, this.refs.filterText.value)
    // }

    const filterId = () => {
      this.state = {
        list: [],
        page: DEFAULT_PAGE
      }

      fetchPendingPhotos(DEFAULT_PAGE, isChecked, this.refs.filterId.value, undefined)
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
                { isFetching ? <div className={styles.textCenter}>
                      <div className={styles.loaderMain}></div>
                    </div> : <div>
                      <ul className={styles.optionsWhiteMtd30} style={{ display: 'inline-block' }}>
                        {photosTypes.map((val, index) => (
                          <label key={index} style={{ display: 'inline-block' }}>
                            <li name="photosTypes" className={ isChecked === val.isChecked ? styles.optionsItemIsActive : styles.optionsItem} id={`photosTypes[${index}]`} onClick={e => {
                              document.getElementById(`photosTypes[${index}]`).className += ' is-active'
                              photosTypes.forEach((v, i) => {
                                if (index !== i) {
                                  document.getElementById(`photosTypes[${i}]`).className = styles.optionsItem
                                }
                              })
                            }}>
                              <Field
                                component='input'
                                type='radio'
                                name='photosTypes'
                                style={{visibility: 'hidden', margin: -5}}
                                value={val.val}
                                onClick={() => {
                                  isChecked = val.isChecked

                                  this.state = {
                                    list: [],
                                    page: DEFAULT_PAGE
                                  }

                                  fetchPendingPhotos(DEFAULT_PAGE, isChecked)
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

                      {/* <div className={styles.chatForm}>
                        <div className={styles.chatFormInner}>

                          <Textarea
                            ref="filterText"
                            onKeyDown={e => {
                              if (e.keyCode == 13 && !e.shiftKey) {
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
                      </div> */}

                      <PhotosList list={list}/>

                      <ReactPaginate previousLabel={'<'}
                        nextLabel={'>'}
                        forcePage={this.state.page - 1}
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

PendingPhotos = reduxForm({
  form: 'photosForm'
})(PendingPhotos)

const mapStateToProps = state => {
  const { isFetching, list = [], pageCount } = state.pendingPhotos

  return {
    isFetching,
    list,
    pageCount
  }
}

const mapDispatchToProps = {fetchPendingPhotos}

PendingPhotos = connect(
  mapStateToProps,
  mapDispatchToProps
)(PendingPhotos)

export default CSSModules(PendingPhotos, styles)
