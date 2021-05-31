import React, { Component } from "react";
import styles from "./styles.css";
import classNames from "classnames/bind";
import { dict } from "../../../dict";
import DateRangePicker from "components/common/DateRangePicker/DateRangePicker";
import { EmptyTable } from "components/common/Table/HeaderCell/EmptyTable";
import { HeaderCell } from "components/common/Table/HeaderCell/HeaderCell";
import Spinner from "components/componentKit2/Spinner";
import { getSpendingChartOptions } from "../utils";
import { getPartnerInfo, setMlmPartnerFilter } from "../ducks";
import { dateFormatter } from "../../Mlm/utils";
import ReactEcharts from "echarts-for-react";
import { compose } from "redux";
import { connect } from "react-redux";
import * as selectors from "../selectors";
import moment from "moment";
import Loader from "../../../components/componentKit/Loader";
import { sum } from "ramda";

const cx = classNames.bind(styles);
const today = moment().local().format("YYYY-MM-DD");

class PartnerSpending extends Component {
  state = {
    filter: { orderByDirection: "", orderByField: "" },
    tableFilter: "",
  };

  isDataNotFetched() {
    const { partnerInfo } = this.props;
    return !partnerInfo || partnerInfo.isFetching || !partnerInfo.data;
  }

  isStructureEmpty() {
    const { statistic } = this.props;
    return !statistic && !statistic.data;
  }

