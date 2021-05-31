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
import { getMlmSummary } from "../ducks";
import * as selectors from "../selectors";
import styles from "./style.css";
import { pluralizeScores } from "../utils";
import Media from "react-media";
import Modal from "react-modal";
import cookie from "react-cookie";
import * as ducks from "../ducks";
import InputProfile from "components/componentKit/InputProfile";

const cx = classNames.bind(styles);

const page = "mlm-points-withdrawal";

const PURCHASE_WAYS = [
  {
    title: "Наличными",
    descr:
      "Вы можете конвертировать накопленные баллы в наличные. Для этого нужно отправить заявку в свободной форме. После менеджер проекта свяжется с Вами для уточнения подробностей. ",
    value: "cash",
  },
  {
    title: "На банковский счет",
    descr:
      "Также вы можете вывести накопленные баллы на банковский счет. Для этого отправьте заявку в свободной форме. После менеджер проекта свяжется с Вами для уточнения реквизитов. ",
    value: "bank",
  },
  {
    title: "Купить продукты",
    descr: "Купить продукты в виртуальной аптеке",
    value: "shop",
  },
];

export const SUCCESS_MODAL_TEXT =
  "Ваш запрос принят! Его рассмотрит менеджер и через какое-то время свяжется с вами для уточнения данных";
export const UNSUCCESS_MODAL_TEXT =
  "Произошла ошибка. Попробуйте обновить страницу и повторите запрос!";

class WithdrawalPoints extends Component {
  constructor(props) {
    super(props);

    this.state = {
      customPoints: 0,
      readyOffer: null,
      withdrawalType: null,
      agreed: false,
      contactData: null,
      validation: true,
      modal: false,
      success_modal: false,
    };

    this.togglePoints = this.togglePoints.bind(this);
    this.toggleWay = this.toggleWay.bind(this);
    this.changeContactData = this.changeContactData.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    const { summary } = this.props;
    const { mlmUserInfo } = summary.data;
    if (
      (Number(e) >= 0 && Number(e) <= Number(mlmUserInfo.pointsSum)) ||
      e.length === 0
    ) {
      this.setState({ customPoints: e, readyOffer: false });
    }
  }

  toggleWay(e) {
    this.setState({ withdrawalType: e.currentTarget.value });
  }

  changeContactData(e) {
    this.setState({ contactData: e.currentTarget.value });
  }

  validation(e) {
    e.preventDefault();
    if (
      this.state.agreed && this.state.contactData && this.state.readyOffer
        ? this.state.readyOffer
        : this.state.customPoints
    ) {
      this.setState({ validation: true });
      this.handleSubmit();
    } else {
      this.setState({ validation: false });
    }
  }

  handleSubmit(e) {
    const { dispatch, summary } = this.props;
    const { mlmUserInfo } = summary.data;
    const token = cookie.load("token");
    const data = {
      points: this.state.readyOffer
        ? mlmUserInfo.pointsSum
        : this.state.customPoints,
      text: this.state.contactData ? this.state.contactData : "",
    };
    dispatch(ducks.withdrawPoints(data));
    this.setState({ modal: true });
  }

  handleModal = () => {
    this.setState({ modal: false });
  };

  renderModal = () => {
    const { withdrawal } = this.props;
    return (
      <div className={styles.partnerInfoModal}>
        <Media
          queries={{ desktop: { desktop: "(min-width: 1100px)" }.desktop }}
        >
          {(matches) => {
            return (
              <Modal
                contentLabel={""}
                onRequestClose={this.handleModal}
                isOpen={this.state.modal}
                style={{
                  content: {
                    width: matches.desktop ? "50%" : "90%",
                    height: "50%",
                    top: "190px",
                    bottom: "60px",
                    left: "50%",
                    marginRight: "-50%",
                    transform: "translate(-50%)",
                  },
                }}
              >
                <div className={cx("modalContent")}>
                  {withdrawal.isError
                    ? UNSUCCESS_MODAL_TEXT
                    : SUCCESS_MODAL_TEXT}
                </div>
              </Modal>
            );
          }}
        </Media>
      </div>
    );
  };

