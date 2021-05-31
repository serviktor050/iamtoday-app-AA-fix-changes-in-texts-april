import React, { Component } from "react";
import styles from "./styles.css";
import classNames from "classnames/bind";
import PartnerSpending from "./components/PartnerSpending";
import PartnerStatistic from "./components/PartnerStatistic";
import PartnerNotes from "./components/PartnerNotes";
import { UncontrolledTooltip } from "reactstrap";
import { dict } from "../../dict";
import { compose } from "redux";
import { connect } from "react-redux";
import { getPartnerInfo } from "./ducks";
import { getCountryFlag } from "./utils.js";
import Avatar from "../../assets/img/png/ava-ph-big.png";
import Loader from "../../components/componentKit/Loader";
import Layout from "components/componentKit2/Layout";
import { Breadcrumb } from "components/common/Breadcrumb";
import TabsNav from "components/common/TabsNav";
import * as selectors from "./selectors";
import moment from "moment";
import { startPrivateChat } from "../utils";


const cx = classNames.bind(styles);
const page = "mlm-partner-info";

const tabs = [
  {
    name: "statistics",
    label: "Статистика баллов",
    icon: "ico-statistic",
  },
  {
    name: "spending",
    label: "Оборот",
    icon: "ico-spending",
  },
  {
    name: "notes",
    label: "Мои заметки",
    icon: "ico-notes",
  },
];
class PartnerInfo extends Component {
  state = {
    activeTab: "statistics",
  };
  componentDidMount() {
    const { id, dispatch, params } = this.props;
    //hiddenOverflow();
    dispatch(getPartnerInfo({ ...params }));
  }

  isDataNotFetched() {
    const { partnerInfo } = this.props;
    return !partnerInfo || partnerInfo.isFetching || !partnerInfo.data;
  }
  goBack() {
    history.back();
  }
  //componentWillUnmount() {
  //unsetOverflow(true);
  //}
  toggleTab = (activeTab) => {
    this.setState({ activeTab });
  };

  renderTabContent = (tabName) => {
    const { lang } = this.props;
    const i18n = dict[lang];

    switch (tabName) {
      case "statistics":
        return <PartnerStatistic />;

      case "spending":
        return <PartnerSpending />;

      case "notes":
        return <PartnerNotes />;
      default:
        return <div />;
    }
  };

  renderHeader() {
    const { lang } = this.props;
    const i18n = dict[lang];
    const items = [
      i18n["breadcrumb.main"],
      i18n["mlm.breadcrumb.mlm"],
      i18n["mlm.breadcrumb.mlmStructure"],
      i18n["mlm.breadcrumb.mlmPartnerInfo"],
    ];
    const links = ["/", "/mlm", "/mlm/structure"];
    return (
      <div>
        <div className={styles.titleContainer}>
          <button className={styles.backButton} onClick={this.goBack}>
            {i18n["mlm.action.back"]}
          </button>
          <h2 className={cx(styles.title)}>
            {i18n["mlm.breadcrumb.mlmPartnerInfo"]}
          </h2>
        </div>
        <Breadcrumb items={items} links={links} />
        <hr />
      </div>
    );
  }

