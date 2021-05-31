import React, { Component } from "react";
import styles from "./styles.css";
import classNames from "classnames/bind";
import { dict } from "../../../dict";
import DateRangePicker from "components/common/DateRangePicker/DateRangePicker";
import { EmptyTable } from "components/common/Table/HeaderCell/EmptyTable";
import { HeaderCell } from "components/common/Table/HeaderCell/HeaderCell";
import Spinner from "components/componentKit2/Spinner";
import { getStatisticChartOptions } from "../utils";
import { getPartnerInfo, setMlmPartnerFilter } from "../ducks";
import { dateFormatter } from "../../Mlm/utils";
import ReactEcharts from "echarts-for-react";
import { compose } from "redux";
import { connect } from "react-redux";
import * as selectors from "../selectors";
import moment from "moment";
import Loader from "../../../components/componentKit/Loader";

const cx = classNames.bind(styles);
const today = moment().local().format("YYYY-MM-DD");

class PartnerStatistic extends Component {
  state = {};

  isDataNotFetched() {
    const { partnerInfo } = this.props;
    return !partnerInfo || partnerInfo.isFetching || !partnerInfo.data;
  }

  isStructureEmpty() {
    const { statistic } = this.props;
    return !statistic && !statistic.data;
  }

  handleDateRangeChanged = (dates) => {
    const { dispatch, partnerInfo, filter } = this.props;
    const { data } = partnerInfo;
    const { user } = data;

    const newDateStart = dates.start.local().format("YYYY-MM-DD");
    const newDateEnd = dates.end.local().format("YYYY-MM-DD");
    dispatch(
      setMlmPartnerFilter({
        ...filter,
        dateStart: newDateStart,
        dateEnd: newDateEnd,
      })
    );
  };

