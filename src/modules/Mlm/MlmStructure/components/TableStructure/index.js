import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import moment from "moment";
import classNames from "classnames/bind";
import { UncontrolledTooltip } from "reactstrap";
import { Link, browserHistory } from "react-router";
import * as selectors from "../../../selectors";
import Media from "react-media";
import Modal from "react-modal";
import { dict } from "dict";
import { getMlmStructure, getMlmStatisticData } from "../../../ducks";
import { HeaderCell } from "components/common/Table/HeaderCell/HeaderCell";
import DateRangePicker from "components/common/DateRangePicker/DateRangePicker";
import Spinner from "components/componentKit2/Spinner";
import styles from "./styles.css";
import PartnerInfo from "../../../../PartnerInfo/PartnerInfo";
import { filter } from "core-js/fn/array";
import { getFlag } from "../../../utils";


const debounce = require("lodash.debounce");
const cx = classNames.bind(styles);
const page = "mlm-structure";
const today = moment().local().format("YYYY-MM-DD");

const renderSearchInputBox = (props) => (
    <div className={styles.searchInputBox}>
        <svg className={styles.svgIconFile}>
            <use xlinkHref="#ico-input-search" />
        </svg>
        <input type="text" {...props} />
    </div>
);

const renderLevelSelectBox = (props) => (
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


class TableStructure extends Component {
    state = {
        showPartnerInfo: false,
        filter: {
            orderByDirection: "asc",
            orderByField: "lastName",
            userFilterText: "",
            dateStart: "2020-01-01",
            dateEnd: today,
        },
        isCopied: false,
        noData: 0,
    };

    constructor(props, context) {
        super(props, context);
        this.handleHistoryTableOnSortClick = this.handleHistoryTableOnSortClick.bind(
            this
        );
        this.handleSearchTextOnChange = this.handleSearchTextOnChange.bind(this);
        this.handleSearchTextOnEnter = this.handleSearchTextOnEnter.bind(this);
        this.handleLevelOnChange = this.handleLevelOnChange.bind(this);
        this.handlePartnerInfoClose = this.handlePartnerInfoClose.bind(this);
        this.handleUserFIOOnClick = this.handleUserFIOOnClick.bind(this);
        this.handleStatusOnChange = this.handleStatusOnChange.bind(this);
        this.debounceRefreshData = debounce(this.refreshData.bind(this), 500);
    }

    componentDidMount() {
        const { dispatch } = this.props;
        const { filter } = this.state;

        dispatch(getMlmStatisticData({ ...filter }));
        //dispatch(getMlmStructure({ ...filter }));
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const { dispatch } = this.props;
        if (this.isFilterChanged(this.state.filter, prevState.filter)) {
            if (this.isTextChanged(this.state.filter, prevState.filter)) {
                this.debounceRefreshData(dispatch);
            } else {
                this.refreshData(dispatch);
            }
        }
    }


    handlePartnerInfoClose() {
        this.setState({ showPartnerInfo: false, partnerId: null });
    }

    handleUserFIOOnClick(partnerId) {
        this.setState({ showPartnerInfo: partnerId > 0, partnerId });
    }

    refreshData() {
        const { dispatch } = this.props;
        dispatch(getMlmStatisticData({ ...this.state.filter }));
    }

    isStructureEmpty() {
        const { statistic } = this.props;
        return !this.isDataNotFetched() && !statistic.data;
    }

    isDataNotFetched() {
        const { statistic } = this.props;
        return !statistic || !!statistic.isFetching;
    }

    handleHistoryTableOnSortClick(e, orderByField, orderByDirection) {
        const { filter } = this.state;
        e.preventDefault();
        this.setState({
            filter: {
                ...filter,
                orderByField,
                orderByDirection,
            },
        });
    }

    handleSearchTextOnChange(e) {
        const { filter } = this.state;
        this.setState({
            filter: {
                ...filter,
                userFilterText: e.target.value,
            },
        });
    }

    handleSearchTextOnEnter(e) {
        if (e && e.key === "Enter") {
            this.handleSearchTextOnChange(e);
        }
    }

    handleLevelOnChange(e) {
        const { filter } = this.state;
        this.setState({
            filter: {
                ...filter,
                childLevel: e.target.value,
            },
        });
    }

    handleStatusOnChange(e) {
        const { filter } = this.state;
        this.setState({
            filter: {
                ...filter,
                activePeriod: e.target.value,
            },
        });
    }

    handleDateRangeChanged = (dates) => {
        const newDateStart = dates.start.local().format("YYYY-MM-DD");
        const newDateEnd = dates.end.local().format("YYYY-MM-DD");
        this.setState({
            filter: {
                ...filter,
                dateStart: newDateStart,
                dateEnd: newDateEnd,
            },
        });
    };

    handleRangeChanged = (e) => {
        const rangeValue = e.target.value;
        switch (rangeValue) {
            case "all":
                return this.setState({
                    filter: {
                        ...filter,
                        dateStart: "2020-01-01",
                        dateEnd: today,
                    },
                });
                break;

            case "year":
                this.setState({
                    filter: {
                        ...filter,
                        dateStart: moment().subtract(1, "years").format("YYYY-MM-DD"),
                        dateEnd: today,
                    },
                });
                break;

            case "month":
                this.setState({
                    filter: {
                        ...filter,
                        dateStart: moment().subtract(1, "months").format("YYYY-MM-DD"),
                        dateEnd: today,
                    },
                });
                break;

            case "week":
                this.setState({
                    filter: {
                        ...filter,
                        dateStart: moment().subtract(1, "weeks").format("YYYY-MM-DD"),
                        dateEnd: today,
                    },
                });
                break;

            default:
                return null;
        }
    };

    isTextChanged(filter1, filter2) {
        return filter1.userFilterText !== filter2.userFilterText;
    }

    isFilterChanged(filter1, filter2) {
        return JSON.stringify(filter1) !== JSON.stringify(filter2);
    }

    render() {

        const { location } = this.props;
        const i18n = dict[this.props.lang];
        const structureEmpty = this.isStructureEmpty();
        return (
            <div>

                <div className={cx("mlmStructure")}>
                    {structureEmpty && this.renderNoStructure()}
                    {!structureEmpty && this.renderDateFilterForm()}
                    {!structureEmpty && this.renderFilterForm()}
                    {!structureEmpty && (
                        <div className={styles.contentList}>
                            {this.renderStructureTable()}
                        </div>
                    )}
                    {this.renderTableSummary()}
                </div>
                {!structureEmpty && this.renderPartnerInfoModal()}

            </div>
        );
    }

    renderDateFilterForm() {
        const { lang } = this.props;
        const { filter } = this.state;
        const i18n = dict[lang];

        return (
            <article className={styles.filterForm}>
                <p className={styles.filterForm__summary}>
                    {i18n["mlm.mlmStructure.filter.summary"]}{" "}
                    {this.getDataPeriod(filter.dateStart, filter.dateEnd)}
                </p>
                <div className={styles.filterForm__searchInput}>
                    {renderSearchInputBox({
                        value: filter.userFilterText,
                        name: "searchText",
                        type: "text",
                        placeholder: i18n["mlm.mlmStructure.searchText"],
                        onChange: this.handleSearchTextOnChange,
                        onKeyPress: this.handleSearchTextOnEnter,
                    })}
                </div>
            </article>
        );
    }
    renderFilterForm() {
        const { lang, statistic } = this.props;
        const { filter } = this.state;
        const i18n = dict[lang];

        const rangeButtons = [
            { name: i18n["mlm.mlmStructure.filterButton.all"], value: "all" },
            { name: i18n["mlm.mlmStructure.filterButton.week"], value: "week" },
            { name: i18n["mlm.mlmStructure.filterButton.month"], value: "month" },
            { name: i18n["mlm.mlmStructure.filterButton.year"], value: "year" },
        ];

        const childLevelOptions = [
            { label: i18n["dropdown.options.placeholder.all"], value: "" },
            { label: "1", value: "1" },
            { label: "2", value: "2" },
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
                                {btn.name}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={styles.rightSide}>
                    <div className={styles.input}>
                        {renderLevelSelectBox({
                            value: filter.childLevel,
                            name: "childLevel",
                            placeholder: i18n["dropdown.options.placeholder.all"],
                            onChange: this.handleLevelOnChange,
                            label: i18n["mlm.mlmStructure.filter.childLevel"],
                            options: childLevelOptions,
                        })}
                    </div>
                    <div className={styles.input}>
                        <label className={styles.selectBoxLabel}>
                            {i18n["mlm.mlmStructure.partnerTotalCount"]}
                        </label>
                        <span className={styles.inputValue}>
                            {statistic && statistic.data ? statistic.data.itemsCounter : "0"}
                        </span>
                    </div>
                </div>
            </article>
        );
    }

    renderNoStructure() {
        const { lang } = this.props;
        const i18n = dict[lang];
        return (
            <div className={styles.emptyInfo}>
                {i18n["mlm.mlmStructure.emptyData"]}
            </div>
        );
    }

    renderIconButtons(id, phone, email) {
        const { isCopied } = this.state;
        const { lang } = this.props;
        const i18n = dict[lang];
        const onCopyButton = (e) => {
            const copiedText = e.target.value;
            if (navigator && navigator.clipboard) {
                navigator.clipboard.writeText(copiedText);
                this.setState({ isLinkCopied: true });
            }
        };

        return (
            <div>
                <button className={styles.iconButton} id={`phonePopover${id}`}>
                    <svg className={styles.icon}>
                        <use xlinkHref="#ico-phone" />
                    </svg>
                </button>
                <UncontrolledTooltip
                    trigger="click"
                    placement="left"
                    target={`phonePopover${id}`}                     
                >
                    <div className={styles.tooltip}>
                        <span className={styles.tooltipText}>{phone}</span>
                            <a href={"https://wa.me/" + phone}>
                                <svg className={styles.icon}>
                                    <use xlinkHref="#phone" />
                                </svg>
                            </a>
                        <button
                            value={phone}
                            onClick={onCopyButton}
                            className={styles.tooltipButton}
                        >
                            {i18n["mlm.mlmStructure.copyButton"]}
                        </button>
                        </div>
                </UncontrolledTooltip>

                <button className={styles.iconButton} id={`emailPopover${id}`}>
                    <svg className={styles.icon}>
                        <use xlinkHref="#ico-email" />
                    </svg>
                </button>
                <UncontrolledTooltip
                    trigger="click"
                    placement="left"
                    target={`emailPopover${id}`}    
                >                    
                    <div className={styles.tooltip}>
                    {email}
                        <button
                            value={email}
                            className={styles.tooltipButton}
                            onClick={onCopyButton}
                        >
                            {i18n["mlm.mlmStructure.copyButton"]}
                        </button>
                    </div>
                </UncontrolledTooltip>
                <button className={styles.iconButton}>
                    <svg className={styles.icon}>
                        <use xlinkHref="#ico-message" />
                    </svg>
                </button>
                {isCopied && (
                    <button className={styles.tooltipButton}>
                        {i18n["mlm.mlmStructure.copied"]}
                    </button>
                )}
            </div>
        );
    }

    renderBar = (id, totalAmmount, modulesAmmount, ordersAmmount) => {
        const { lang } = this.props;
        const i18n = dict[lang];
        const modulesPercent = this.calculatePercent(totalAmmount, modulesAmmount);
        const ordersPercent = this.calculatePercent(totalAmmount, ordersAmmount);

        return (
            <div>
                <UncontrolledTooltip
                    trigger="hover"
                    placement="left"
                    target={`barTooltip${id}`}
                    //className={cx(styles.tooltip, styles.barTooltip)}
                >
                    <div className={cx(styles.tooltip, styles.barTooltip)}>
                        <div className={styles.barTooltip__row}>
                            <p className={styles.barTooltip_title}>{i18n["mlm.mlmStructure.bar.spentForModules"]}</p>
                            <p className={styles.barTooltip_points}>{modulesAmmount} {i18n["mlm.mlmStructure.points"]}</p>
                        </div>
                        <div className={styles.barTooltip__row}>
                            <div className={cx(styles.baseBar, styles.baseBar_tooltip)}>
                                <div
                                    className={styles.modulesBar_tooltip}
                                    style={{ width: `${modulesPercent}%` }}
                                ></div>
                            </div>
                        </div>
                        <div className={styles.barTooltip__row}>                            
                            <p className={styles.barTooltip_title}>{i18n["mlm.mlmStructure.bar.spentForOrders"]}</p>
                            <p className={styles.barTooltip_points}>{ordersAmmount} {i18n["mlm.mlmStructure.points"]}</p>
                        </div>
                        <div className={styles.barTooltip__row}>
                            <div className={cx(styles.baseBar, styles.baseBar_tooltip)}>
                                <div
                                    className={styles.ordersBar_tooltip}
                                    style={{ width: `${ordersPercent}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </UncontrolledTooltip>
                <p className={styles.barTooltip_points}>{totalAmmount} {i18n["mlm.mlmStructure.points"]} </p>
                <div id={`barTooltip${id}`} className={styles.baseBar}>
                    <div
                        className={styles.ordersBar}
                        style={{ width: `${Boolean(ordersPercent) ? ordersPercent + 2 : 0}%` }}
                    />
                    <div
                        className={styles.modulesBar}
                        style={{ width: `${modulesPercent}%` }}
                    ></div>

                </div>
            </div>
        );
    };

    renderStructureTableHeader() {
        const { lang } = this.props;
        const {
            filter: { orderByField, orderByDirection },
        } = this.state;
        const i18n = dict[lang];
        return (
            <div className={styles.heading}>
                <div className={styles.row}>
                    {this.renderHeaderCell(
                        "childLevel",
                        orderByField,
                        orderByDirection,
                        i18n["mlm.mlmStructure.childLevel"]
                    )}
                    {this.renderHeaderCell(
                        "id",
                        orderByField,
                        orderByDirection,
                        i18n["mlm.mlmStructure.id"]
                    )}
                    {this.renderHeaderCell(
                        "lastName",
                        orderByField,
                        orderByDirection,
                        i18n["mlm.mlmStructure.fio"]
                    )}
                    {this.renderHeaderCell(
                        "workPosition",
                        orderByField,
                        orderByDirection,
                        i18n["mlm.mlmStructure.workPosition"]
                    )}
                    {this.renderHeaderCell(
                        "city",
                        orderByField,
                        orderByDirection,
                        i18n["mlm.mlmStructure.city"]
                    )}
                    {this.renderHeaderCell(
                        "point",
                        orderByField,
                        orderByDirection,
                        i18n["mlm.mlmStructure.point"]
                    )}
                    {this.renderHeaderCell("phone", i18n["mlm.mlmStructure.phone"])}
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

    renderStructureTable() {
        const { statistic, location } = this.props;
        const onCopyButton = () => { };
        return (
            <div className={styles.structureTable}>
                {this.isDataNotFetched() && <Spinner />}
                <div className={styles.table}>
                    {this.renderStructureTableHeader()}
                    <div className={styles.body}>
                        {statistic &&
                            statistic.data &&
                            statistic.data.users &&
                            statistic.data.users.map((item) => {
                                return (
                                    <div key={`structureTable${item.id}`} className={styles.row}>
                                        <div className={styles.cell}>
                                            {item.mlmUserInfo.childLevel}
                                        </div>
                                        <div className={styles.cell}>{item.id}</div>

                                        <div
                                            className={cx(styles.cell, styles.cellLink)}
                                            onClick={() =>
                                                browserHistory.push(
                                                    `${location.pathname}/partner/${item.id}`
                                                )
                                            }
                                        >
                                            {this.getFIO(item)}
                                        </div>
                                        <div
                                            className={cx(styles.cell, styles.value, styles.email)}
                                        >
                                            {item.customUserFields.workPosition}
                                        </div>
                                        <div className={cx(styles.cell)}>
                                            {getFlag(item.country , styles.icon)} {item.city}
                                        </div>
                                        <div className={cx(styles.cell)}>
                                            {this.renderBar(
                                                item.id,
                                                item.mlmUserInfo.spending.sum,
                                                item.mlmUserInfo.spending.modules,
                                                item.mlmUserInfo.spending.orders
                                            )}
                                        </div>
                                        <div
                                            className={cx(styles.cell, styles.value, styles.buttons)}
                                        >
                                            {this.renderIconButtons(item.id, item.phone, item.email)}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            </div>
        );
    }
    renderTableSummary() {
        const { lang, statistic } = this.props;
        const i18n = dict[lang];
        const { noData, filter } = this.state;

        return (
            <article className={styles.summary}>
                <p className={styles.summaryTitle}>
                    {i18n["mlm.mlmStructure.summary.title"]}
                    {this.getDataPeriod(filter.dateStart, filter.dateEnd)}
                </p>
                <section className={styles.summaryRow}>
                    <section className={styles.summaryBlock}>
                        <p className={styles.summaryHeader}>
                            {i18n["mlm.mlmStructure.summary.partners"]}
                        </p>
                        <p className={styles.summaryValue}>
                            <span className={styles.summaryNumber}>
                                {" "}
                                {statistic && statistic.data
                                    ? statistic.data.itemsCounter
                                    : "0"}
                            </span>
                        </p>
                    </section>
                    <section className={styles.summaryBlock}>
                        <p className={styles.summaryHeader}>
                            {i18n["mlm.mlmStructure.summary.totalCourses"]}
                        </p>
                        <p className={styles.summaryValue}>
                            <span className={styles.summaryNumber}>
                                {statistic && statistic.data
                                    ? statistic.data.spending.modules
                                    : "00"}
                            </span>
                            {i18n["mlm.mlmStructure.points"]}
                        </p>
                    </section>
                    <section className={styles.summaryBlock}>
                        <p className={styles.summaryHeader}>
                            {i18n["mlm.mlmStructure.summary.totalOrders"]}
                        </p>
                        <p className={styles.summaryValue}>
                            <span className={styles.summaryNumber}>
                                {statistic && statistic.data
                                    ? statistic.data.spending.orders
                                    : "00"}
                            </span>
                            {i18n["mlm.mlmStructure.points"]}
                        </p>
                    </section>
                    <section
                        className={cx(styles.summaryBlock, styles.summaryBlockActive)}
                    >
                        <p className={styles.summaryHeader}>
                            {i18n["mlm.mlmStructure.summary.total"]}
                        </p>
                        <p className={cx(styles.summaryValueActive)}>
                            <span className={styles.summaryNumber}>
                                {statistic && statistic.data
                                    ? statistic.data.spending.sum
                                    : "00"}
                            </span>
                            {i18n["mlm.mlmStructure.points"]}
                        </p>
                    </section>
                </section>
            </article>
        );
    }
    renderPartnerInfoModal() {
        return (
            <div className={styles.partnerInfoModal}>
                <Media
                    queries={{ desktop: { desktop: "(min-width: 1100px)" }.desktop }}
                >
                    {(matches) => {
                        return (
                            <Modal
                                contentLabel={""}
                                onRequestClose={this.handlePartnerInfoClose}
                                isOpen={this.state.showPartnerInfo}
                                style={{
                                    content: {
                                        width: matches.desktop ? "50%" : "90%",
                                        top: "90px",
                                        bottom: "60px",
                                        left: "50%",
                                        marginRight: "-50%",
                                        transform: "translate(-50%)",
                                    },
                                }}
                            >
                                <PartnerInfo
                                    onClose={this.handlePartnerInfoClose}
                                    key={this.state.partnerId}
                                    id={this.state.partnerId}
                                />
                            </Modal>
                        );
                    }}
                </Media>
            </div>
        );
    }
    calculatePercent(total, num) {
        return (100 / total) * num;
    }

    getDataPeriod(dateStart, dateEnd) {
        return `${moment(dateStart).format("DD.MM.YYYY")} - ${moment(
            dateEnd
        ).format("DD.MM.YYYY")}`;
    }
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

}

const mapStateToProps = (state) => {
    return {
        userInfo: selectors.userInfo(state),
        //structure: selectors.selectMlmStructure(state),
        lang: state.lang,
        statistic: selectors.selectMlmStatistic(state),
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        dispatch,
    };
};

export default compose(connect(mapStateToProps, mapDispatchToProps))(
    TableStructure
);