   render() {
    const { activeTab } = this.state;
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <Layout page={page} location={location} buy={true}>
        <div className={styles.mlmPartnerInfo}>
          {this.renderHeader()}
          {this.isDataNotFetched() ? (
            <Loader />
          ) : (
            <div className={styles.userInfoContent}>
              <div className={styles.left}>
                {this.renderPhoto()}
                {this.renderIconButtons()}
              </div>
              <div className={styles.right}>
                {this.renderCardHeader()}
                {this.renderListValues()}
              </div>
            </div>
          )}
        </div>
        <div className={styles.mlmPartnerInfo}>
          <TabsNav
            tabs={tabs}
            setActive={(tab) => {
              return tab.name === activeTab;
            }}
            tabNavClass="tabPartnerInfo"
            onClick={(tab) => this.toggleTab(tab.name)}
            //tabNavClass={styles.tabNavList}
          />

          {this.isDataNotFetched() ? (
            <Loader />
          ) : (
            this.renderTabContent(activeTab)
          )}
        </div>
      </Layout>
    );
  }

  renderCardHeader = () => {
    const { partnerInfo, lang } = this.props;
    const { data } = partnerInfo;
    const { mlmUserInfo, user } = data;
    const i18n = dict[lang];
    return (
      <div className={styles.cardHeader}>
        <div className={styles.cardHeader_name}>
          <p>{user.lastName}</p>
          <p>
            {user.firstName} {user.middleName}
          </p>
        </div>
        <div className={styles.cardHeader_info}>
          <svg
            style={{ width: "30px", height: "30px" }}
            className={styles.cardHeader_icon}
          >
            <use xlinkHref="#ico-level" />
          </svg>
          <p>
            {mlmUserInfo.childLevel} {i18n["partnerInfo.level"]}
          </p>
        </div>
        <div className={styles.cardHeader_info}>
          <svg
            style={{ width: "30px", height: "30px" }}
            className={styles.cardHeader_icon}
          >
            <use xlinkHref="#ico-id" />
          </svg>
          <p>ID {user.id}</p>
        </div>
      </div>
    );
  };

  renderPhoto() {
    const { partnerInfo, lang } = this.props;
    const { data } = partnerInfo;
    const { mlmUserInfo, user } = data;
    const i18n = dict[lang];

    return (
      <div className={styles.photo}>
        <div className={styles.photoContainer}>
          <img
            className={styles.avatar}
            src={user.photo ? user.photo : Avatar}
          />
        </div>
        <p className={styles.lastActive}>
          <span className={styles.lastActivePoint}> </span>
          {i18n["partnerInfo.lastVisit"]}{" "}
          {data.mlmUserInfo.lastActiveDate
            ? moment(mlmUserInfo.lastActiveDate).format("DD MMMM YYYY HH:mm")
            : ""}
        </p>
      </div>
    );
  }

  renderIconButtons() {
    const { partnerInfo, lang } = this.props;
    const { data } = partnerInfo;
    const { user } = data;
    const i18n = dict[lang];
    const onCopyButton = (e) => {
      const copiedText = e.target.value;
      if (navigator && navigator.clipboard) {
        navigator.clipboard.writeText(copiedText);
        this.setState({ isLinkCopied: true });
      }
    };

    return (
      <div className={styles.buttonRow}>
        <button className={styles.iconButton} id={`phonePopover${user.id}`}>
          <svg
            style={{ width: "15px", height: "15px" }}
            className={styles.icon}
          >
            <use xlinkHref="#ico-phone" />
          </svg>
        </button>
        <UncontrolledTooltip
          trigger="click"
          placement="top"
          target={`phonePopover${user.id}`}
          // delay={{hide: 3000}}
          // className={styles.tooltip}
        >
          <div className={styles.tooltip}>
            <span className={styles.tooltipText}>{user.phone}</span>
            <a href={"https://wa.me/" + user.phone}>
              <svg
                style={{ width: "15px", height: "15px" }}
                className={styles.icon}
              >
                <use xlinkHref="#phone" />
              </svg>
            </a>
            <button
              value={user.phone}
              onClick={onCopyButton}
              className={styles.tooltipButton}
            >
              {i18n["mlm.mlmStructure.copyButton"]}
            </button>
          </div>
        </UncontrolledTooltip>

        <button className={styles.iconButton} id={`emailPopover${user.id}`}>
          <svg
            style={{ width: "15px", height: "15px" }}
            className={styles.icon}
          >
            <use xlinkHref="#ico-email" />
          </svg>
        </button>
        <UncontrolledTooltip
          trigger="click"
          placement="top"
          target={`emailPopover${user.id}`}
          // delay={{hide: 3000}}
          // className={styles.tooltip}
        >
          <div className={styles.tooltip}>
            {data.email}
            <button
              value={user.email}
              className={styles.tooltipButton}
              onClick={onCopyButton}
            >
              {i18n["mlm.mlmStructure.copyButton"]}
            </button>
          </div>
        </UncontrolledTooltip>


        <button value={user.id} onClick={()=> startPrivateChat(user.id)} className={styles.iconButton}>
          <svg style={{ width: "15px", height: "15px" }} className={styles.icon}>
            <use xlinkHref="#ico-message" />
          </svg>
        </button>
      </div>
    );
  }
  i18nv(lang, prefix, value, defaultValue = "") {
    if (!value) {
      return defaultValue;
    }
    return dict[lang][`${prefix}.${value}`];
  }

  renderListValues() {
    const { partnerInfo, lang } = this.props;
    const { data } = partnerInfo;
    const { mlmUserInfo, customUserFields, user } = data;
    const timeZone = user.timeZone ? user.timeZone : "";
    const i18n = dict[lang];
    const flag = user.country ? (
      <svg className={styles.icon}>
        <use xlinkHref={getCountryFlag(user.country)} />
      </svg>
    ) : (
      ""
    );
    return (
      <div className={styles.listValues}>
        {this.renderLabelValue(
          i18n["partnerInfo.gender"],
          this.i18nv(lang, "profile", user.gender)
        )}

        {this.renderLabelValue(
          i18n["partnerInfo.address"],
          user.country ? `${user.country} ${user.city} ${timeZone}` : ""
        )}

        {this.renderLabelValue(
          i18n["partnerInfo.birthday"],
          user.birthday ? moment(user.birthday).format("DD.MM.YYYY") : ""
        )}
        {this.renderLabelValue(
          i18n["partnerInfo.workPosition"],
          customUserFields ? customUserFields.workPosition : ""
        )}
        {this.renderLabelValue(
          i18n["partnerInfo.antiAgeExp"],
          customUserFields ? customUserFields.workSeniority : ""
        )}
      </div>
    );
  }

  renderLabelValue(label, value) {
    return (
      <div className={styles.row}>
        <div className={cx(styles.cell, styles.label)}>{label}</div>
        <div className={cx(styles.cell, styles.value)}>{value}</div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    partnerInfo: selectors.selectPartnerInfo(state),
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  PartnerInfo
);