  handleRangeChanged = (e) => {
    const { dispatch, filter, partnerInfo } = this.props;
    const { data } = partnerInfo;
    const { user } = data;
    const rangeValue = e.target.value;
    switch (rangeValue) {
      case "all":
        return dispatch(
          setMlmPartnerFilter({
            ...filter,
            dateStart: "2020-01-01",
            dateEnd: today,
          })
        );
        break;

      case "year":
        return dispatch(
          setMlmPartnerFilter({
            ...filter,
            dateStart: moment().subtract(1, "years").format("YYYY-MM-DD"),
            dateEnd: today,
          })
        );

        break;

      case "month":
        return dispatch(
          setMlmPartnerFilter({
            ...filter,
            dateStart: moment().subtract(1, "months").format("YYYY-MM-DD"),
            dateEnd: today,
          })
        );

        break;

      case "week":
        return dispatch(
          setMlmPartnerFilter({
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
  componentDidUpdate(prevProps) {
    const { dispatch, filter, partnerInfo } = this.props;
    const { data } = partnerInfo;
    const { user } = data;
    if (this.isFilterChanged(this.props.filter, prevProps.filter)) {
      dispatch(getPartnerInfo({ id: user.id, ...this.props.filter }));
    }
  }
  isFilterChanged(filter1, filter2) {
    return JSON.stringify(filter1) !== JSON.stringify(filter2);
  }

  render() {
    const { lang, filter } = this.props;
    const i18n = dict[lang];
    const dataNotFetched = this.isDataNotFetched();
    return (
      <div>
        {this.isDataNotFetched() ? (
          <Loader />
        ) : (
          <article className={styles.summary}>
            <h1 className={styles.header}>
              {i18n["partnerInfo.partnerStatistic.header"]}
            </h1>
            {this.renderFilterForm()}
            <p className={styles.filterForm__summary}>
              {i18n["partnerInfo.partnerStatistic.filter.summary"]}{" "}
              {this.getDataPeriod(filter.dateStart, filter.dateEnd)}
            </p>
            <hr />
            {!dataNotFetched && this.renderRewardSummary()}
            <hr />
            {!dataNotFetched && this.renderStructureGraph()}
            <hr />
            {!dataNotFetched && this.renderHistoryTable()}
          </article>
        )}
      </div>
    );
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

          <div>
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
    const { lang, partnerInfo } = this.props;
    const { data } = partnerInfo;
    const { mlmUserInfo } = data;
    const i18n = dict[lang];
    const pointsAllLevels = mlmUserInfo
      ? mlmUserInfo.pointsLevel1 + mlmUserInfo.pointsLevel2
      : "--";

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
              <span className={styles.summaryNumber}>{pointsAllLevels}</span>
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

  renderStructureGraph() {
    const { lang, partnerInfo } = this.props;
    const i18n = dict[lang];
    const { data } = partnerInfo;
    const { mlmUserInfo } = data;
    const { pointHistoryChartGroups } = mlmUserInfo;
    const { pointsLevel1, pointsLevel2, pointsAll } = pointHistoryChartGroups;
    const chartOptions = getStatisticChartOptions(
      pointsLevel1,
      pointsLevel2,
      pointsAll,
      true,
      (date) => dateFormatter(date, lang)
    );
    return (
      <div className={styles.summary}>
        <p className={styles.summaryTitle}>{i18n["partnerInfo.graph"]}</p>
        <div className={styles.chart}>
          {pointsAll[0] && (
            <ReactEcharts
              className="Chart"
              option={chartOptions}
              style={{ height: 250 }}
            />
          )}
        </div>
        {!pointsAll[0] && (
          <div className={styles.chart_empty}>
            <EmptyTable message={i18n["partnerInfo.tableEmpty"]} />
          </div>
        )}
      </div>
    );
  }
  renderHistoryTable() {
    const { lang, partnerInfo, filter } = this.props;
    const { data } = partnerInfo;
    const { mlmUserPoints } = data;
    const i18n = dict[lang];

    return (
      <div className={styles.summary}>
        <p className={styles.summaryTitle}>{i18n["partnerInfo.history"]}</p>
        {this.isDataNotFetched() && <Spinner />}
        <div className={styles.table}>
          {this.renderHistoryTableHeader()}

          <div className={styles.body}>
            {partnerInfo &&
              data &&
              mlmUserPoints &&
              mlmUserPoints.map((item, i) => {
                return (
                  <div key={`structureTable${i}`} className={styles.row}>
                    <div className={styles.cell}>
                      {moment(item.createTs).format("DD.MM.YYYY")}
                    </div>
                    <div className={styles.cell}>{item.text}</div>
                    <div className={styles.cell}>{item.points}</div>
                  </div>
                );
              })}
          </div>
        </div>
        {!mlmUserPoints[0] && (
          <EmptyTable message={i18n["partnerInfo.tableEmpty"]} />
        )}
      </div>
    );
  }

  renderHistoryTableHeader() {
    const { lang } = this.props;
    const {
      filter: { orderByField, orderByDirection },
    } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.heading}>
        <div className={styles.row}>
          {this.renderHeaderCell(
            "date",
            orderByField,
            orderByDirection,
            i18n["partnerInfo.historyTable.date"]
          )}
          {this.renderHeaderCell(
            "activity",
            orderByField,
            orderByDirection,
            i18n["partnerInfo.historyTable.activity"]
          )}
          {this.renderHeaderCell(
            "points",
            orderByField,
            orderByDirection,
            i18n["partnerInfo.historyTable.points"]
          )}
        </div>
      </div>
    );
  }

  renderHeaderCell(fieldName, orderByField, orderByDirection, label) {
    return (
      <HeaderCell
        className={cx(styles.cell, styles.sort)}
        onClick={this.handleHistoryTableOnSortClick}
        fieldName={fieldName}
        orderByDirection={orderByDirection}
        orderByField={orderByField}
        label={label}
      />
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
    partnerInfo: selectors.selectPartnerInfo(state),
    statistic: selectors.selectMlmStatistic(state),
    filter: state.partnerInfo.mlmPartnerFilter,
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  PartnerStatistic
);
