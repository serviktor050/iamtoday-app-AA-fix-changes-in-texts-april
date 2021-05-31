import React from 'react';
import {connect} from 'react-redux';
import classNames from 'classnames/bind';

import ReactPaginate from 'react-paginate';
import Layout from 'components/componentKit2/Layout';
import Loader from '../../../components/componentKit/Loader';
import TabsNav from 'components/common/TabsNav';
import {DateRangeFilter} from './components/DateRangeFilter';
import {SelectFilter} from './components/SelectFilter';
import {Search} from './components/Search';
import {OrdersHistoryTable} from './components/OrdersHistoryTable';
import {Contacts} from './components/Contacts';

import {debounce} from '../../utils/utils';
import {isDataNotFetched} from '../../utils';
import {DEBOUNCE_INTERVAL, ITEMS_PER_PAGE, toDate} from './utils';
import {statusSelectOptions, tabs} from './data';
import {dict} from 'dict';

import {getMineOrdersHistory} from '../ducks';
import {selectMlmMineOrdersHistory} from '../selectors';

import styles from './styles.css';

const cx = classNames.bind(styles);

class OrdersHistory extends React.Component {
  state = {
    activeTab: 'myOrdersHistory',
    isPatientOrders: false,
    currentPage: 0,
    filter: {
      take: ITEMS_PER_PAGE,
      status: null,
      skip: 0,
    },
  };

  componentDidMount() {
    this.getMyOrders();
  }

  getMyOrders = () => this.props.dispatch(getMineOrdersHistory(this.state.filter));

  render() {
    const {activeTab} = this.state;
    const {ordersHistory, managerInfo, lang} = this.props;

    const i18n = dict[lang];

    const updateFilter = (obj, cb = this.getMyOrders) => this.setState(({filter}) => ({filter: {...filter, ...obj}}), cb);
    const handleStatusChange = (status) => this.setState({status}, updateFilter({status}));

    const handleDateRangeFilterChange = (start, end) => {
      return updateFilter({
        dateStart: start && toDate(start),
        dateEnd: end && toDate(end),
      });
    };

    const handlePageChange = ({selected: page}) => {
      this.setState(({filter}) => ({
        currentPage: page,
        filter: {...filter, skip: page * ITEMS_PER_PAGE},
      }), this.getMyOrders);
    };

    const handleTabNavClick = ({name}) => {
      this.setState({
        filter: {
          isPatientOrders: name === 'patientOrdersHistory',
          take: ITEMS_PER_PAGE,
          skip: 0,
        },
        activeTab: name,
      }, this.getMyOrders);
    };

    const handleSearch = debounce((userFilterText) => updateFilter({userFilterText}), DEBOUNCE_INTERVAL);

    const isPatientOrders = activeTab === 'patientOrdersHistory';
    const title = i18n[`mlm.mlmOrdersHistory.${!isPatientOrders ? 'myOrdersTitle' : 'patientOrdersTitle'}`];

    return (
      <Layout page="orders-history" location={this.props.location} buy={true}>

        <div className={cx('wrapper')}>
          <TabsNav setActive={({name}) => name === this.state.activeTab}
            onClick={handleTabNavClick}
            tabNavClass={cx('tabsNavigation--mlmOrdersHistory')}
            mobile="scroll"
            tabs={tabs} />

          <div className={cx('mlmOrdersHistory')}>
            <header className={cx('mlmOrdersHistory__header')}>
              <h1 className={cx('mlmOrdersHistory__title')}>{title}</h1>
              {isPatientOrders && <Search placeholder={i18n['mlm.mlmOrdersHistory.searchText']} onChange={handleSearch} />}

              <div className={cx('mlmOrdersHistory__filters')}>
                <DateRangeFilter onChange={handleDateRangeFilterChange} />
                <div className={cx('mlmOrdersHistory__wrapper')}>
                  {isPatientOrders && <SelectFilter onChange={handleStatusChange}
                    options={statusSelectOptions}
                    value={this.state.status}
                    label={i18n['select.text.1']} />}

                  <p className={cx('mlmOrdersHistory__totalOrders')}>
                    {i18n['mlm.mlmOrdersHistory.totalOrders']}:
                    <span className={cx('mlmOrdersHistory__quantity')}>
                      {ordersHistory && ordersHistory.data && ordersHistory.data.itemsCounter}
                    </span>
                  </p>
                </div>
              </div>
            </header>

            {isDataNotFetched(ordersHistory) ? <Loader /> :
              <OrdersHistoryTable ordersData={ordersHistory.data.data || []} isPatientTable={isPatientOrders} />}

            {ordersHistory && ordersHistory.data && ordersHistory.data.itemsCounter / ITEMS_PER_PAGE > 1 &&
            <ReactPaginate pageCount={Number(ordersHistory.data.itemsCounter / ITEMS_PER_PAGE)}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={handlePageChange}
              forcePage={this.state.currentPage}
              containerClassName={cx('pagination')}
              previousLinkClassName={cx('pagination__nav', 'pagination__nav--previous')}
              nextLinkClassName={cx('pagination__nav', 'pagination__nav--next')}
              activeClassName={cx('pagination__active')}
              disabledClassName={cx('pagination__disabled')}
              breakLabel={'...'}
              previousLabel={''}
              nextLabel={''} />}
          </div>
        </div>

        {!managerInfo ? <Loader /> :
          <Contacts classNameContainer={cx('mlmOrdersHistory__contacts')} managerData={managerInfo} />}
      </Layout>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({dispatch});
const mapStateToProps = (state) => ({
  ordersHistory: selectMlmMineOrdersHistory(state),
  managerInfo: state.userInfo.data.clientManagerInfo,
  lang: state.lang,
});

export const MlmOrdersHistory = connect(mapStateToProps, mapDispatchToProps)(OrdersHistory);
