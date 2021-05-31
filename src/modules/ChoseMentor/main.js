import React, { Component } from "react";
import ReactPaginate from 'react-paginate';
import Layout from "components/componentKit2/Layout";
import {Field, reduxForm, submit} from "redux-form";
import { connect } from "react-redux";
import { compose } from "redux";
import style from "./style.css";
import classNames from "classnames/bind";
import { dict } from "../../dict";
import InformingBlock from "../../components/common/InformingBlock";
import * as selectors from "./selectors";
import TableMentor from "./components/table";
import { browserHistory } from "react-router";

const cx = classNames.bind(style);
export const page = "chose-mentor";
class ChooseMentor extends Component {
  state = {
    currentPage: 0,
    isFilterVisible: false,
  }

  openTutorPage = (id) => {
    browserHistory.push(`/chose-mentor/${id}`);
  };

  render() {
    const { location, lang } = this.props;
    const i18n = dict[lang];

    return (
      <Layout
        scroller={true}
        page={page}
        location={location}
      >
        <div className={cx("content")}>
          <h1 className={cx('title')}>{i18n['mentoring.tutors-list.title']}</h1>
          <div className={cx("bread")}>
            <div className={cx("bread__item", "bread__item--link")}>
              Главная
            </div>
            <div className={cx("bread__item")}>3E МЕД</div>
            <div className={cx("bread__item")}>Список наставников</div>
          </div>
          <InformingBlock
            type="alert"
            mainText={i18n["lecture.info-block.message-chose-mentor"]}
            linkText={i18n['lecture.info-block.message-why-i-need-mentor']}
            linkHref={'/faq#tutor'}
            buttonText={i18n["lecture.info-block.btn-chose-mentor"]}
          />
          <div className={cx("arrow-block__container")}>
            <p className={cx("arrow-block__text")}>
              Выберите своего наставника
            </p>
            <div className={cx('arrow-block__ico')}></div>
          </div>
          <div style={{width: '100%'}}>
            <TableMentor handleClick={this.openTutorPage} />
          </div>
        </div>
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

//MlmRegistrationForm = reduxForm({
//    form: 'chooseMentorForm',
//})(MlmRegistrationForm)
const ChoseMentor = reduxForm({form: 'chooseMentorForm'})(ChooseMentor);

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  ChoseMentor
);
