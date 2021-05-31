import React, { Component } from "react";
import { connect } from "react-redux";
import Layout from "components/componentKit2/Layout";
import { compose } from "redux";
import * as R from "ramda";
import moment from "moment";
import * as ducks from "./ducks";
import * as selectors from "./selectors";
import classNames from "classnames/bind";
import { animateScroll as scroll } from "react-scroll";
import { Breadcrumb } from "components/common/Breadcrumb";
import { dict } from "dict";
import Loader from "components/componentKit/Loader";
import Spinner from "components/componentKit2/Spinner";
import { HeaderCell } from "components/common/Table/HeaderCell/HeaderCell";

import styles from "./styles.css";

const cx = classNames.bind(styles);

const today = moment().local().format("YYYY-MM-DD");

const page = "ratings";

const color = [
  "#cce5ff",
  "#d4edda",
  "#f8d7da",
  "#ffeeba",
  "#d1ecf1",
  "#ff980094",
  "#9c27b082",
  "#4caf50a8",
  "#e91e6385",
  "#3f51b59c",
];

const TAKE = 50;
let hide = false;

const pluralizeStars = (stars, i18n) => {
  const decl1 = 1;
  const decl2x4 = 4;
  const ten = 10;
  if (stars % (ten * ten) >= ten && stars % (ten * ten) < ten + ten)
    return i18n['rating.stars.3'];
  if (stars % ten === decl1) return i18n['rating.stars.1'];
  if (stars % ten > decl1 && stars % ten <= decl2x4) return i18n['rating.stars.2'];
  return i18n['rating.stars.3'];
};

/**
 *  Контейнер Rating.
 *  Используется для отображения страницы реитинги (/ratings)
 *
 */
class Rating extends Component {
  state = {
    filter: {
      orderByDirection: "asc",
      orderByField: "lastName",
      userFilterText: "",
      dateStart: "2020-01-01",
      dateEnd: today,
    },
    firstUserPointsSum: null,
  };

  async componentDidMount() {
    const { dispatch } = this.props;
    await dispatch(ducks.getRatingsList());
    const { ratingsList } = this.props;
    const firstUserPointsSum = ratingsList.data.filter(
      (item) => item.position == 1
    )[0];
    this.setState({ firstUserPointsSum: firstUserPointsSum.sumPoints });
  }

  isDataNotFetched() {
    const { userInfo } = this.props;
    return !userInfo || !userInfo.data || R.isEmpty(userInfo.data);
  }

  scrollToTop = () => {
    scroll.scrollToTop();
  };

  getFIO(item) {
    let fio = item.lastName ? `${item.lastName} ` : "";
    if (item.firstName) {
      fio += item.firstName.slice(0, 1) + ".";
    }
    if (item.middleName) {
      fio += item.middleName.slice(0, 1) + ".";
    }
    return fio;
  }

  getCountryFlag(country) {
    const validatedCountry = country
      ? country.replace(/\s+/g, "").toLowerCase()
      : null;
    switch (validatedCountry) {
      case "россия":
        return (
          <svg className={cx("icon")}>
            <use xlinkHref="#russia" />
          </svg>
        );
        break;

      case "абхазия":
        return (
          <svg className={cx("icon")}>
            <use xlinkHref="#abkhazia" />
          </svg>
        );
        break;
      default:
        return null;
    }
  }

