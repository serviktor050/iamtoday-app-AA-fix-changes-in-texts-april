import React, { Component } from "react";
import cookie from "react-cookie";
import api from "../../../../../utils/api";
import classNames from "classnames/bind";
import styles from "./styles.css";
import { createUserName } from "../../../utils";
import Loader from "../../../../../components/componentKit/Loader";
import { Link, DirectLink, Element, Events, animateScroll as scroll, scrollSpy, scroller } from 'react-scroll';

const cx = classNames.bind(styles);

export default class RecommendedTutorCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tutorInfo: null,
    };
  }

  componentDidMount() {
    const { item } = this.props;
    api
      .getTutorInfo({ AuthToken: cookie.load("token"), data: { id: item } })
      .then((result) => this.setState({ tutorInfo: result.data }));
  }

  renderCard() {
    const user = this.state.tutorInfo.data[0];
    return (
      <div className={cx("tutorCard")}>
        <div className={cx("tutorCard__header")}>
          <img
            src={user.userInfo.photo}
            alt="avatar"
            className={cx("card__avatar")}
          />
          <h4 className={cx("tutorCard__name")}>
            {createUserName({
              lastName: user.userInfo.lastName,
              firstName: user.userInfo.firstName,
              middleName: user.userInfo.middleName,
            })}
          </h4>
        </div>
        <div>
          <span className={cx("card__specialities")}>{user.specialties}</span>
          <div className={cx("card__location")}>
            <svg className={cx("svg-icon")}>
              <use xlinkHref="#russia" />
            </svg>
            <span>{`${user.userInfo.city}, GTM +${
              user.userInfo.timezone || 3
            }:00`}</span>
          </div>
        </div>
      </div>
    );
  }

  isDataNotFetched = (prop) => {
    return !prop || !prop.isSuccess;
  }

  render() {
    const { item, removeTutor, index, placeholder } = this.props;
    if (placeholder) {
      return (
        <Link to='tutorsTable' spy={true} smooth={true} offset={-75} duration={500} className={cx("recommendedTutors__card", 'recommendedTutors__card-placeholder')} >
          <div className={cx('recommendedTutor__addNew')}>
            <div className={cx('recommendedTutor__plusIcon')}></div>
            <span className={cx('recommendedTutor__addNew-text')}>{this.props.i18n['admin.mentoring.recommend-more']}</span>
          </div>
        </Link>
      )
    }
    return (
      <article className={cx("recommendedTutors__card")} key={index}>
        <div className={cx("card__close-container")}>
          <div
            className={cx("card__close-btn")}
            onClick={() => removeTutor(item)}
          ></div>
        </div>
        {this.isDataNotFetched(this.state.tutorInfo) ? (
          <Loader />
        ) : (
          this.renderCard()
        )}
      </article>
    );
  }
}
