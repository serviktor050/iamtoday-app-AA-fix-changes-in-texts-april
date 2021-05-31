import React, { Component } from "react";
import { connect } from "react-redux";
import cookie from "react-cookie";
import { dict } from "dict";
import moment from "moment";
import ReactPaginate from 'react-paginate';
import CSSModules from "react-css-modules";
import classNames from "classnames/bind";
import styles from "./salesReports.css";
import DateRangePicker from "../../../components/common/DateRangePicker/DateRangePicker";
import { Breadcrumb } from "../../../components/common/Breadcrumb";
import { HeaderCell } from "components/common/Table/HeaderCell/HeaderCell";
import AdminLayout from "./AdminLayout";
import ReactEcharts from "echarts-for-react";
import { dateFormatter, createLinkWithFilters } from "../utils";
import {
  getAdminSalesPartnersAccess,
  getAdminSalesReport
} from "../../../utils/api.js";
import { getChartOptions } from "./graph";
import Select from "react-select";
import { none } from "ramda";
import * as selectors from "../selectors";


const cx = classNames.bind(styles);
const today = moment().local().format("YYYY-MM-DD");
const ITEMS_PER_PAGE = 10;


const SALES_TYPE_ALL = 0;
const SALES_TYPE_VIDEO = 1;
const SALES_TYPE_MODULES = 2;
const SALES_TYPE_VIPCHAT = 3;
const SALES_TYPE_POINTS = 6;

const page = "salesReport";

const dropdownStyle = {
  option: () => ({
    color: "#4da2d6",
    background: "#DAEFF2",
    padding: 10,
    fontSize: 12,
    borderBottom: "5px solid white",
    width: 600,
  }),
  control: (provided) => ({
    ...provided,
    background: "#DAEFF2",
    borderStyle: none,
    borderRadius: 0,
    width: 600,
  }),
  singleValue: () => ({
    color: "#4da2d6",
    fontSize: 12,
    background: "#DAEFF2",
  }),
};

const renderSearchInputBox = (props) => (
  <div className={styles.searchInputBox}>
    <svg className={styles.svgIconFile}>
      <use xlinkHref="#ico-input-search" />
    </svg>
    <input type="text" {...props} />
  </div>
);

const renderSelectBox = (props) => (
  <div className={styles.selectBox}>
    <label className={styles.selectBoxLabel}>{props.label}</label>
    <select
      value={props.value}
      className={styles.selectBoxSelect}
      onChange={props.onChange}
    >
      {props.options.map((x, index) => {
        return (
          <option key={index} value={x.value}>
            {x.label}
          </option>
        );
      })}
    </select>
  </div>
);

/**
 *  Компонент SalesReports.
 *  Используется для отображения страницы админки
 *
 */
class SalesReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sales: [],
      filter: {
        orderByDirection: "asc",
        orderByField: "lastName",
        userFilterText: "",
        itemId: 0, /*module id, 0 means no moduleId*/
        itemType: SALES_TYPE_ALL, /*product typeId:modules, videos, points , etc.*/
        module: '',
      },
      chartFilter: {
        displayBy: "",
      },
      dateFilter: {
        dateStart: "2020-01-01",
        dateEnd: today,
      },
      isLoaded: false,
      currentPage: 0,
      itemsCounter: 0,
      excelUrl: ""
    };

    this.excelAnchorElement = null;
    this.setExcelAnchorElement = element => { this.excelAnchorElement = element; };
  }

  componentDidMount() {
    const { userInfo } = this.props;
    const token = cookie.load("token");

    getAdminSalesReport({
      take: ITEMS_PER_PAGE,
      skip: 0,
    })
      .then((res) => this.setState({ itemsCounter: res.data.itemsCounter, sales: res.data.data }))
      .catch(console.error);

    getAdminSalesPartnersAccess({
      AuthToken: token,
      Data: {
        userId: userInfo.data.id,
      },
    })
      .then(
        (res) =>
          res.data.data &&
          this.setState({ modulesList: res.data.data, isLoaded: true })
      )
      .catch(console.error);
  }

  componentDidUpdate(prevProps) {
    const { userInfo } = this.props;
    const token = cookie.load("token");
    if (prevProps.userInfo !== this.props.userInfo) {
      getAdminSalesPartnersAccess({
        AuthToken: token,
        Data: {
          skip: 0,
          userId: userInfo.data.id,
        },
      })
        .then(
          (res) =>
            res.data.data &&
            this.setState({ modulesList: res.data.data, isLoaded: true })
        )
        .catch(console.error);
    }

  }

  handleSearchTextOnChange = (e) => {
    const searchName = e.target.value;
    this.setState({
      filter: {
        userFilterText: searchName,
      },
    });
    this.updateTable({ userFilterText: searchName });
  };

  handleSearchTextOnEnter = (e) => {
    if (e && e.key === "Enter") {
      this.handleSearchTextOnChange(e);
    }
  };

  handleModuleOnChange = (newModule) => {
    this.setState({
      filter: {
        itemId: newModule.value,
        itemType: SALES_TYPE_MODULES
      },
    });
    this.updateTable({ itemType: SALES_TYPE_MODULES, itemId: newModule.value });
  };

  handleOtherFilterOnChange = (newFilter) => {
    const { filter } = this.state;
    this.setState({
      ...filter,
      filter: {
        itemType: newFilter.value
      }
    })
    this.updateTable({ itemType: newFilter.value })
  }

  handleTableOnSortClick = (e, orderByField, orderByDirection) => {
    const { filter } = this.state;
    e.preventDefault();
    this.setState({
      filter: {
        ...filter,
        orderByField,
        orderByDirection,
      },
    });
    this.updateTable({
      orderByField: orderByField,
      orderByDirection: orderByDirection,
    });
  };

  updateTable = (props) => {
    const token = cookie.load("token");
    const { dateFilter } = this.state;

    getAdminSalesReport({
      take: ITEMS_PER_PAGE,
      skip: 0,
      ...dateFilter,
      ...props,
    })
      .then((res) =>
        this.setState({
          itemsCounter: res.data.itemsCounter,
          sales: res.data.data,
        })
      )
      .catch(console.error);
  };

  handleDisplayByOnChange = (e) => {
    const newDisplayBy = e.target.value;
    this.setState({
      chartFilter: {
        displayBy: newDisplayBy,
      },
    });
    this.updateChart({ groupByType: newDisplayBy });
  };

  handleDateRangeChanged = (dates) => {
    const newDateStart = dates.start.local().format("YYYY-MM-DD");
    const newDateEnd = dates.end.local().format("YYYY-MM-DD");
    this.setState({
      dateFilter: {
        dateStart: newDateStart,
        dateEnd: newDateEnd,
      },
    });
    this.updateTable({
      dateStart: newDateStart,
      dateEnd: newDateEnd,
    });
  };

  updateChart = (props) => {
    const token = cookie.load("token");
    const { dateFilter } = this.state;

    getAdminSalesReport({
      ...props,
      take: ITEMS_PER_PAGE
    })
      .then((res) =>
        this.setState({
          sales: res.data.data,
        })
      )
      .catch(console.error);
  };

  handlePageChange = ({ selected: page }) => {
    const token = cookie.load("token");
    const { filter, dateFilter } = this.state;

    getAdminSalesReport({
      take: ITEMS_PER_PAGE,
      skip: page * ITEMS_PER_PAGE,
      ...filter,
      ...dateFilter,
    })
      .then((res) => this.setState({ itemsCounter: res.data.itemsCounter, sales: res.data.data }));

    _ => this.setState({ currentPage: page })
  }
 
  

//createLinkWithFilters = (filter1, filter2) => {
 // const modifyFilterObject = (object) => Object.keys(object).map(key=> `${key}=${object[key]}`);
 // const filters = modifyFilterObject(filter1).concat(modifyFilterObject(filter2)).join('&')
 // const excelLinkApi = 'https://dev.todayme.ru/api/payment/paymentItemReport-get-excel?'
 // return `${excelLinkApi}${filters}`
