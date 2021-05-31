import React, { Component } from "react";
import { connect } from "react-redux";
import * as R from "ramda";
import { compose } from "redux";
import classNames from "classnames/bind";
import Layout from "components/componentKit2/Layout";
import { dict } from "dict";
import { pluralize } from "utils/helpers";
import { Breadcrumb } from "components/common/Breadcrumb";
import { browserHistory } from "react-router";
import { Button } from "components/common/Button";
import Loader from "components/componentKit/Loader";
import MlmSummaryCard from "../MlmSummaryCard/MlmSummaryCard";
import { api, host } from "../../../config.js";
import { getMlmSummary } from "../ducks";
import * as selectors from "../selectors";
import * as ducks from "../ducks";
import styles from "./style.css";
import cookie from "react-cookie";
import { pluralizeScores } from "../utils";
import InputProfile from "components/componentKit/InputProfile";

const cx = classNames.bind(styles);

const page = "mlm-points-purchase";

const READY_OFFERS = [50, 100, 250];

const PURCHASE_WAYS = [
  {
    title: "Покупка через Яндекс Кассу",
    descr:
      "Вы можете приобрести баллы с помощью Яндекс.Кассы. Для этого необходимо прикрепить к данному сервису свою банковскую карту. И для совершения покупки в системе 3E MED выберите вариант оплаты - “Яндекс.Касса”. ",
    value: "yandex",
    img: "../../../../assets/img/png/yandex_kassa.png",
  },
  {
    title: "Покупка через Stripe",
    descr:
      "Также баллы можно приобрести, используя платежный сервис Stripe. Он позволяет принимать платежи в разных валютах и доступен для жителей США, Великобритании, Австралии, Канады и некоторых стран Европы.",
    value: "stripe",
    img: "../../../../assets/img/png/stripe.png",
  },
];