  renderHeader() {
    const { lang, userInfo, summary } = this.props;
    const { mlmUserInfo } = summary.data;
    const { data } = userInfo;
    const i18n = dict[lang];
    const items = [
      i18n["breadcrumb.main"],
      i18n["mlm.breadcrumb.mlm"],
      i18n["mlm.breadcrumb.mlmPointsWithdrawal"],
    ];
    const links = ["/", "/mlm"];
    return (
      <div className={cx(styles.mlmSummaryHeader)}>
        <h2 className={cx(styles.title)}>
          {i18n["mlm.points.points-withdrawal.title"]}
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

  renderBuyCard() {
    const points = 520;
    return (
      <label className={styles.pointsToBuyCardStart} for={`points-${points}`}>
        <div className={styles.pointsToBuyCustom_title}>{`Все`}</div>
        <span className={styles.pointsToBuy_points}>{`${points} баллов`}</span>
        <span className={styles.pointsToBuy_rubles}>{`${(
          points * 85
        ).toLocaleString()} ₽`}</span>
        <input
          id={`points-${points}`}
          type="radio"
          name="points"
          value={points * 85}
          className={styles.pointsInput}
        />
      </label>
    );
  }

  renderPurchaseWay(item) {
    return (
      <label
        className={cx(
          "purchase__card",
          "purchase__card-label",
          this.state.withdrawalType === item.value
            ? cx("purchase__card-active")
            : null
        )}
      >
        <div className={cx("purchase__card-header")}>
          <div className={cx("fakeCheckbox")}>
            <div
              className={
                this.state.withdrawalType === item.value
                  ? cx("fakeCheckboxFill")
                  : null
              }
            ></div>
          </div>
          <div className={cx("purchase__card-title")}>{item.title}</div>
        </div>
        <div className={cx("purchase__card-content")}>
          <p className={cx("purchase__card-descr", "purchase__card-descr-100")}>
            {item.descr}
          </p>
          {item.value === "shop" && (
            <a
              target="_blank"
              href="https://online.antiage-expert.com/api/mlm/gotoshop"
              className={styles.withdrawalShopBtn}
            >{`Перейти в магазин`}</a>
          )}
        </div>
        {item.value !== "shop" && this.state.withdrawalType === item.value && (
          <div className={styles.withdarwalWayInputWrapper}>
            <textarea
              className={cx(
                "withdrawalWayTextarea",
                !this.state.validation
                  ? !this.state.contactData
                    ? "red-border"
                    : null
                  : null
              )}
              rows={5}
              placeholder={
                this.state.contactData
                  ? null
                  : "Оставьте свои контактные данные. Менеджер свяжется с Вами для уточнения реквизитов."
              }
              onChange={this.changeContactData}
            />
            {this.state.modal && this.renderModal()}
            <div className={styles.withdrawalActions}>
              <button
                className={styles.withdrawalBtn}
                onClick={this.validation}
              >{`Отправить заявку`}</button>
              <label
                className={cx(
                  "withdrawalAgreement",
                  !this.state.validation
                    ? !this.state.agreed
                      ? "red"
                      : null
                    : null
                )}
              >
                <input
                  type={"checkbox"}
                  className={styles.withdrawalAgreementCheckbox}
                  checked={this.state.agreed}
                  onChange={() => {
                    this.setState({ agreed: !this.state.agreed });
                  }}
                />
                {`Я согласен на обработку персональных данных`}
              </label>
            </div>
          </div>
        )}
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

  renderPurchaseWays() {
    return (
      <div className={styles.content}>
        <div className={styles.purchaseWays}>
          <span className={styles.label}>{`Способ вывода баллов`}</span>
          <div className={styles.purchaseCardsWrapper}>
            {PURCHASE_WAYS.map((item) => this.renderPurchaseWay(item))}
          </div>
        </div>
      </div>
    );
  }

  renderShop() {
    const { lang, userInfo, summary } = this.props;
    const { mlmUserInfo } = summary.data;
    const { data } = userInfo;
    const i18n = dict[lang];
    return (
      <div className={styles.content}>
        <div className={styles.pointsToBuy}>
          <span className={styles.label}>
            {dict[lang]["mlm.points.points-withdrawal.how-much"]}
          </span>
          <div className={cx("purchase__cards")}>
            <div
              className={cx("purchase__card", "purchase__card-50")}
              style={{ cursor: "pointer" }}
              onClick={() => {
                this.setState({ readyOffer: true });
              }}
            >
              <div className={cx("purchase__card-header")}>
                <div className={cx("fakeCheckbox")}>
                  <div
                    className={
                      this.state.readyOffer ? cx("fakeCheckboxFill") : null
                    }
                  ></div>
                </div>
                <div className={cx("purchase__card-title")}>
                  {i18n["mlm.points.points-withdrawal.withdrawal-all"]}
                </div>
              </div>
              <div className={cx("puchase__readyOffers")}>
                <label
                  className={cx(
                    this.state.readyOffer
                      ? `readyOffer__card-blue-active`
                      : `readyOffer__card-blue`
                  )}
                >
                  <span
                    className={cx(
                      "readyOffer__rubles",
                      this.state.readyOffer && "text-white"
                    )}
                  >{`${(
                    mlmUserInfo.pointsSum * 85
                  ).toLocaleString()} руб.`}</span>
                  <div
                    className={cx(
                      "readyOffer__pointsWrapper-blue",
                      this.state.readyOffer && "text-white"
                    )}
                  >
                    <span
                      className={cx("readyOffer__points-number")}
                    >{`${mlmUserInfo.pointsSum}`}</span>
                    <span
                      className={cx("readyOffer__points-text")}
                    >{` ${i18n["scores.text.3"]}`}</span>
                  </div>
                  <input
                    type="radio"
                    name="readyOffer"
                    className={styles.purchaseWayInput}
                    onChange={this.toggleReadyOffers}
                    onClick={() => {
                      this.setState({ readyOffer: true });
                    }}
                  />
                </label>
              </div>
            </div>
            <div
              className={cx(
                "purchase__card",
                "purchase__card-50",
                !this.state.validation
                  ? !this.state.customPoints && !this.state.readyOffer
                    ? "red-border"
                    : null
                  : null
              )}
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
                  {i18n["mlm.points.points-withdrawal.withdrawal-custom"]}
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
                    placeholder={
                      i18n["mlm.points.points-purchase.points-quantity"]
                    }
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
                    val={(
                      Number(this.state.customPoints) * 85
                    ).toLocaleString()}
                    remote={true}
                    placeholder={
                      i18n["mlm.points.points-purchase.sum-in-rubbles"]
                    }
                    cls={cx("purchase__card-input")}
                  />
                </div>
              </div>
            </div>
          </div>
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
    withdrawal: selectors.selectWithdrawal(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  WithdrawalPoints
);
