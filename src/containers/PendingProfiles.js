import PropTypes from 'prop-types';
import React, { Component } from 'react';
import {connect} from 'react-redux'
import {fetchPendingProfiles} from '../actions'
import ReactPaginate from 'react-paginate'
import Textarea from 'react-textarea-autosize'

import UserReportsMenu from '../components/userReports/UserReportsMenu'
import ProfilesList from '../components/userReports/ProfilesList'
import CSSModules from 'react-css-modules'
import styles from './pendingProfiles.css'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_COUNT = 10

class UserReports extends Component {
  componentWillMount() {
    const {fetchPendingProfiles} = this.props

    this.state = {
      list: [],
      page: DEFAULT_PAGE,
      pageCount: DEFAULT_PAGE_COUNT
    }
    fetchPendingProfiles(DEFAULT_PAGE)
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
    const {fetchPendingProfiles} = this.props
    const nextPage = this.state.page + 1

    fetchPendingProfiles(nextPage)

    this.setState({page: nextPage})
  }

  render() {
    const {list = true} = this.state
    const {isFetching = true, fetchPendingProfiles} = this.props

    const handlePageClick = data => {
      const nextPage = data.selected + 1

      fetchPendingProfiles(nextPage)

      this.setState({page: nextPage})
    }

    const filterText = userFilterText => {
      this.state = {
        list: [],
        page: DEFAULT_PAGE
      }

      fetchPendingProfiles(DEFAULT_PAGE, undefined, this.refs.filterText.value)
    }

    const filterId = user => {
      this.state = {
        list: [],
        page: DEFAULT_PAGE
      }

      fetchPendingProfiles(DEFAULT_PAGE, this.refs.filterId.value, undefined)
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
                      <div className={styles.pendingProfiles}>
                        <div className={styles.chatForm}>
                          <div className={styles.chatFormInner}>


                            <Textarea
                              ref="filterId"
                              onKeyDown={e => {
                                if (e.keyCode === 13 && !e.shiftKey) {
                                  this.refs.confirmMessage.value = ''
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
                                  this.refs.confirmMessage.value = ''
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

                        <ProfilesList
                          list={list}
                          isFetching={isFetching}
                          onLoadMore={() => this.loadMore()}
                        />
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

const mapStateToProps = state => {
  const {pendingProfiles} = state

  return {
    pendingProfiles,
    isFetching: pendingProfiles.isFetching,
    list: pendingProfiles.list,
    pageCount: pendingProfiles.pageCount
  }
}

const mapDispatchToProps = {
  fetchPendingProfiles
}

UserReports = connect(
  mapStateToProps,
  mapDispatchToProps
)(UserReports)

export default CSSModules(UserReports, styles)
