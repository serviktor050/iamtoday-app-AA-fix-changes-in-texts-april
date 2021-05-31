import React, { Component } from 'react';
import classNames from "classnames/bind";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dict } from "dict";
import ReactPaginate from 'react-paginate';

import Layout from '../../../components/componentKit2/Layout';
import Loader from '../../../components/componentKit/Loader';
import { DiplomCard } from '../components/DiplomCard';
import { isDataNotFetched } from '../../utils';
import * as selectors from '../selectors';
import * as ducks from '../ducks';
import ProfileTabs from '../Tabs';
import styles from './styles.css';

const cx = classNames.bind(styles);

const page = 'diploms';

const ITEMS_PER_PAGE = 10;

class Diploms extends Component {
  constructor(props) {
    super(props)
    this.state = {  currentPage: 0, }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const payload = { take: ITEMS_PER_PAGE, skip: 0 }
    dispatch(ducks.getUserDiploms(payload));
  }

  handlePageChange = ({ selected: page }) => {
    this.props.dispatch(ducks.getUserDiploms({ take: ITEMS_PER_PAGE, skip: page * ITEMS_PER_PAGE }, 
      _ => this.setState({ currentPage: page })));
  };
  
  render() {
    const { lang, diploms } = this.props;
    const i18n = dict[lang];

    return (
      <Layout page={page} location={location} >
        <ProfileTabs />
        <section className={cx('layout')}>
          <h1 className={cx('title')}>{i18n['profile.diploms']}</h1>
          <div className={cx('info')}><span>{i18n['profile.diploms.info']}</span></div>
          {isDataNotFetched(diploms) ? <Loader /> : diploms.data.map(item => 
            <DiplomCard key={item.id} diplom={item} /> )}
          {!isDataNotFetched(diploms) && diploms.itemsCounter > ITEMS_PER_PAGE && <ReactPaginate 
              pageCount={Number(diploms.itemsCounter / ITEMS_PER_PAGE)}
              activeLinkClassName={cx('diplomsPaginate__link-active')}
              previousLinkClassName={cx('diplomsPaginate__link-move')}
              containerClassName={cx('diplomsPaginate__container')}
              activeClassName={cx('diplomsPaginate__link-active')}
              nextLinkClassName={cx('diplomsPaginate__link-move')}
              pageClassName={cx('diplomsPaginate__link-wrapper')}
              pageLinkClassName={cx('diplomsPaginate__link')}
              onPageChange={this.handlePageChange}
              forcePage={this.state.currentPage}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              previousLabel={'<'}
              breakLabel={'...'}
              nextLabel={'>'}
            />}
        </section>
      </Layout>
    )
  }
}

const mapStateToProps = state => ({ lang: state.lang, diploms: selectors.selectUserDiploms(state) });
const mapDispatchToProps = dispatch => ({ dispatch });

export default Diploms = compose(connect(mapStateToProps, mapDispatchToProps))(Diploms)
