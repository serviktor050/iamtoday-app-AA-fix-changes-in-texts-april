import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import classNames from "classnames/bind";
import Layout from "components/componentKit2/Layout";
import * as selectors from "../selectors";
import { dict } from "dict";
import { Breadcrumb } from "components/common/Breadcrumb";
import ReactEcharts from "echarts-for-react";
import {
  getChartOptions,
  getRewardsChartOptions,
  getPartnersChartOptions,
} from "./graph";
import { EmptyTable } from "components/common/Table/HeaderCell/EmptyTable";
import { HeaderCell } from "components/common/Table/HeaderCell/HeaderCell";
import Loader from "components/componentKit/Loader";
import Modal from "react-modal";
import PartnerInfo from "../../PartnerInfo/PartnerInfo";
import * as R from "ramda";
import { dateFormatter, getFIO, pluralizeScores } from "../utils";
import DateRangePicker from "components/common/DateRangePicker/DateRangePicker";
import moment from "moment";
import { getMlmHistory, setMlmHistoryFilter, getMlmSummary } from "../ducks";
import Media from "react-media";
import styles from "./styles.css";
import Spinner from "../../../components/componentKit2/Spinner";
import PointsPlank from "../components/PointsPlank.js";

const cx = classNames.bind(styles);

const HISTORY_TYPE_ALL = "all";
const HISTORY_TYPE_POINTS = "points";

const page = "mlm-history";
const today = moment().local().format("YYYY-MM-DD");

class MlmHistory extends Component {
  state = {
    showPartnerInfo: false,
    partnerId: null,
    filter: {
      orderByDirection: "asc",
      orderByField: "lastName",
      dateStart: "2020-01-01",
      dateEnd: today,
    },
  };

  componentDidMount() {
    const { dispatch, filter } = this.props;
    const currUserId = R.path(["userInfo", "data", "id"], this.props);

    dispatch(getMlmHistory({ id: currUserId, ...filter }));
    if (currUserId > 0) {
      dispatch(getMlmSummary({ id: currUserId }));
    }
  }

  handleToggleHistoryType = (e, type) => {
    const { dispatch, filter } = this.props;
    e.preventDefault();
    dispatch(
      setMlmHistoryFilter({
        ...filter,
        withZeroPoints: type === HISTORY_TYPE_ALL,
      })
    );
  };