//}

  handleExcelButton = () => {
      //getAdminSalesReportExcel({ ...filter, ...dateFilter })
      //.then(response => {
        //console.log("response:", response)
        //const url = window.URL.createObjectURL(new Blob([response.data],
        //  { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
       // this.excelAnchorElement.href = url;
        //console.log("ref", this.excelAnchorElement.href);

       // })
       //modifyFilter=(filter)=> Object.keys(filter).map(key=> `${key}=${filter[key]}`)
       //const filterArray = this.modifyFilter(filter)
       //const dateFilterArray = this.modifyFilter(dateFilter)
       //const filterString = filterArray.concat(dateFilterArray).join("&")
       
       const url = createLinkWithFilters(this.state.filter, this.state.dateFilter)//`https://dev.todayme.ru/api/payment/paymentItemReport-get-excel?${filterString}`//${yieldByIdSelector(tableData1, index)}`
       this.excelAnchorElement.href = url;
       this.excelAnchorElement.click()
      

  }

  renderHeader() {
    const { lang } = this.props;
    const i18n = dict[lang];
    const items = [i18n["admin.main"], i18n["admin.salesReport.title"]];
    const links = ["/admin"];
    return (
      <div className={cx(styles.salesReportHeader)}>
        <h2 className={cx(styles.title)}>{i18n["admin.salesReport.title"]}</h2>
        <Breadcrumb items={items} links={links} />
        <br />
      </div>
    );
  }

  render() {
    const { isLoaded } = this.state;
    const { sales } = this.props;

    return (
      <AdminLayout page={page} location={location}>
        <div className={cx("salesReport")}>
          {this.renderHeader()}
          {isLoaded && (
            <div>
              {this.renderFilterForm()}
              <hr />
              {this.renderModuleFilterForm()}
              {this.renderOtherFilterForm()}
              {sales && this.renderSalesGraph()}
              {this.renderSalesReportTable()}
            </div>
          )}
        </div>
      </AdminLayout>
    );
  }

  renderModuleFilterForm() {
    const { lang, sales } = this.props;
    const { filter, modulesList } = this.state;
    const i18n = dict[lang];

    const moduleOptions = modulesList
      .filter((item) => item.isChecked)
      .map((item) => ({
        label: item.name,
        value: item.itemId,
      }));
    const allModuleOptions = moduleOptions.unshift({
      label: "все модули",
      value: SALES_TYPE_ALL,
    });
    return (
      <div>
        <div className={styles.moduleFilterForm}>
          <span className={styles.moduleFilterLabel}>
            {i18n["admin.salesReport.options.module.label"]}
          </span>
          <Select
            name="module"
            onChange={this.handleModuleOnChange}
            isSearchable={false}
            placeholder={i18n["admin.salesReport.options.module.placeholder"]}
            options={moduleOptions}
            styles={dropdownStyle}
            components={{
              IndicatorSeparator: () => null,
            }}
          />
        </div>
      </div>
    );
  }

  renderOtherFilterForm = () => {
    const { lang } = this.props;
    const i18n = dict[lang];

    const moduleOptions = [
      { label: i18n["admin.salesReport.options.otherFilters.all"], value: SALES_TYPE_ALL },
      { label: i18n["admin.salesReport.options.otherFilters.modules"], value: SALES_TYPE_MODULES },
      { label: i18n["admin.salesReport.options.otherFilters.video"], value: SALES_TYPE_VIDEO },
      { label: i18n["admin.salesReport.options.otherFilters.vipChat"], value: SALES_TYPE_VIPCHAT },
      { label: i18n["admin.salesReport.options.otherFilters.points"], value: SALES_TYPE_POINTS }
    ];

    return (
      <div>
        <div className={styles.moduleFilterForm}>
          <span className={styles.moduleFilterLabel}>
            {i18n["admin.salesReport.options.otherFilters.label"]}
          </span>
          <Select
            name="otherFilter"
            onChange={this.handleOtherFilterOnChange}
            isSearchable={false}
            placeholder={i18n["admin.salesReport.options.otherFilters.placeholder"]}
            options={moduleOptions}
            styles={dropdownStyle}
            components={{
              IndicatorSeparator: () => null,
            }}
          />
        </div>
      </div>
    );
  }

  renderFilterForm() {
    const { lang } = this.props;
    const { dateFilter, filter } = this.state;
    const i18n = dict[lang];

    const displayOptions = [
      { label: i18n["admin.salesReport.options.displayBy.days"], value: "day" },
      {
        label: i18n["admin.salesReport.options.displayBy.months"],
        value: "month",
      },
    ];

    return (
      <div className={styles.filterForm}>
        <div className={cx(styles.leftFilterPart)}>
          <div className={cx(styles.input, styles.filter)}>
            {renderSearchInputBox({
              value: filter.userFilterText,
              name: "searchText",
              type: "text",
              placeholder: i18n["admin.salesReport.searchText"],
              onChange: this.handleSearchTextOnChange,
              onKeyPress: this.handleSearchTextOnEnter,
            })}
          </div>
          {this.renderExelButton()}
        </div>

        <div className={cx(styles.filterGroup, styles.rightFilterPart)}>
          <div className={styles.filter}>
            <DateRangePicker
              start={dateFilter.dateStart}
              end={dateFilter.dateEnd}
              onChange={this.handleDateRangeChanged}
            />
          </div>
          <div className={styles.filter}>
            {renderSelectBox({
              value: filter.displayBy,
              name: "displayBy",
              placeholder:
                i18n["admin.salesReport.options.displayBy.placeholder"],
              label: i18n["admin.salesReport.options.displayBy.label"],
              onChange: this.handleDisplayByOnChange,
              options: displayOptions,
            })}
            <div className={styles.filters}></div>
          </div>
        </div>
      </div>
    );
  }

  renderExelButton() {
    const { excelUrl } = this.state;
    return (
      <div>
        <div onClick={this.handleExcelButton}>
          <svg className={styles.excelIcon}>
            <use xlinkHref="#ico-excel" />
          </svg>
        </div>
        <a download href='' ref={this.setExcelAnchorElement} ></a>
      </div>
    )
  }
  renderSalesGraph() {
    const { sales } = this.state;
    const { lang } = this.props;
    const chartOptions = getChartOptions(
      sales.paymentItemsHistoryChart,
      true,
      (date) => dateFormatter(date, lang)
    );

    return (
      <div className={styles.chart}>
        <ReactEcharts option={chartOptions} style={{ height: 250 }} />
      </div>
    );
  }

  renderSalesReportTableHeader() {
    const { lang } = this.props;
    const {
      filter: { orderByField, orderByDirection },
    } = this.state;
    const i18n = dict[lang];
    return (
      <div className={styles.heading}>
        <div className={styles.row}>
          {this.renderHeaderCell(
            "lastName",
            orderByField,
            orderByDirection,
            i18n["admin.salesReport.doctor"]
          )}
          {this.renderHeaderCell(
            "date",
            orderByField,
            orderByDirection,
            i18n["admin.salesReport.salesTime"]
          )}
          {this.renderHeaderCell(
            "amount",
            orderByField,
            orderByDirection,
            i18n["admin.salesReport.price"]
          )}
          {this.renderHeaderCell(
            "name",
            orderByField,
            orderByDirection,
            i18n["admin.salesReport.module"]
          )}
        </div>
      </div>
    );
  }

  renderHeaderCell(fieldName, orderByField, orderByDirection, label) {
    return (
      <HeaderCell
        className={cx(styles.cell, styles.sort)}
        onClick={this.handleTableOnSortClick}
        fieldName={fieldName}
        orderByDirection={orderByDirection}
        orderByField={orderByField}
        label={label}
      />
    );
  }

  renderSalesReportTable() {
    const { sales, isLoaded } = this.state;
    const i18n = dict[this.props.lang];
    return (
      <div className={styles.structureTable}>
        <p className={styles.structureTable_summary}>{i18n["admin.salesReport.tableSummary"]}
          {isLoaded && sales && sales.sumAmount} {isLoaded && sales.currency}
        </p>
        {/*{this.isDataNotFetched() && <Spinner/>}*/}
        <div className={styles.table}>
          {this.renderSalesReportTableHeader()}
          <div className={styles.body}>
            {isLoaded &&
              sales &&
              sales.paymentItems &&
              sales.paymentItems.map((item, id) => {
                return (
                  <div key={`structureTable${id}`} className={styles.row}>
                    <div>
                      <button
                        className={cx(styles.cell, styles.cellLink)}
                        onClick={this.handleSearchTextOnChange}
                        value={item.lastName}
                      >
                        {item.lastName} {item.firstName}
                      </button>
                    </div>
                    <div className={styles.cell}>
                      {moment(item.date).format("DD.MM.YY, hh:mm")}
                    </div>
                    <div
                      className={cx(styles.cell, styles.value, styles.email)}
                    >
                      {item.amount} {item.currency}
                    </div>
                    <div className={styles.cell}>{item.name} </div>
                  </div>
                );
              })}
          </div>
        </div>
        {this.renderSalesReportTablePagination()}
      </div>
    );
  }

  renderSalesReportTablePagination = () => {
    const { sales, isLoaded } = this.state;

    return <div className={cx('pagination__container-wrapper')}>
      {isLoaded && sales.paymentItems && Boolean(sales.paymentItems.length) && <ReactPaginate
        pageCount={Number(this.state.itemsCounter / ITEMS_PER_PAGE)}
        subContainerClassName={cx('___')}
        onPageChange={this.handlePageChange}
        forcePage={this.state.currentPage}
        containerClassName={cx('pagination__container')}
        breakLabel={'...'}
        breakClassName={'break-me'}
        activeClassName={cx('pagination__link-active')}
        activeLinkClassName={cx('pagination__link-active')}
        marginPagesDisplayed={2}
        //pageRangeDisplayed={5}
        pageClassName={cx('pagination__link-wrapper')}
        pageLinkClassName={cx('pagination__link')}
        previousLinkClassName={cx('pagination__link-move')}
        nextLinkClassName={cx('pagination__link-move')}
        previousLabel={'<'}
        nextLabel={'>'}
      />}
    </div>
  }

}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

SalesReports = connect(mapStateToProps, mapDispatchToProps)(SalesReports);

export default CSSModules(SalesReports, styles);