  renderProgressBars = (pointsData) => {
    const { lang } = this.props;
    const { total, poll, sales, social, partner } = pointsData;
    return (
      <div className={cx("collectedStars")}>
        <h2 className={cx("collectedStars__title")}>
          {dict[lang]["ratings.collected-stars"]}
        </h2>
        <div className={cx("collectedStars__tooltip-stars")}>
          <div>
            <span className={cx("collectedStars__tooltip-title")}>
              {dict[lang]["ratings.table.stars"]}
            </span>
            <span className={cx("collectedStars__tooltip-points")}>
              {total.toLocaleString()}
            </span>
          </div>
        </div>
        <hr className={cx("tooltip-hr")} />
        <div className={cx("collectedStars__row")}>
          <div className={cx("collectedStars__row-title-wrapper")}>
            <h3 className={cx("collectedStars__row-title")}>
              {dict[lang]["ratings.testing-after-study"]}
            </h3>
            <div
              className={cx(
                "collectedStars__row-stars",
                "blue-theme",
                "tooltip-stars"
              )}
            >
              <span>{poll.toLocaleString()}</span>
            </div>
          </div>
          <div className={cx("collectedStars__row-bar")}>
            <svg className={cx("svgIcon", "blue-theme")}>
              <use xlinkHref="#star" />
            </svg>
            <div className={cx("collectedStars__row-progressBar")}>
              <div className={cx("progressBar__mainBar", "blue-theme")}></div>
              <div
                className={cx("progressBar__colorBar", "blue-theme")}
                style={{
                  width: `${(poll / total) * 100}%`,
                }}
              ></div>
            </div>
            <div className={cx("collectedStars__row-stars", "blue-theme")}>
              <span>{poll.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className={cx("collectedStars__row")}>
          <div className={cx("collectedStars__row-title-wrapper")}>
            <h3 className={cx("collectedStars__row-title")}>
              {dict[lang]["ratings.activity-3e-med-selling"]}
            </h3>
            <div
              className={cx(
                "collectedStars__row-stars",
                "green-theme",
                "tooltip-stars"
              )}
            >
              <span>{sales.toLocaleString()}</span>
            </div>
          </div>
          <div className={cx("collectedStars__row-bar")}>
            <svg className={cx("svgIcon", "green-theme")}>
              <use xlinkHref="#star" />
            </svg>
            <div className={cx("collectedStars__row-progressBar")}>
              <div className={cx("progressBar__mainBar", "green-theme")}></div>
              <div
                className={cx("progressBar__colorBar", "green-theme")}
                style={{
                  width: `${(sales / total) * 100}%`,
                }}
              ></div>
            </div>
            <div className={cx("collectedStars__row-stars", "green-theme")}>
              <span>{sales.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className={cx("collectedStars__row")}>
          <div className={cx("collectedStars__row-title-wrapper")}>
            <h3 className={cx("collectedStars__row-title")}>
              {dict[lang]["ratings.activity-3e-med-mlm"]}
            </h3>
            <div
              className={cx(
                "collectedStars__row-stars",
                "darkGreen-theme",
                "tooltip-stars"
              )}
            >
              <span>{partner.toLocaleString()}</span>
            </div>
          </div>
          <div className={cx("collectedStars__row-bar")}>
            <svg className={cx("svgIcon", "darkGreen-theme")}>
              <use xlinkHref="#star" />
            </svg>
            <div className={cx("collectedStars__row-progressBar")}>
              <div
                className={cx("progressBar__mainBar", "darkGreen-theme")}
              ></div>
              <div
                className={cx("progressBar__colorBar", "darkGreen-theme")}
                style={{
                  width: `${(partner / total) * 100}%`,
                }}
              ></div>
            </div>
            <div className={cx("collectedStars__row-stars", "darkGreen-theme")}>
              <span>{partner.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className={cx("collectedStars__row")}>
          <div className={cx("collectedStars__row-title-wrapper")}>
            <h3 className={cx("collectedStars__row-title")}>
              {dict[lang]["ratings.level-of-social-media"]}
            </h3>
            <div
              className={cx(
                "collectedStars__row-stars",
                "orange-theme",
                "tooltip-stars"
              )}
            >
              <span>{social.toLocaleString()}</span>
            </div>
          </div>
          <div className={cx("collectedStars__row-bar")}>
            <svg className={cx("svgIcon", "orange-theme")}>
              <use xlinkHref="#star" />
            </svg>
            <div className={cx("collectedStars__row-progressBar")}>
              <div className={cx("progressBar__mainBar", "orange-theme")}></div>
              <div
                className={cx("progressBar__colorBar", "orange-theme")}
                style={{
                  width: `${(social / total) * 100}%`,
                }}
              ></div>
            </div>
            <div className={cx("collectedStars__row-stars", "orange-theme")}>
              <span>{social.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  renderHeader() {
    const { lang, userInfo } = this.props;
    const { data } = userInfo;
    const points = data.pointsAA;
    const pointsData = {
      total: points.userRank.sum.points,
      poll: points.userRank.poll.points,
      sales: points.userRank.sales.points,
      partner: points.userRank.partner.points,
      social: points.userRank.social.points,
    };

    const i18n = dict[lang];
    const items = [i18n["breadcrumb.main"], i18n["ratings.breadcrumbs"]];
    const links = ["/"];
    return (
      <div className={cx(styles.mlmSummaryHeader)}>
        <h2 className={cx(styles.title)}>{i18n["ratings.title"]}</h2>
        <Breadcrumb items={items} links={links} />
        <div className={cx(styles.aboutUser)}>
          <div className={cx(styles.userInfo)}>
            <div className={cx(styles.userAvaWrapper)}>
              <img
                src={data.photo}
                alt="user_photo"
                className={cx(styles.userAva)}
              />
            </div>
            <div className={cx("userNameWrapper")}>
              <div className={cx(styles.userName)}>
                <div className={cx(styles.userLastName)}>{data.lastName}</div>
                <div
                  className={cx(styles.userFirstMiddleName)}
                >{`${data.firstName} ${data.middleName}`}</div>
              </div>
              <div className={cx("userInfo-rating")}>
                <div className={cx("tooltip-container")}>
                  <div className={cx("tooltip-content")}>
                    <span>Здесь будет всплывающая подсказка</span>
                  </div>
                  <span>i</span>
                </div>
                <span>{`Еще ${points.pointsToUpperPosition} ${pluralizeStars(points.pointsToUpperPosition, i18n)} до ${points.userRank.sum.position - 1} места`}</span>
              </div>
            </div>
          </div>
          <div className={cx("ratingInfo")}>
            <div className={cx("ratingInfo__card")}>
              <div className={cx("ratingInfo__place")}>
                <div className={cx("ratingInfo__text")}>
                  <span>{dict[lang]["ratings.place"]}</span>
                  <span className={cx("bigGreen")}>{points.userRank.sum.position}</span>
                </div>
              </div>
            </div>
            <div className={cx("ratingInfo__card")}>
              <div className={cx("ratingInfo__stars")}>
                <div className={cx("ratingInfo__text")}>
                  <span>{dict[lang]["ratings.stars"]}</span>
                  <span className={cx("bigGreen")}>
                    {points.userRank.sum.points}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <hr />
        {this.renderProgressBars(pointsData)}
      </div>
    );
  }

  renderTable() {
    const { lang } = this.props;
    return (
      <div>
        <h2 className={cx("table__title")}>
          {dict[lang]["ratings.table-last-three-monthes"]}
        </h2>
        {this.renderRatingTable()}
      </div>
    );
  }

  renderRatingTable() {
    const { userInfo, ratingsList } = this.props;
    const data = [userInfo.data];
    console.log('ratingsList', ratingsList);
    return (
      <div className={cx("ratingTableWrapper")}>
        <div className={cx("ratingTable")}>
          {this.renderRatingTableHeader()}
          <div className={cx("ratingTable__body")}>
            {ratingsList.data.map((item) => {
              return (
                <div
                  key={`structureTable${item.id}`}
                  className={cx("ratingTable__row")}
                >
                  <div className={cx("ratingTable__cell")}>{item.position}</div>

                  <div className={cx("ratingTable__cell")}>
                    <div className={cx("ratingtable__cell-fio")}>
                      <img
                        src={item.photo}
                        alt="user-ava"
                        className={cx("userAvaMini")}
                      />
                      {this.getFIO(item)}
                    </div>
                  </div>
                  <div
                    className={cx(
                      "ratingTable__cell",
                      "ratingTable__value",
                      "ratingTable__email"
                    )}
                  >
                    {item.specialties}
                  </div>
                  <div className={cx("ratingTable__cell")}>
                    {this.getCountryFlag(item.country)} {item.city}
                  </div>
                  <div className={cx("ratingTable__cell")}>
                    {this.renderProgressBar(item)}
                  </div>
                  <div
                    className={cx(
                      "ratingTable__cell",
                      "ratingTable__value",
                      "ratingTable__stars"
                    )}
                  >
                    {item.sumPoints}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  renderRatingTableHeader() {
    const { lang } = this.props;
    const {
      filter: { orderByField, orderByDirection },
    } = this.state;
    const i18n = dict[lang];
    return (
      <div className={cx("ratingTable__heading")}>
        <div className={cx("ratingTable__row")}>
          {this.renderHeaderCell(
            "rating",
            orderByField,
            orderByDirection,
            i18n["ratings.table.rating"]
          )}
          {this.renderHeaderCell(
            "doctor",
            orderByField,
            orderByDirection,
            i18n["ratings.table.doctor"]
          )}
          {this.renderHeaderCell(
            "position",
            orderByField,
            orderByDirection,
            i18n["ratings.table.position"]
          )}
          {this.renderHeaderCell(
            "location",
            orderByField,
            orderByDirection,
            i18n["ratings.table.location"]
          )}
          {this.renderHeaderCell(
            "progress-bar",
            orderByField,
            orderByDirection,
            i18n["ratings.table.progress-bar"]
          )}
          {this.renderHeaderCell(
            "stars",
            orderByField,
            orderByDirection,
            i18n["ratings.table.stars"]
          )}
        </div>
      </div>
    );
  }

  renderHeaderCell(fieldName, orderByField, orderByDirection, label) {
    return (
      <HeaderCell
        className={cx("ratingTable__head", "ratingTable__sort")}
        fieldName={fieldName}
        orderByDirection={orderByDirection}
        orderByField={orderByField}
        label={label}
      />
    );
  }

  renderProgressBar = (item) => {
    const {
      pollPoints,
      salesPoints,
      socialPoints,
      partnerPoints,
      sumPoints,
    } = item;
    const pointsData = {
      total: sumPoints,
      poll: pollPoints,
      sales: salesPoints,
      partner: partnerPoints,
      social: socialPoints,
    };
    return (
      <div className={cx("ratingTable__progressBarWrapper")}>
        <div className={cx("ratingTable__progressBar-main")}></div>
        <div
          className={cx("ratingTable__progressBar-colors")}
          style={{
            width: `${(sumPoints / this.state.firstUserPointsSum) * 100}%`,
          }}
        >
          <div
            className={cx("ratingTable__progressBar-colors", "orange-theme")}
            style={{ width: `${(sumPoints / sumPoints) * 100}%` }}
          ></div>
          <div
            className={cx("ratingTable__progressBar-colors", "darkGreen-theme")}
            style={{
              width: `${((sumPoints - socialPoints) / sumPoints) * 100}%`,
            }}
          ></div>
          <div
            className={cx("ratingTable__progressBar-colors", "green-theme")}
            style={{
              width: `${
                ((sumPoints - socialPoints - partnerPoints) / sumPoints) * 100
              }%`,
            }}
          ></div>
          <div
            className={cx("ratingTable__progressBar-colors", "blue-theme")}
            style={{ width: `${(pollPoints / sumPoints) * 100}%` }}
          ></div>
        </div>
        <div className={cx("ratingTable__progressBar-tooltip")}>
          {this.renderProgressBars(pointsData)}
        </div>
      </div>
    );
  };

  render() {
    const { userInfo } = this.props;

    const isEmpty = !R.path(["data", "points"], userInfo);
    return (
      <Layout page={page} location={location} buy={true}>
        {this.isDataNotFetched() ? (
          <Loader />
        ) : (
          <div>
            <div className={cx("mlmSummary")}>{this.renderHeader()}</div>
            <div className={cx("mlmSummary")}>{this.renderTable()}</div>
          </div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    ratingsList: selectors.ratingsList(state),
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Rating);