  handleDateRangeChanged = (dates) => {
    const { dispatch, filter } = this.props;
    const currUserId = R.path(["userInfo", "data", "id"], this.props);
    const newDateStart = dates.start.local().format("YYYY-MM-DD");
    const newDateEnd = dates.end.local().format("YYYY-MM-DD");

    dispatch(
      setMlmHistoryFilter({
        ...filter,
        dateStart: newDateStart,
        dateEnd: newDateEnd,
      })
    );
  };
  handleRangeChanged = (e) => {
    const { dispatch, filter } = this.props;
    const rangeValue = e.target.value;
    switch (rangeValue) {
      case "all":
        return dispatch(
          setMlmHistoryFilter({
            ...filter,
            dateStart: "2020-01-01",
            dateEnd: today,
          })
        );

        break;

      case "year":
        return dispatch(
          setMlmHistoryFilter({
            ...filter,
            dateStart: moment().subtract(1, "years").format("YYYY-MM-DD"),
            dateEnd: today,
          })
        );

        break;

      case "month":
        return dispatch(
          setMlmHistoryFilter({
            ...filter,
            dateStart: moment().subtract(1, "months").format("YYYY-MM-DD"),
            dateEnd: today,
          })
        );

        break;

      case "week":
        return dispatch(
          setMlmHistoryFilter({
            ...filter,
            dateStart: moment().subtract(1, "weeks").format("YYYY-MM-DD"),
            dateEnd: today,
          })
        );

        break;

      default:
        return null;
    }
  };

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const nextUserId = R.path(["userInfo", "data", "id"], nextProps);
    return (
      nextUserId > 0 ||
      this.isFilterChanged(this.props.filter, nextProps.filter)
    );
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { dispatch } = this.props;
    const currUserId = R.path(["userInfo", "data", "id"], this.props);
    const prevUserId = R.path(["userInfo", "data", "id"], prevProps);
    if (
      prevUserId !== currUserId ||
      this.isFilterChanged(this.props.filter, prevProps.filter)
    ) {
      dispatch(getMlmHistory({ id: currUserId, ...this.props.filter }));
      dispatch(getMlmSummary({ id: currUserId }));
    }
  }

  isFilterChanged(filter1, filter2) {
    return JSON.stringify(filter1) !== JSON.stringify(filter2);
  }

  isDataNotFetched() {
    const { history } = this.props;
    return !history || history.isFetching || !history.data;
  }

  isDataNotFetchedSummary() {
    const { summary } = this.props;
    return !summary || summary.isFetching || !summary.data;
  }

  renderHeader() {
    const { lang } = this.props;
    const i18n = dict[lang];
    const items = [
      i18n["breadcrumb.main"],
      i18n["mlm.breadcrumb.mlm"],
      i18n["mlm.breadcrumb.mlmHistory"],
    ];
    const links = ["/", "/mlm"];
    return (
      <div className={cx(styles.mlmHistoryHeader)}>
        <h2 className={cx(styles.title)}>{i18n["mlm.mlmHistory.title"]}</h2>
        <Breadcrumb items={items} links={links} />
        <hr />
      </div>
    );
  }

  render() {
    const { location, lang, filter } = this.props;
    const i18n = dict[lang];
    const isNotFetched = this.isDataNotFetched();
    return (
      <Layout page={page} location={location} buy={true}>
        <div className={cx("mlmHistory")}>
          {this.renderHeader()}
          <div className={styles.info}>
            <svg className={styles.infoIcon}>
              <use xlinkHref="#ico-info" />
            </svg>
            <p>{i18n["mlm.mlmHistory.info"]}</p>
          </div>
        </div>
        <div className={cx("mlmHistory", "no-padding")}>
          {!this.isDataNotFetchedSummary() && this.renderPoints()}
        </div>
        <div className={cx("mlmHistory")}>
          {this.renderFilterForm()}
          <p className={styles.filterForm__summary}>
            {i18n["partnerInfo.partnerStatistic.filter.summary"]}{" "}
            {this.getDataPeriod(filter.dateStart, filter.dateEnd)}
          </p>
          <hr />
          {!isNotFetched && this.renderRewardSummary()}
          {!isNotFetched && this.renderRewardGraph()}
        </div>
        <div className={styles.mlmHistory}>
          {!isNotFetched && this.renderPartnersSummary()}
          {!isNotFetched && this.renderPartnersGraph()}
        </div>
        <div className={styles.mlmHistory}>
          {!isNotFetched && this.renderHistoryTable()}
          {!isNotFetched && this.renderTableSummary()}
        </div>
      </Layout>
    );
  }

  renderPoints() {
    const { summary, lang } = this.props;
    return <PointsPlank summary={summary} lang={lang} />;
  }

  renderFilterForm() {
    const { lang, filter } = this.props;
    const i18n = dict[lang];

    const rangeButtons = [
      { name: i18n["mlm.mlmStructure.filterButton.all"], value: "all" },
      { name: i18n["mlm.mlmStructure.filterButton.week"], value: "week" },
      { name: i18n["mlm.mlmStructure.filterButton.month"], value: "month" },
      { name: i18n["mlm.mlmStructure.filterButton.year"], value: "year" },
    ];

    return (
      <article className={styles.filterForm}>
        <div className={styles.leftSide}>
          <DateRangePicker
            start={filter.dateStart}
            end={filter.dateEnd}
            onChange={this.handleDateRangeChanged}
          />

          <div className={styles.toggleButtonWrapper}>
            {rangeButtons.map((btn) => (
              <button
                onClick={this.handleRangeChanged}
                value={btn.value}
                className={styles.toggleButton}
              >
                {" "}
                {btn.name}{" "}
              </button>
            ))}
          </div>
        </div>
      </article>
    );
  }

  renderRewardSummary() {
    const { lang, history } = this.props;
    const { data } = history;
    const { mlmUserInfo } = data;
    const i18n = dict[lang];

    return (
      <article className={styles.summary}>
        <p className={styles.summaryTitle}>
          {i18n["partnerInfo.rewardSummary.title"]}
        </p>
        <section className={styles.summaryRow}>
          <section className={styles.greenBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#one" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["partnerInfo.rewardSummary.1level"]}
            </p>
            <p className={styles.greenValue}>
              <span className={styles.summaryNumber}>
                {" "}
                {mlmUserInfo ? mlmUserInfo.pointsLevel1 : "--"}
              </span>
              {i18n["partnerInfo.points"]}
            </p>
          </section>
          <section className={styles.orangeBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#two" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["partnerInfo.rewardSummary.2level"]}
            </p>
            <p className={styles.orangeValue}>
              <span className={styles.summaryNumber}>
                {mlmUserInfo ? mlmUserInfo.pointsLevel2 : "--"}
              </span>
              {i18n["partnerInfo.points"]}
            </p>
          </section>
          <section className={styles.blueBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#arrow_row" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["partnerInfo.rewardSummary.allPoints"]}
            </p>
            <p className={styles.blueValue}>
              <span className={styles.summaryNumber}>
                {mlmUserInfo ? mlmUserInfo.pointsSum : "--"}
              </span>
              {i18n["partnerInfo.points"]}
            </p>
          </section>
        </section>
        <hr />
        <section className={styles.summaryRow}>
          <section className={styles.greyBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#arrow_down" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["partnerInfo.rewardSummary.takenPoints"]}
            </p>
            <p className={styles.greyValue}>
              <span className={styles.summaryNumber}>
                {mlmUserInfo ? mlmUserInfo.pointsWithdrawn : "--"}
              </span>
              {i18n["partnerInfo.points"]}
            </p>
          </section>
          <section className={styles.greyBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#arrow_up" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["partnerInfo.rewardSummary.spentPoints"]}
            </p>
            <p className={styles.greyValue}>
              <span className={styles.summaryNumber}>
                {mlmUserInfo ? mlmUserInfo.pointsPayment : "--"}
              </span>
              {i18n["partnerInfo.points"]}
            </p>
          </section>
        </section>
      </article>
    );
  }
  renderRewardGraph() {
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <div>
        <p className={styles.summaryTitle}>
          {i18n["mlm.mlmHistory.rewardGraph"]}
        </p>
        {this.isDataNotFetched() ? (
          <Loader card />
        ) : (
          this.renderRewardGraphData()
        )}
      </div>
    );
  }
  renderRewardGraphData() {
    const { history, lang } = this.props;
    const i18n = dict[lang];
    const { mlmUserInfo } = history.data;
    const { pointHistoryChartGroups } = mlmUserInfo;
    const { pointsLevel1, pointsLevel2, pointsAll } = pointHistoryChartGroups;
    const chartOptions = getRewardsChartOptions(
      pointsLevel1,
      pointsLevel2,
      pointsAll,
      false,
      (date) => dateFormatter(date, lang)
    );
    return (
      <div>
        {pointsAll[0] && (
          <ReactEcharts
            className="Chart"
            option={chartOptions}
            style={{ height: 250 }}
          />
        )}
        {!pointsAll[0] && (
          <div className={styles.chart_empty}>
            <EmptyTable message={i18n["partnerInfo.tableEmpty"]} />
          </div>
        )}
      </div>
    );
  }

  renderPartnersSummary() {
    const { lang, history } = this.props;
    const { data } = history;
    const { mlmUserInfo } = data;
    const i18n = dict[lang];

    const partnerSum = mlmUserInfo
      ? mlmUserInfo.partnersLevel1All + mlmUserInfo.partnersLevel2All
      : "--";
    return (
      <article className={styles.summary}>
        <p className={styles.summaryTitle}>
          {i18n["mlm.mlmHistory.partners.title"]}
        </p>
        <section className={styles.summaryRow}>
          <section className={styles.pinkBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#one" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["mlm.mlmHistory.partners.partnersLevel1"]}
            </p>
            <p className={styles.pinkValue}>
              <span className={styles.summaryNumber}>
                {" "}
                {mlmUserInfo ? mlmUserInfo.partnersLevel1All : "--"}
              </span>
            </p>
          </section>
          <section className={styles.darkBlueBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#two" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["mlm.mlmHistory.partners.partnersLevel2"]}
            </p>
            <p className={styles.darkBlueValue}>
              <span className={styles.summaryNumber}>
                {mlmUserInfo ? mlmUserInfo.partnersLevel2All : "--"}
              </span>
            </p>
          </section>
          <section className={styles.purpleBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#arrow_row" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["mlm.mlmHistory.partners.partnersSum"]}
            </p>
            <p className={styles.purpleValue}>
              <span className={styles.summaryNumber}>{partnerSum}</span>
            </p>
          </section>
        </section>
      </article>
    );
  }

  renderPartnersGraph() {
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <div>
        <p className={styles.summaryTitle}>
          {i18n["mlm.structureGraph.title"]}
        </p>
        {this.isDataNotFetched() ? (
          <Loader card />
        ) : (
          this.renderPartnersGraphData()
        )}
      </div>
    );
  }

  renderPartnersGraphData() {
    const { history, lang } = this.props;
    const i18n = dict[lang];
    const { mlmUserInfo } = history.data;
    const { childMlmUserHistoryChartGroups } = mlmUserInfo;
    const {
      usersLevel1,
      usersLevel2,
      usersAll,
    } = childMlmUserHistoryChartGroups;
    const chartOptions = getPartnersChartOptions(
      usersLevel1,
      usersLevel2,
      usersAll,
      true,
      (date) => dateFormatter(date, lang)
    );
    return (
      <div>
        <div className={styles.chart}>
          {usersAll[0] && (
            <ReactEcharts
              className="Chart"
              option={chartOptions}
              style={{ height: 250 }}
            />
          )}
        </div>
        {!usersAll[0] && (
          <div className={styles.chart_empty}>
            <EmptyTable message={i18n["partnerInfo.tableEmpty"]} />
          </div>
        )}
      </div>
    );
  }
  handleHistoryTableOnSortClick = (e, orderByField, orderByDirection) => {
    const { dispatch, filter } = this.props;
    e.preventDefault();
    dispatch(
      setMlmHistoryFilter({
        ...filter,
        orderByField,
        orderByDirection,
      })
    );
  };

  renderHistoryTableHeader() {
    const {
      lang,
      filter: { orderByField, orderByDirection },
    } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.heading}>
        <div className={styles.row}>
          {this.renderHeaderCell(
            "createTs",
            orderByField,
            orderByDirection,
            i18n
          )}
          {this.renderHeaderCell(
            "userFIO",
            orderByField,
            orderByDirection,
            i18n
          )}
          {this.renderHeaderCell("text", orderByField, orderByDirection, i18n)}
          {this.renderHeaderCell(
            "points",
            orderByField,
            orderByDirection,
            i18n
          )}
        </div>
      </div>
    );
  }

  renderHeaderCell(fieldName, orderByField, orderByDirection, i18n) {
    return (
      <HeaderCell
        className={cx(styles.cell, styles.sort)}
        onClick={this.handleHistoryTableOnSortClick}
        fieldName={fieldName}
        orderByDirection={orderByDirection}
        orderByField={orderByField}
        label={i18n["mlm.pointsHistory." + fieldName]}
      />
    );
  }

  renderHistoryTable() {
    const { history, lang } = this.props;
    const { mlmUserPoints } = history.data;
    const isDataReady = this.isMlmUserPointReady();
    const i18n = dict[lang];
    return (
      <div className={styles.historyTable}>
        {this.renderFilters()}
        <div className={styles.table}>
          {this.renderHistoryTableHeader()}

          {isDataReady && this.renderHistoryTableData()}
        </div>
        {!mlmUserPoints[0] && (
          <EmptyTable message={i18n["partnerInfo.tableEmpty"]} />
        )}
        {isDataReady && (
          <div className={styles.total}>
            <span className={styles.text}>
              {i18n["mlm.pointsHistory.totalPeriodScores"]}
            </span>
            <span className={styles.label}>
              {history.data.mlmUserPoints
                .reduce((a, b) => a + b.points, 0)
                .toFixed(2)}
            </span>
          </div>
        )}
        {this.isDataNotFetched() && (
          <div className={cx(styles.table, styles.loader)}>
            <Spinner />
          </div>
        )}
      </div>
    );
  }

  isMlmUserPointReady() {
    const { history } = this.props;
    return history && history.data && history.data.mlmUserPoints;
  }

  renderHistoryTableData() {
    const { history, lang } = this.props;
    const { mlmUserPoints, user } = history.data;
    const i18n = dict[lang];
    return (
      <div className={styles.body}>
        {mlmUserPoints
          .map((x) => x)
          .reverse()
          .map((item, index) => {
            return (
              <div key={`historyTable${index}`} className={styles.row}>
                <div className={styles.cell}>
                  {moment(item.createTs).format("DD.MM.YYYY")}
                </div>
                <div className={cx(styles.cell)}>
                  {item.userFIO == "Я"
                    ? getFIO(user.lastName, user.firstName, user.middleName)
                    : item.userFIO}
                </div>
                <div className={cx(styles.cell, styles.wrapNormally)}>
                  {item.text}
                </div>
                <div
                  className={cx(styles.cell, styles.scoreValue, {
                    [styles.positive]: item.points > 0,
                    [styles.neutral]: item.points === 0,
                    [styles.negative]: item.points < 0,
                  })}
                >
                  {item.points >= 0 ? `+${item.points}` : item.points}
                </div>
              </div>
            );
          })}
      </div>
    );
  }
  renderTableSummary() {
    const { lang, history, filter } = this.props;
    const { data } = history;
    const { mlmUserInfo } = data;
    const i18n = dict[lang];

    const partnerSum = mlmUserInfo
      ? mlmUserInfo.partnersLevel1 + mlmUserInfo.partnersLevel2
      : "--";

    return (
      <article className={styles.summary}>
        <p className={styles.summaryTitle}>
          {i18n["mlm.mlmStructure.summary.title"]}
          {this.getDataPeriod(filter.dateStart, filter.dateEnd)}
        </p>
        <section className={styles.summaryRow}>
          <section className={styles.greenBlock}>
            <p className={styles.summaryHeader}>
              {i18n["mlm.mlmHistory.newPartners.partnersLevel1"]}
            </p>
            <p className={styles.greenValue}>
              <span className={styles.summaryNumber}>
                {mlmUserInfo ? mlmUserInfo.partnersLevel1 : "--"}
              </span>
            </p>
          </section>
          <section className={styles.greenBlock}>
            <p className={styles.summaryHeader}>
              {i18n["mlm.mlmHistory.newPartners.partnersLevel2"]}
            </p>
            <p className={styles.greenValue}>
              <span className={styles.summaryNumber}>
                {mlmUserInfo ? mlmUserInfo.partnersLevel2 : "--"}
              </span>
            </p>
          </section>
          <section className={styles.darkGreenBlock}>
            <p className={cx(styles.summaryHeader, styles.whiteSummaryHeader)}>
              {i18n["mlm.mlmHistory.newPartners.partnersSum"]}
            </p>
            <p className={styles.darkGreenValue}>
              <span className={styles.summaryNumber}>{partnerSum}</span>
            </p>
          </section>
        </section>
      </article>
    );
  }

  renderFilters() {
    const { filter, lang } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.filters}>
        <p className={styles.summaryTitle}>
          {i18n["mlm.mlmHistory.table.title"]}
        </p>
        <div className={cx(styles.pointTypeFilters)}>
          <div
            onClick={(e) =>
              this.handleToggleHistoryType(e, HISTORY_TYPE_POINTS)
            }
            className={cx(styles.greenToggleButton, {
              [styles.active]: !filter.withZeroPoints,
            })}
          >
            {i18n["mlm.pointsHistory.historyMode.scoresChangesHistory"]}
          </div>
          <div
            onClick={(e) => this.handleToggleHistoryType(e, HISTORY_TYPE_ALL)}
            className={cx(styles.greenToggleButton, {
              [styles.active]: !!filter.withZeroPoints,
            })}
          >
            {i18n["mlm.pointsHistory.historyMode.anyActivityHistory"]}
          </div>
        </div>
      </div>
    );
  }

  getDataPeriod(dateStart, dateEnd) {
    return `${moment(dateStart).format("DD.MM.YYYY")} - ${moment(
      dateEnd
    ).format("DD.MM.YYYY")}`;
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    history: state.mlm.mlmHistory, //selectors.selectMlmHistory(state),
    filter: selectors.selectMlmHistoryFilter(state),
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
  MlmHistory
);