class PurchasePoints extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPoints: null,
      customPoints: 100,
      purchaseType: null,
      readyOffer: null,
      agreed: false,
      validation: true,
    };

    this.togglePoints = this.togglePoints.bind(this);
    this.toggleWay = this.toggleWay.bind(this);
    this.toggleReadyOffers = this.toggleReadyOffers.bind(this);
    this.validation = this.validation.bind(this);
  }

  isDataNotFetched() {
    const { summary } = this.props;
    return !summary || summary.isFetching || !summary.data;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const currUserId = R.path(["userInfo", "data", "id"], this.props);
    if (currUserId > 0) {
      dispatch(getMlmSummary({ id: currUserId }));
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { dispatch } = this.props;
    const currUserId = R.path(["userInfo", "data", "id"], this.props);
    const prevUserId = R.path(["userInfo", "data", "id"], prevProps);
    if (prevUserId !== currUserId) {
      dispatch(getMlmSummary({ id: currUserId }));
    }
  }

  togglePoints(e) {
    if (((Number(e) >= 0 && Number(e) <= 10000) && !e.includes('.')) || e.length === 0) {
      this.setState({ customPoints: e, readyOffer: false });
    }
  }

  toggleWay(e) {
    this.setState({ purchaseType: e.currentTarget.value });
  }

  toggleReadyOffers(e) {
    this.setState({
      currentPoints: Number(e.currentTarget.value),
      readyOffer: true,
    });
  }

  validation(e) {
    e.preventDefault();
    if (
      this.state.purchaseType &&
      this.state.agreed &&
      (this.state.readyOffer
        ? this.state.currentPoints
        : this.state.customPoints)
    ) {
      this.setState({ validation: true });
      this.handleSubmit();
    } else {
      this.setState({ validation: false });
    }
  }

  handleSubmit() {
    const { dispatch, lang, location } = this.props;
    const backUrl = new URLSearchParams(location.search).get('returnUrl')
    const token = cookie.load("token");
    const data = [
      {
        itemType: 6,
        amount: this.state.readyOffer
          ? this.state.currentPoints
          : this.state.customPoints,
        returnUrl: backUrl ? backUrl:  "https://online.antiage-expert.com/",
      },
    ];

    const flag = this.state.purchaseType;

    dispatch(ducks.sendPayment(data, flag));
  }

  renderHeader() {
    const { lang, userInfo, summary } = this.props;
    const { mlmUserInfo } = summary.data;
    const { data } = userInfo;
    const i18n = dict[lang];
    const items = [
      i18n["breadcrumb.main"],
      i18n["mlm.breadcrumb.mlm"],
      i18n["mlm.breadcrumb.mlmPointsPurchase"],
    ];
    const links = ["/", "/mlm"];
    return (
      <div className={cx(styles.mlmSummaryHeader)}>
        <h2 className={cx(styles.title)}>
          {i18n["mlm.points.points-purchase.title"]}
        </h2>
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
            <div className={cx(styles.userName)}>
              <div className={cx(styles.userLastName)}>{data.lastName}</div>
              <div
                className={cx(styles.userFirstMiddleName)}
              >{`${data.firstName} ${data.middleName}`}</div>
            </div>
          </div>
          <div className={cx(styles.userPoints)}>
            <div className={cx(styles.userCashIcon)}></div>
            <div className={cx(styles.userPointsContent)}>
              <div className={cx(styles.userPointsTitle)}>
                {i18n["mlm.points.title"]}
              </div>
              <div
                className={cx(styles.userPointCurrent)}
              >{`${mlmUserInfo.pointsSum}`}</div>
            </div>
          </div>
        </div>
        <hr />
      </div>
    );
  }

  renderReadyOffer(points, index) {
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <label
        className={cx(
          this.state.currentPoints == points && this.state.readyOffer
            ? `readyOffer__card-${index + 1}-active`
            : `readyOffer__card-${index + 1}`
        )}
      >
        <span
          className={cx(
            "readyOffer__rubles",
            this.state.currentPoints == points &&
              this.state.readyOffer &&
              "text-white"
          )}
        >{`${(points * 85).toLocaleString()} руб.`}</span>
        <div
          className={cx(
            "readyOffer__pointsWrapper",
            this.state.currentPoints == points &&
              this.state.readyOffer &&
              "text-white"
          )}
        >
          <span className={cx("readyOffer__points-number")}>{`${points}`}</span>
          <span
            className={cx("readyOffer__points-text")}
          >{` ${i18n["scores.text.3"]}`}</span>
        </div>
        <input
          id={points}
          type="radio"
          name="points"
          value={points}
          className={styles.purchaseWayInput}
          onChange={this.toggleReadyOffers}
          onClick={() => {
            this.setState({ readyOffer: true });
          }}
        />
      </label>
    );
  }

  renderBuyCards() {
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <div>
        <div className={cx("purchase__card")}>
          <div className={cx("purchase__card-header")}>
            <div className={cx("fakeCheckbox")}>
              <div
                className={
                  this.state.readyOffer ? cx("fakeCheckboxFill") : null
                }
              ></div>
            </div>
            <div className={cx("purchase__card-title")}>
              {i18n["mlm.points.points-purchase.select-ready-offer"]}
            </div>
          </div>
          <div className={cx("puchase__readyOffers")}>
            {READY_OFFERS.map((item, index) =>
              this.renderReadyOffer(item, index)
            )}
          </div>
        </div>
        <div
          className={cx("purchase__card")}
          style={{ cursor: "pointer" }}
          onClick={() => {
            this.setState({ readyOffer: false });
          }}
        >
          <div className={cx("purchase__card-header")}>
            <div className={cx("fakeCheckbox")}>
              <div
                className={
                  !this.state.readyOffer ? cx("fakeCheckboxFill") : null
                }
              ></div>
            </div>
            <div className={cx("purchase__card-title")}>
              {i18n["mlm.points.points-purchase.select-custom"]}
            </div>
          </div>
          <div className={cx("puchase__customQuantity")}>
            <div className={cx("inputWrapper")}>
              <InputProfile
                meta={{}}
                input={{
                  name: "customQuantity",
                  onChange: this.togglePoints,
                }}
                val={this.state.customPoints}
                remote={true}
                placeholder={i18n["mlm.points.points-purchase.points-quantity"]}
                cls={cx("purchase__card-input")}
              />
            </div>
            {/* <div className={cx("arrow-right")}> */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className={cx("arrow-right")}
            >
              <path
                d="M3.3335 8L12.6668 8"
                stroke="#E6EFF4"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M8 3.33336L12.6667 8.00002L8 12.6667"
                stroke="#E6EFF4"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            {/* </div> */}
            <div className={cx("inputWrapperDis")}>
              <InputProfile
                meta={{}}
                input={{
                  name: "customResult",
                  onChange: () => {},
                }}
                val={(Number(this.state.customPoints) * 85).toLocaleString()}
                remote={true}
                placeholder={i18n["mlm.points.points-purchase.sum-in-rubbles"]}
                cls={cx("purchase__card-input")}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderPurchaseWay(item) {
    return (
      <label
        className={cx(
          "purchase__card",
          "purchase__card-label",
          this.state.purchaseType === item.value
            ? cx("purchase__card-active")
            : null
        )}
      >
        <div className={cx("purchase__card-header")}>
          <div className={cx("fakeCheckbox")}>
            <div
              className={
                this.state.purchaseType === item.value
                  ? cx("fakeCheckboxFill")
                  : null
              }
            ></div>
          </div>
          <div className={cx("purchase__card-title")}>{item.title}</div>
        </div>
        <div className={cx("purchase__card-content")}>
          <p className={cx("purchase__card-descr")}>{item.descr}</p>
          <div className={cx("purchase__card-imgWrapper")}>
            <img src={item.img} alt={item.value} />
          </div>
        </div>
        <input
          id={item.value}
          type="radio"
          name="purchase-way"
          value={item.value}
          className={styles.purchaseWayInput}
          onChange={this.toggleWay}
        />
      </label>
    );
  }

  renderShop() {
    const { lang } = this.props;
    return (
      <div className={styles.content}>
        <div className={styles.pointsToBuy}>
          <span className={styles.label}>
            {dict[lang]["mlm.points.points-purchase.how-much"]}
          </span>
          {this.renderBuyCards()}
        </div>
      </div>
    );
  }

  renderPurchaseWays() {
    return (
      <div className={styles.content}>
        <div className={styles.purchaseWays}>
          <span className={styles.label}>{`Способ покупки`}</span>
          <div
            className={cx(
              "purchaseCardsWrapper",
              !this.state.validation
                ? !this.state.purchaseType
                  ? "red-border"
                  : null
                : null
            )}
          >
            {PURCHASE_WAYS.map((item) => this.renderPurchaseWay(item))}
          </div>
        </div>
        <div className={styles.footer}>
          <div className={styles.agreement}>
            <label
              for={`agreed`}
              className={cx(
                "agreementLabel",
                !this.state.validation
                  ? !this.state.agreed
                    ? "red"
                    : null
                  : null
              )}
            >
              <input
                type="checkbox"
                id="agreed"
                checked={this.state.agreed}
                onChange={() => this.setState({ agreed: !this.state.agreed })}
                className={styles.agreementCheckbox}
              />
              {`Я принимаю условия `}
              <a
                className={cx(
                  !this.state.validation
                    ? !this.state.agreed
                      ? "red"
                      : null
                    : null
                )}
                href={`#`}
              >{`договора`}</a>
            </label>
          </div>
          <button
            className={cx("btnGoToPay")}
            onClick={this.validation}
          >{`Перейти к оплате`}</button>
        </div>
      </div>
    );
  }

  render() {
    const { location, lang } = this.props;
    const i18n = dict[lang];
    return (
      <Layout page={page} location={location} buy={true}>
        {this.isDataNotFetched() ? (
          <Loader />
        ) : (
          <div>
            <div className={cx("mlmSummary")}>
              {this.renderHeader()}
              {this.renderShop()}
            </div>
            <div className={cx("mlmSummary")}>{this.renderPurchaseWays()}</div>
          </div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    summary: selectors.selectMlmSummary(state),
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  PurchasePoints
);
