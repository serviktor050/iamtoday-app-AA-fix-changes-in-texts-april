import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/componentKit2/Layout";
import { compose } from "redux";
import * as R from "ramda";
import * as selectors from "./selectors";
import classNames from "classnames/bind";
import Loader from "components/componentKit/Loader";

import styles from "./styles.css";

const page = "virtual-shop";

const cx = classNames.bind(styles);

class Shop extends Component {
  isDataNotFetched() {
    const { userInfo } = this.props;
    return !userInfo || !userInfo.data || R.isEmpty(userInfo.data);
  }

  render() {
    return (
      <Layout page={page} location={location} buy={true}>
        {this.isDataNotFetched() ? <Loader /> : <div>
            <iframe src={'https://online.antiage-expert.com/api/mlm/gotoshop'} className={cx('iframe')}/>
            </div>}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Shop);
