import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from 'prop-types';
import * as R from "ramda";
import classNames from "classnames/bind";
import { browserHistory, Link } from "react-router";
import Layout from "components/componentKit2/Layout";
import CheckboxProfile from "components/componentKit/CheckboxProfile";
import { Button } from "components/common/Button";
import * as ducks from "./ducks";
import * as selectors from "./selectors";
import { api, host } from "../../config.js";
import styles from "./styles.css";
import Media from "react-media";
import Modal from "react-modal";
import Loader from "components/componentKit/Loader";
import { loadStripe } from "@stripe/stripe-js";
import { dict } from "dict";
import cookie from "react-cookie";
import { pluralize } from "../../utils/helpers";
import moment from 'moment';
const stripePromise = loadStripe("pk_test_G63wDcC8hMrPqHr8H4zDdFDD");

const cx = classNames.bind(styles);

const page = "buy";

const POINTS_EXCHANGE_RATE = 85;

const COST_DESCR =
  "Базовая стоимость покупки данного учебного материала, предлагаемая всем пользователям.";
const COST_DESCR_PERSONAL =
  "Это специальная цена продукта доступна исключительно для вас.";
const COST_DESCR_SPECIAL =
  "Вы можете оставить заявку на специальную цену. Она будет рассмотрена менеджером и, в случае одобрения, вам придет уведомление и появится пункт со специальной ценой для вас.";
const COST_GENERAL_TITLE = "Обычная цена";
const COST_PERSONAL_TITLE = "Персональная скидка - Скидка";
const COST_ASK_TITLE = "Запросить специальную цену";

const WAYS_TO_BUY = [
  {
    title: "Покупка через Яндекс Кассу",
    text:
      "Вы можете расплатиться за препараты из виртуальной аптеки и учебные материалы с помощью Яндекс.Кассы. Для этого необходимо прикрепить к данному сервису свою банковскую карту. И для совершения покупки в системе 3E MED выберите вариант оплаты - “Яндекс.Касса”. ",
    value: "yandex",
    img: "../../../assets/img/png/yandex_kassa.png",
  },
  // {
  //   title: "Покупка в кредит через Тинькофф",
  //   text:
  //     "Повседневная практика показывает, что сложившаяся структура организации способствует подготовки и реализации позиций, занимаемых участниками в отношении поставленных задач.",
  //   value: "tinkoff",
  //   img: "../../../assets/img/png/tinkoff_bank.png",
  // },
  {
    title: "Покупка за баллы системы 3E MED",
    text:
      "Также вы можете приобрести учебные материалы используя баллы 3E MED, если баланс вашего счета позволяет это сделать.",
    value: "points",
    img: null,
  },
];

const specialIds = [23, 24, 25, 28, 29]

class Buy extends Component {
  state = {
    chat: false,
    contract: false,
    contractChats: false,
    disabled: true,
    moduleInfo: null,
    currentVariant: null,
    currentSum: null,
    firstStepEnd: false,
    validationFirst: true,
    validationSecond: true,
    currentWay: null,
    contactData: null,
    agreedPersonalData: false,
    agreedPersonalDataValidation: true,
    discountModal: false,
  };