  handleDateRangeChanged = (dates) => {
    const { dispatch, filter } = this.props;
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
    const { dispatch, filter } = this.props;
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
  handleTableFilters = (e) => {
    const newFilter = e.target.value;

    switch (newFilter) {
      case "all":
        return this.setState({ tableFilter: "" });
        break;

      case "modules":
        return this.setState({ tableFilter: "video" });
        break;

      case "orders":
        return this.setState({ tableFilter: "product" });
        break;

      default:
        return null;
    }
  };
  componentDidUpdate(prevProps) {
    const { dispatch, partnerInfo } = this.props;
    const { data } = partnerInfo;
    const { user } = data;
    if (this.isFilterChanged(this.props.filter, prevProps.filter)) {
      dispatch(getPartnerInfo({ id: user.id, ...this.props.filter }));
    }
  }
  isFilterChanged(filter1, filter2) {
    return JSON.stringify(filter1) !== JSON.stringify(filter2);
  }

  componentWillUnmount() {}

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
            {!dataNotFetched && this.renderSpendingGraph()}
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
    const { spending } = mlmUserInfo;
    const i18n = dict[lang];

    return (
      <article className={styles.summary}>
        <p className={styles.summaryTitle}>
          {i18n["partnerInfo.spendingStatistic.title"]}
        </p>
        <section className={styles.summaryRow}>
          <section className={styles.pinkBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#one" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["partnerInfo.spendingStatistic.modules"]}
            </p>
            <p className={styles.pinkValue}>
              <span className={styles.summaryNumber}>
                {" "}
                {spending ? spending.modules : "--"}
              </span>
              {i18n["partnerInfo.points"]}
            </p>
          </section>
          <section className={styles.darkBlueBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#two" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["partnerInfo.spendingStatistic.orders"]}
            </p>
            <p className={styles.darkBlueValue}>
              <span className={styles.summaryNumber}>
                {spending ? spending.orders : "--"}
              </span>
              {i18n["partnerInfo.points"]}
            </p>
          </section>
          <section className={styles.purpleBlock}>
            <svg className={styles.svgIcon}>
              <use xlinkHref="#arrow_row" />
            </svg>
            <p className={styles.summaryHeader}>
              {i18n["partnerInfo.spendingStatistic.sum"]}
            </p>
            <p className={styles.purpleValue}>
              <span className={styles.summaryNumber}>
                {spending ? spending.sum : "--"}
              </span>
              {i18n["partnerInfo.points"]}
            </p>
          </section>
        </section>
      </article>
    );
  }

  renderSpendingGraph() {
    const { lang, partnerInfo } = this.props;
    const i18n = dict[lang];
    const { data } = partnerInfo;
    const { mlmUserInfo } = data;
    const { spending } = mlmUserInfo;
    const { modulesChart, ordersChart, sumChart } = spending;
    const chartOptions = getSpendingChartOptions(
      modulesChart,
      ordersChart,
      sumChart,
      true,
      (date) => dateFormatter(date, lang)
    );
    return (
      <div className={styles.summary}>
        <p className={styles.summaryTitle}>
          {i18n["partnerInfo.spendingStatistic.graph"]}
        </p>
        <div className={styles.chart}>
          {sumChart[0] && (
            <ReactEcharts
              className="Chart"
              option={chartOptions}
              style={{ height: 250 }}
            />
          )}
        </div>
        {!sumChart[0] && (
          <div className={styles.chart_empty}>
            <EmptyTable message={i18n["partnerInfo.tableEmpty"]} />
          </div>
        )}
      </div>
    );
  }
  renderHistoryTable() {
    const { tableFilter } = this.state;
    const { lang, partnerInfo } = this.props;
    const { data } = partnerInfo;
    const { mlmUserInfo } = data;
    const { spending } = mlmUserInfo;
    const { sumHistory } = spending;
    const i18n = dict[lang];
    const filteredTable =
      data && sumHistory && tableFilter
        ? sumHistory.filter((item) => item.type === tableFilter)
        : sumHistory;

    return (
      <div className={styles.summary}>
        {this.isDataNotFetched() && <Spinner />}
        {this.renderTableFilters()}
        <div className={styles.table}>
          {this.renderHistoryTableHeader()}

          <div className={styles.body}>
            {filteredTable.map((item) => {
              return (
                <div key={`structureTable${item.id}`} className={styles.row}>
                  <div className={cx(styles.cell, styles.cell_name)}>
                    {item.name}
                  </div>
                  <div className={styles.cell}>{item.quantity}</div>
                  <div className={styles.cell}>{item.price}</div>
                  <div className={styles.cell}>
                    {item.price * item.quantity}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {!sumHistory[0] && (
          <EmptyTable message={i18n["partnerInfo.tableEmpty"]} />
        )}
      </div>
    );
  }

  renderHistoryTableHeader() {
    const { lang } = this.props;
    const {
      filter: { orderByField, orderByDirection },
    } = this.state;
    const i18n = dict[lang];
    return (
      <div className={styles.heading}>
        <div className={styles.row}>
          {this.renderHeaderCell(
            "date",
            orderByField,
            orderByDirection,
            i18n["partnerInfo.history.scores.item"]
          )}
          {this.renderHeaderCell(
            "activity",
            orderByField,
            orderByDirection,
            i18n["partnerInfo.history.scores.quantity"]
          )}
          {this.renderHeaderCell(
            "points",
            orderByField,
            orderByDirection,
            i18n["partnerInfo.history.scores.price"]
          )}
          {this.renderHeaderCell(
            "points",
            orderByField,
            orderByDirection,
            i18n["partnerInfo.history.scores.total"]
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
  renderTableFilters() {
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.filters}>
        <p className={styles.summaryTitle}>{i18n["partnerInfo.history"]}</p>
        <div className={cx(styles.pointTypeFilters)}>
          <button
            className={cx(styles.greenToggleButton)}
            onClick={this.handleTableFilters}
            value="all"
          >
            {i18n["partnerInfo.history.scores.all"]}
          </button>
          <button
            className={cx(styles.greenToggleButton)}
            onClick={this.handleTableFilters}
            value="modules"
          >
            {i18n["partnerInfo.history.scores.modules"]}
          </button>
          <button
            className={cx(styles.greenToggleButton)}
            onClick={this.handleTableFilters}
            value="orders"
          >
            {i18n["partnerInfo.history.scores.orders"]}
          </button>
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
  PartnerSpending
);