  componentDidMount() {
    const { dispatch, userInfo } = this.props;
    const { itemType, itemId, returnUrl } = this.props.location.query;
    const verificationStatus = R.path(["data", "verificationStatus"], userInfo);

    if (parseInt(itemType) === 2 && specialIds.includes(parseInt(itemId))) {
      dispatch(
        ducks.getCost({
          itemType: parseInt(itemType),
          itemId: parseInt(itemId),
        })
      );
    } else {
      if (verificationStatus === 4) {
        dispatch(
          ducks.getCost({
            itemType: parseInt(itemType),
            itemId: parseInt(itemId),
          })
        );
      }
    }

    if (itemType && itemId && returnUrl) {
      dispatch(
        ducks.addToCart({
          itemType: parseInt(itemType),
          itemId: parseInt(itemId),
          returnUrl: `${host}${returnUrl}`,
        })
      );
    }

    dispatch(ducks.getUserPoints({ AuthToken: cookie.load("token") }));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.userInfo !== this.props.userInfo) {
      const verificationStatus = R.path(
        ["data", "verificationStatus"],
        nextProps.userInfo
      );
      const { itemType, itemId, returnUrl } = this.props.location.query;
      if (parseInt(itemType) === 2 && specialIds.includes(parseInt(itemId))) {
        if (!this.props.costList) {
          this.props.dispatch(
            ducks.getCost({
              itemType: parseInt(itemType),
              itemId: parseInt(itemId),
            })
          );
        }
      } else {
        if (verificationStatus === 4 && !this.props.costList) {
          this.props.dispatch(
            ducks.getCost({
              itemType: parseInt(itemType),
              itemId: parseInt(itemId),
            })
          );
        }
      }
    }
  }

  componentWillUnmount() {
    this.props.dispatch(ducks.clearCart());
  }

  handleSubmit = ({ expirationDays, itemType }) => {
    const { cart, dispatch } = this.props;
    const isBeforeJune = moment() < moment('2021-06-01');
    const data = cart.map((item) => {
      if (item.itemType === 3) {
        return {
          ...item,
          expirationDays: isBeforeJune ? 90 : 30,
        };
      }
      return {
        ...item,
        expirationDays,
      };
    });

    const flag = this.state.currentWay;
    const returnUrl = data[0].returnUrl;
    dispatch(ducks.sendPayment(data, flag, returnUrl));
  };

  renderIcon = (item) => {
    if (item.itemType === 3) {
      return (
        <img
          className={cx("tarif__icon")}
          src="/assets/img/antiage/chat.png"
          alt=""
        />
      );
    }
    if (!item.expirationDays) {
      return (
        <img
          className={cx("tarif__icon")}
          src="/assets/img/antiage/infinity.png"
          alt=""
        />
      );
    }
    return (
      <img
        className={cx("tarif__icon")}
        src="/assets/img/antiage/three.png"
        alt=""
      />
    );
  };

  addToCart = (e) => {
    const { returnUrl } = this.props.location.query;
    if (this.state.chat) {
      //this.setState({ disabled: false })
      this.props.dispatch(
        ducks.addToCart({
          removeChat: true,
        })
      );
    } else {
      this.setState({ disabled: true });
      this.props.dispatch(
        ducks.addToCart({
          itemType: 3,
          itemId: 1,
          returnUrl: returnUrl ? `${host}${returnUrl}` : null,
        })
      );
    }

    this.setState({ chat: !this.state.chat, contractChats: false });
  };

  noVerify = () => {
    const { lang } = this.props;
    const status = R.path(["data", "verificationStatus"], this.props.userInfo);
    if (
      !R.path(
        ["data", "id"],
        this.props.userInfo || !this.props.costList || !this.props.costList.data
      )
    ) {
      return <Loader />;
    }
    return (
      <div className={cx("no-verify")}>
        <div className={cx("header")}>{dict[lang]["needVerify"]}</div>
        <div className={cx("content")}>
          <div className={cx("pic")}>
            <img src="/assets/img/antiage/danger.jpg" alt="" />
          </div>
          <div className={cx("info")}>
            <div className={cx("text")}>{dict[lang]["needVerifyText"]}</div>
            <div className={cx("btns")}>
              <Button
                kind={"side"}
                onClick={() => browserHistory.goBack()}
                className={cx("buy-btn")}
              >
                {dict[lang]["back"]}
              </Button>
              <Button
                kind={"main"}
                onClick={() => browserHistory.push("/profile")}
                className={cx("buy-btn")}
              >
                {dict[lang]["toProfile"]}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  onChangeContract = (contract) => {
    let disabled = this.state.contract;

    if (this.state.chat) {
      disabled = !this.state.contract && this.state.contractChats;
      disabled = !disabled;
    }
    this.setState({
      contract: !this.state.contract,
      disabled: disabled,
    });
  };

  onChangeContractChats = (contractChats) => {
    const disabled = this.state.contract && !this.state.contractChats;
    this.setState({
      contractChats: !this.state.contractChats,
      disabled: !disabled,
    });
  };

  renderModuleInfo(costList, lang) {
    const i18n = dict[lang];
    const moduleInfo = costList.data.filter((item) => item.itemType === 2)[0];
    const isBeforeJune = moment() < moment('2021-06-01');
    return (
      <div className={cx("buy")}>
        <div className={cx("buy__title")}>{dict[lang]["buyModule"]}</div>
        <div className={cx("buy__list")}>
          <div className={cx("buy__item")}>
            <div className={cx("tarif")}>
              <div className={cx("tarif__content", "tarif__content-blue")}>
                <div className={cx("tarif__type")}>{"Модуль:"}</div>
                <div className={cx("tarif__title", "tarif__title-blue")}>
                  {moduleInfo.name}
                </div>
              </div>
            </div>
          </div>
          <div className={cx("buy__item")}>
            <div className={cx("tarif")}>
              <div className={cx("tarif__content")}>
                <div className={cx("tarif__type")}>{"Доступ:"}</div>
                <div className={cx("tarif__title")}>{moduleInfo.header}</div>
              </div>
            </div>
          </div>
        </div>
        {this.state.firstStepEnd && (
          <div className={cx("buy__list")}>
            <div className={cx("cart__item")}>
              <div className={cx("cart__icon-price")}></div>
              <div className={cx("cart__item-descr")}>
                <div className={cx("cart__item-title")}>
                  {dict[lang]["buyPrice"]}
                </div>
                <div className={cx("cart__item-points")}>
                  <div className={cx("bigGreen")}>{`${(
                    this.state.currentSum / POINTS_EXCHANGE_RATE
                  )
                    .toFixed(2)
                    .toLocaleString()} `}</div>
                  {`${pluralize(
                    (this.state.currentSum / POINTS_EXCHANGE_RATE).toFixed(0),
                    [
                      i18n["scores.text.1"],
                      i18n["scores.text.2"],
                      i18n["scores.text.3"],
                    ]
                  )}`}
                </div>
              </div>
            </div>
            {this.state.chat && (
              <div className={cx("cart__item")}>
                <div className={cx("cart__icon-chat")}></div>
                <div className={cx("cart__item-descr")}>
                  <div className={cx("cart__item-title")}>
                    {dict[lang]["vipChat"]}
                  </div>
                  <div className={cx("cart__item-points")}>
                    <div className={cx("bigGreen")}>{isBeforeJune ? '90' : `30`}</div>
                    {`${i18n["accessDays"]}`}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  toggleWay = (e) => {
    this.setState({
      currentVariant:
        e.currentTarget.value === "special"
          ? e.currentTarget.value
          : Number(e.currentTarget.value),
    });
  };

  renderCostList = (costList, lang) => {
    const costItem = costList.data.filter((item) => item.itemType !== 3);
    const currentProd = costItem.reduce(
      (acc, cur) => {
        return {
          cost: acc.cost + cur.cost,
          personalCost: acc.personalCost + cur.personalCost,
        };
      },
      { cost: 0, personalCost: 0 }
    );
    const i18n = dict[lang];
    const COST_LIST = [
      currentProd.personalCost
        ? {
            title:
              COST_PERSONAL_TITLE +
              ` ${(1 - currentProd.personalCost / currentProd.cost) * 100}%`,
            text: COST_DESCR_PERSONAL,
            cost: currentProd.personalCost,
            currency: "rubles",
          }
        : {
            title: COST_GENERAL_TITLE,
            text: COST_DESCR,
            cost: currentProd.cost,
            currency: "rubles",
          },
      {
        title: COST_ASK_TITLE,
        text: COST_DESCR_SPECIAL,
        cost: null,
        currency: null,
      },
    ].filter((item) => item);

    return (
      <div
        className={cx(
          "buy__variantsList",
          !this.state.validationFirst && !this.state.currentVariant
            ? "buy__variantsList-red"
            : null
        )}
      >
        {COST_LIST.map((item, index) => this.renderVariant(item, index, i18n))}
      </div>
    );
  };

  changeContactData = (e) => {
    this.setState({ contactData: e.currentTarget.value });
  };

  askForDiscount = (e) => {
    e.preventDefault();
    const { dispatch, costList } = this.props;
    const currentProd = costList.data[0];
    const data = {
      itemType: currentProd.itemType,
      itemId: currentProd.itemId,
      requestText: this.state.contactData,
    };
    if (this.state.agreedPersonalData) {
      dispatch(ducks.createPersonalItemCost(data));
      this.setState({ discountModal: true });
    } else {
      this.setState({ agreedPersonalDataValidation: false });
    }
  };

  renderVariant(item, index, i18n) {
    return (
      <label
        className={cx(
          "variantWayCard",
          item.cost
            ? this.state.currentVariant == item.cost
              ? "variantWayCardBorder"
              : null
            : this.state.currentVariant == "special"
            ? "variantWayCardBorder"
            : null
        )}
        key={index}
      >
        <div className={cx("variantWayCardContent")}>
          <div className={cx("fakeCheckboxWrapper")}>
            <div className={cx("fakeCheckbox")}>
              <div
                className={
                  item.cost
                    ? this.state.currentVariant == item.cost
                      ? styles.fakeCheckboxFill
                      : null
                    : this.state.currentVariant == "special"
                    ? styles.fakeCheckboxFill
                    : null
                }
              ></div>
            </div>
          </div>
          <div className={cx(item.cost && "variantWayDescription")}>
            <span
              className={cx(
                "variantWayTitle",
                item.cost
                  ? this.state.currentVariant == item.cost
                    ? styles["variantWayTitle-blue"]
                    : null
                  : this.state.currentVariant == "special"
                  ? styles["variantWayTitle-blue"]
                  : null
              )}
            >
              {item.title}
            </span>
            <p className={cx("variantWayDescr")}>{item.text}</p>
          </div>
          {item.cost && (
            <div className={cx("pointsWrapper")}>
              <div className={cx("pointsCurrency")}>
                {item.cost && item.currency === "points"
                  ? item.cost.toLocaleString()
                  : (item.cost / POINTS_EXCHANGE_RATE)
                      .toFixed(2)
                      .toLocaleString()}
              </div>
              <div className={cx("pointsText")}>{`${pluralize(
                item.currency === "points"
                  ? item.cost
                  : (item.cost / POINTS_EXCHANGE_RATE).toFixed(0),
                [
                  i18n["scores.text.1"],
                  i18n["scores.text.2"],
                  i18n["scores.text.3"],
                ]
              )}`}</div>
            </div>
          )}
        </div>
        {item.cost === null && this.state.currentVariant === "special" && (
          <div className={cx("withdarwalWayInputWrapper")}>
            <textarea
              className={cx("withdrawalWayTextarea")}
              rows={5}
              placeholder={
                this.state.contactData
                  ? null
                  : "Напишите ваш комментарий для поддержки"
              }
              onChange={this.changeContactData}
            />
            {this.state.discountModal && this.renderDiscountModal()}
            <div className={cx("withdrawalActions")}>
              <button
                className={cx("withdrawalBtn")}
                onClick={this.askForDiscount}
              >{`Отправить заявку`}</button>
              <label
                className={cx(
                  "withdrawalAgreement",
                  this.state.agreedPersonalDataValidation ? null : "note-red"
                )}
              >
                <input
                  type={"checkbox"}
                  className={cx("withdrawalAgreementCheckbox")}
                  checked={this.state.agreedPersonalData}
                  onChange={() => {
                    this.setState({
                      agreedPersonalData: !this.state.agreedPersonalData,
                      agreedPersonalDataValidation: true,
                    });
                  }}
                />
                {`Я согласен на обработку персональных данных`}
              </label>
            </div>
          </div>
        )}
        <input
          id={`variant-${index}`}
          type="radio"
          name="variants"
          value={item.cost ? item.cost : "special"}
          className={cx("variantWayInput")}
          onChange={this.toggleWay}
        />
      </label>
    );
  }

  handleDiscountModal = () => {
    this.setState({ discountModal: false });
  };

  renderDiscountModal = () => {
    return (
      <div className={styles.partnerInfoModal}>
        <Media
          queries={{ desktop: { desktop: "(min-width: 1100px)" }.desktop }}
        >
          {(matches) => {
            return (
              <Modal
                contentLabel={""}
                onRequestClose={this.handleDiscountModal}
                isOpen={this.state.discountModal}
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
                  {`Ваш запрос принят! Его рассмотрит менеджер и через какое-то время даст вам специальную цену на данный учебный материал`}
                </div>
              </Modal>
            );
          }}
        </Media>
      </div>
    );
  };

  toggleVipChat = (e) => {
    const { returnUrl } = this.props.location.query;
    if (this.state.chat) {
      this.props.dispatch(
        ducks.addToCart({
          removeChat: true,
        })
      );
    } else {
      this.setState({ disabled: true });
      this.props.dispatch(
        ducks.addToCart({
          itemType: 3,
          itemId: 1,
          returnUrl: returnUrl ? `${host}${returnUrl}` : null,
        })
      );
    }

    this.setState({ chat: !this.state.chat, contractChats: false });
  };

  renderVipChat(costList, lang) {
    const i18n = dict[lang];
    const vipChat = costList.data[costList.data.length - 1];
    const chat = vipChat.itemType === 3;
    if (chat) {
      return (
        <div>
          <div className={cx("buy__title", "buy__title-green")}>
            {dict[lang]["additional"]}
          </div>
          <div className={cx("buy__variantsList")}>
            <label
              className={cx(
                "variantWayCard",
                this.state.chat ? "variantWayCard-green" : null,
                this.state.chat ? "variantWayCardBorder" : null
              )}
            >
              <div className={cx("variantWayCardContent")}>
                <div className={cx("fakeCheckboxWrapper")}>
                  <div className={cx("fakeCheckbox")}>
                    <div
                      className={
                        this.state.chat
                          ? cx("fakeCheckboxFill", "fakeCheckboxFill-green")
                          : null
                      }
                    ></div>
                  </div>
                </div>
                <div>
                  <span
                    className={cx(
                      "variantWayTitle",
                      this.state.chat ? styles["variantWayTitle-green"] : null
                    )}
                  >
                    {vipChat.header}
                  </span>
                  <p className={cx("variantWayDescr")}>
                    {`${vipChat.text}`}
                    <span className={cx("vipChatDescrPoints")}>{`${(
                      vipChat.cost / POINTS_EXCHANGE_RATE
                    ).toFixed(2)} ${pluralize(
                      (vipChat.cost / POINTS_EXCHANGE_RATE).toFixed(0),
                      [
                        i18n["scores.text.1"],
                        i18n["scores.text.2"],
                        i18n["scores.text.3"],
                      ]
                    )}`}</span>
                  </p>
                </div>
              </div>
              <input
                id={`vipChat`}
                type="checkbox"
                name="vipChat"
                value={vipChat.cost}
                className={cx("variantWayInput")}
                onChange={this.toggleVipChat}
              />
            </label>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }

  validationFirstStep = (e) => {
    e.preventDefault();
    const { cart, costList } = this.props;
    const chat = cart.find((item) => item.itemType === 3);
    if (this.state.currentVariant !== "special") {
      const cartSum = chat
        ? (costList.data.find(
            (elem) =>
              elem.itemType === chat.itemType && elem.itemId === chat.itemId
          ).personalCost ||
            costList.data.find(
              (elem) =>
                elem.itemType === chat.itemType && elem.itemId === chat.itemId
            ).cost) + this.state.currentVariant
        : +this.state.currentVariant;
      if (
        this.state.currentVariant &&
        (this.state.chat
          ? this.state.chat && this.state.contractChats
          : !this.state.chat)
      ) {
        this.setState({
          firstStepEnd: true,
          validationFirst: true,
          currentSum: cartSum,
        });
      } else {
        this.setState({ validationFirst: false });
      }
    }
  };

  validationSecondStep = (e) => {
    e.preventDefault();
    const { costList } = this.props;
    const moduleInfo = costList.data.filter((item) => item.itemType === 2)[0];
    if (
      this.state.currentSum &&
      (this.state.chat
        ? this.state.chat && this.state.contractChats
        : !this.state.chat) &&
      this.state.firstStepEnd &&
      this.state.currentWay &&
      this.state.contract
    ) {
      this.setState({ validationSecond: true });
      this.handleSubmit({
        expirationDays: moduleInfo.expirationDays,
        itemType: moduleInfo.itemType,
      });
    } else {
      this.setState({ validationSecond: false });
    }
  };

  toggleBuyWay = (e) => {
    this.setState({ currentWay: e.currentTarget.value });
  };

  buyPoints = (e) => {
    e.preventDefault();
    e.stopPropagation();
    browserHistory.push("/mlm/points-purchase");
  };

  renderBuyWay(item, index, i18n) {
    const { userPoints } = this.props;
    const currentPoints = userPoints.data.mlmUserInfo.pointsSum;
    return (
      <div
        className={cx(
          "variantWayCardWrapper",
          this.state.currentWay == item.value ? "variantWayCardBorder" : null
        )}
        key={index}
      >
        <label className={cx("variantWayCard")}>
          <div className={cx("variantWayCardContent")}>
            <div className={cx("fakeCheckboxWrapper")}>
              <div className={cx("fakeCheckbox")}>
                <div
                  className={
                    this.state.currentWay == item.value
                      ? styles.fakeCheckboxFill
                      : null
                  }
                ></div>
              </div>
            </div>
            <div className={cx(!item.img && "variantWayDescription")}>
              <span
                className={cx(
                  "variantWayTitle",
                  this.state.currentWay == item.value
                    ? styles["variantWayTitle-blue"]
                    : null
                )}
              >
                {item.title}
              </span>
              <div className={cx("variantWayDescrWrapper")}>
                {item.img && (
                  <div className={cx("variantWayDescrImgWrapper")}>
                    <img className={cx("variantWayDescrImg")} src={item.img} />
                  </div>
                )}
                <p className={cx("variantWayDescr")}>{item.text}</p>
              </div>
              {item.value === "points" &&
                currentPoints <
                  this.state.currentSum / POINTS_EXCHANGE_RATE && (
                  <div className={cx("buyPointsPlaceholder")}></div>
                )}
            </div>
            {item.value === "points" && (
              <div className={cx("pointsWrapper", "text-center")}>
                <div className={cx("pointsTitle")}>
                  {i18n["buyWayPoints.title"]}
                </div>
                <div className={cx("pointsCurrency")}>{currentPoints}</div>
                <div className={cx("pointsText")}>{`${pluralize(currentPoints, [
                  i18n["scores.text.1"],
                  i18n["scores.text.2"],
                  i18n["scores.text.3"],
                ])}`}</div>
                {currentPoints <
                  this.state.currentSum / POINTS_EXCHANGE_RATE && (
                  <div className={cx("notEnoughPoints")}>
                    {i18n["buy.notEnoughPoints"]}
                    <div className={cx("notEnoughPoints-quantity")}>{`${(
                      (this.state.currentSum / POINTS_EXCHANGE_RATE).toFixed(
                        2
                      ) - currentPoints
                    ).toLocaleString()} ${pluralize(
                      (this.state.currentSum / POINTS_EXCHANGE_RATE).toFixed(
                        0
                      ) - currentPoints,
                      [
                        i18n["scores.text.1"],
                        i18n["scores.text.2"],
                        i18n["scores.text.3"],
                      ]
                    )}`}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          <input
            id={`buy-way-${index}`}
            type="radio"
            name="buy-ways"
            value={
              item.value === "points" &&
              currentPoints < this.state.currentSum / POINTS_EXCHANGE_RATE
                ? ""
                : item.value
            }
            className={cx("variantWayInput")}
            onChange={this.toggleBuyWay}
          />
          {/* <div className={cx("variantWayCardBorder")}></div> */}
        </label>
        {item.value === "points" &&
          currentPoints < this.state.currentSum / POINTS_EXCHANGE_RATE && (
            <div className={cx("buyPointsWrapper")}>
              <button
                className={cx("buyPoints")}
                onClick={this.buyPoints}
                type="button"
              >
                {i18n["buy.buyPoints"]}
              </button>
            </div>
          )}
      </div>
    );
  }

  render() {
    const { location, costList, userInfo, lang } = this.props;
    const i18n = dict[lang];
    const verificationStatus = R.path(["data", "verificationStatus"], userInfo);
    const ContractLabel = () => (
      <div
        className={cx(
          "note",
          !this.state.validationSecond && !this.state.contract
            ? "note-red"
            : null
        )}
      >
        {dict[lang]["profile.agreedContract.1"]}
        <Link
          to="/offer?contract=true"
          target="_blank"
          className={styles.noteLink}
        >
          {dict[lang]["profile.agreedContract.2"]}
        </Link>
      </div>
    );
    const ContractChatsLabel = () => (
      <div
        className={cx(
          "note",
          !this.state.validationFirst && !this.state.contractChats
            ? "note-red"
            : null
        )}
      >
        {dict[lang]["agreedContractChats.1"]}
        <Link
          to="/offer?contractChats=true"
          target="_blank"
          className={cx("noteLink")}
        >
          {dict[lang]["agreedContractChats.2"]}
        </Link>
      </div>
    );

    const isPointsUnavailable = location.query.zeroCost

    return (
      <Layout page={page} location={location} buy={true}>
        {costList && costList.isLoad && !costList.isError ? (
          <div>
            {this.renderModuleInfo(costList, lang)}
            {!this.state.firstStepEnd && (
              <div className={cx("buy")}>
                <div className={cx("buy__step")}>{dict[lang]["step1"]}</div>
                <div className={cx("buy__title")}>
                  {dict[lang]["selectVariant"]}
                </div>
                {this.renderCostList(costList, lang)}
                {!isPointsUnavailable && this.renderVipChat(costList, lang)}
                <div className={cx("firstStepFooter")}>
                  <button
                    className={cx("endFirstStepBtn")}
                    onClick={this.validationFirstStep}
                  >
                    {dict[lang]["endStep1"]}
                  </button>
                </div>
                {this.state.chat && (
                  <div className={cx("acceptVipChat")}>
                    <label className={cx("acceptVipChat-label")}>
                      <input
                        type="checkbox"
                        onChange={() => {
                          this.setState({
                            contractChats: !this.state.contractChats,
                          });
                        }}
                        checked={this.state.contractChats}
                      />
                      {ContractChatsLabel()}
                    </label>
                  </div>
                )}
              </div>
            )}
            {this.state.firstStepEnd && (
              <div className={cx("buy")}>
                <div className={cx("buy__step")}>{dict[lang]["step2"]}</div>
                <div className={cx("buy__title")}>
                  {dict[lang]["selectBuyWay"]}
                </div>
                <div
                  className={cx(
                    "buy__variantsList",
                    !this.state.validationSecond && !this.state.currentWay
                      ? "buy__variantsList-red"
                      : null
                  )}
                >
                  {isPointsUnavailable ? 
                  WAYS_TO_BUY.slice(0, (WAYS_TO_BUY.length - 1)).map((item, index) =>
                    this.renderBuyWay(item, index, i18n)
                  )
                  : WAYS_TO_BUY.map((item, index) =>
                    this.renderBuyWay(item, index, i18n)
                  )}
                </div>
                <div className={cx("secondStepFooter")}>
                  <button
                    className={cx("endSecondStepBtn")}
                    onClick={this.validationSecondStep}
                  >
                    {dict[lang]["buy"]}
                  </button>
                  <button
                    className={cx("backToFirstStepBtn")}
                    onClick={() => {
                      this.setState({ firstStepEnd: false });
                    }}
                  >
                    {dict[lang]["backToStep1"]}
                  </button>
                </div>
                <div className={cx("acceptVipChat")}>
                  <label className={cx("acceptVipChat-label")}>
                    <input
                      type="checkbox"
                      onChange={() => {
                        this.setState({
                          contract: !this.state.contract,
                        });
                      }}
                      checked={this.state.contract}
                    />
                    {ContractLabel()}
                  </label>
                </div>
              </div>
            )}
          </div>
        ) : costList && costList.isFetching ? (
          <Loader />
        ) : 
        verificationStatus !== 4 ? (
          this.noVerify()
        ) : 
        (
          <div className={cx("wrap")}>{dict[lang]["isError"]}</div>
        )}
      </Layout>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    cart: selectors.cart(state),
    costList: selectors.costList(state),
    userInfo: selectors.userInfo(state),
    userPoints: selectors.userPoints(state),
    lang: selectors.lang(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(Buy);
