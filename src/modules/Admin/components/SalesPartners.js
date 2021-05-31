import React, { Component } from "react";
import { connect } from "react-redux";
import cookie from "react-cookie";
import { dict } from "dict";
import moment from "moment";
import CSSModules from "react-css-modules";
import classNames from "classnames/bind";
import styles from "./salesPartners.css";
import { Breadcrumb } from "../../../components/common/Breadcrumb";
import AdminLayout from "./AdminLayout";
import {
  getAdminSalesPartners,
  getAdminSalesPartnersAccess,
  updateAdminSalesPartnersAccess,
} from "../../../utils/api.js";

const cx = classNames.bind(styles);
const today = moment().local().format("YYYY-MM-DD");

const page = "salesPartners";

const renderSearchInputBox = (props) => (
  <div className={styles.searchInputBox}>
    <svg className={styles.svgIconFile}>
      <use xlinkHref="#ico-input-search" />
    </svg>
    <input type="text" {...props} />
  </div>
);

/**
 *  Компонент SalesPartners.
 *  Используется для отображения страницы админки
 *
 */
class SalesPartners extends Component {
  constructor(props) {
    super(props);
    this.state = {
      defaultPartnerId: "",
      partners: [],
      partnerAccess: [],
      partnerId: "",
      userFilterText: "",
      isLoaded: false,
    };
  }

  componentDidMount() {
    const token = cookie.load("token");
    const { defaultPartnerId } = this.state;

    getAdminSalesPartners({
      AuthToken: token,
      Data: {
        take: 10,
        skip: 0,
      },
    })
      .then((res) =>
        this.setState({
          partners: res.data.data,
          defaultPartnerId: res.data.data[0].id,
          isLoaded: true,
        })
      )
      .catch(console.error);

    this.showPartnerAccess(defaultPartnerId);
  }

  showPartnerAccess = (id) => {
    const token = cookie.load("token");
    getAdminSalesPartnersAccess({
      AuthToken: token,
      Data: {
        take: 10,
        skip: 0,
        userId: id,
      },
    })
      .then((res) => this.setState({ partnerAccess: res.data.data }))
      .catch(console.error);
  };

  handleSearchTextOnChange = (e) => {
    const token = cookie.load("token");
    const searchNameOrId = e.target.value;
    this.setState({
      userFilterText: searchNameOrId,
    });
    getAdminSalesPartners({
      AuthToken: token,
      Data: {
        take: 10,
        skip: 0,
        userFilterText: searchNameOrId,
      },
    })
      .then((res) =>
        this.setState({
          partners: res.data.data,
        })
      )
      .catch(console.error);
  };

  handleSearchTextOnEnter = (e) => {
    if (e && e.key === "Enter") {
      this.handleSearchTextOnChange(e);
    }
  };

  handlePartnerOnclick = (e) => {
    const newPartnerId = e.target.value;
    this.setState({ partnerId: newPartnerId });
    this.showPartnerAccess(newPartnerId);
  };

  handleAccessCheckbox = (e) => {
    const { partnerAccess } = this.state;
    const hasAccess = e.target.checked;
    const newModuleId = e.target.value;

    const updateAccess = partnerAccess.map((module) => {
      if (module.itemId == newModuleId) {
        return (module = {
          ...module,
          isChecked: hasAccess,
        });
      } else {
        return module;
      }
    });
    this.setState({ partnerAccess: updateAccess });
  };

  handleSaveButton = () => {
    const { partnerAccess, partnerId, defaultPartnerId } = this.state;
    const token = cookie.load("token");

    //filter partnerAccess and map new array to pass as parameter to backend
    const updatedModules = partnerAccess.reduce((newArray, module) => {
      if (module.isChecked) {
        newArray.push({
          userId: partnerId || defaultPartnerId,
          itemType: module.itemType,
          itemId: module.itemId,
        });
      }
      return newArray;
    }, []);

    updateAdminSalesPartnersAccess({
      AuthToken: token,
      Data: [...updatedModules],
    });
  };

  renderHeader() {
    const { lang } = this.props;
    const i18n = dict[lang];
    const items = [i18n["admin.main"], i18n["admin.salesPartners"]];
    const links = ["/admin"];
    return (
      <div className={cx(styles.salesPartnersHeader)}>
        <h2 className={cx(styles.title)}>{i18n["admin.profile.new.title"]}</h2>
        <Breadcrumb items={items} links={links} />
      </div>
    );
  }

  render() {
    const { location, lang } = this.props;
    const { isLoaded } = this.state;
    const i18n = dict[lang];
    return (
      <AdminLayout page={page} location={location}>
        <section className={styles.salesPartners}>
          <h1>Партнеры</h1>
          {this.renderHeader()}
          <section className={styles.salesPartnersSection}>
            {isLoaded && this.renderPartnersList()}
            {isLoaded && this.renderModulesList()}
          </section>
        </section>
      </AdminLayout>
    );
  }

  renderPartnersList() {
    const { partners, defaultPartnerId } = this.state;
    return (
      <aside className={styles.leftSide}>
        {this.renderPartnersFilter()}
        <div className={styles.structureTable}>
          {/*{this.isDataNotFetched() && <Spinner/>}*/}
          <div className={styles.table}>
            <div className={styles.body}>
              {partners &&
                partners.map((item, id) => {
                  return (
                    <div key={`structureTable${id}`} className={styles.row}>
                      <button
                        className={cx(styles.cell, styles.cellButton)}
                        value={item.id}
                        onClick={this.handlePartnerOnclick}
                      >
                        {`${item.id} - ${item.firstName} ${item.lastName}`}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </aside>
    );
  }

  renderPartnersFilter() {
    const { lang } = this.props;
    const { userFilterText, partners } = this.state;
    const i18n = dict[lang];
    return renderSearchInputBox({
      value: userFilterText,
      name: "searchText",
      type: "text",
      placeholder: i18n["admin.salesPartners.searchText"],
      onChange: this.handleSearchTextOnChange,
      onKeyPress: this.handleSearchTextOnEnter,
    });
  }

  renderModulesList() {
    const { lang, sales } = this.props;
    const { partnerAccess } = this.state;
    const i18n = dict[lang];

    return (
      <section className={styles.rightSide}>
        <section className={styles.moduleList}>
          {/*{this.isDataNotFetched() && <Spinner/>}*/}

          <div className={cx(styles.moduleListHeader)}>
            <div>{i18n["admin.salesPartners.moduleTable.module"]}</div>
            <div>{i18n["admin.salesPartners.moduleTable.access"]}</div>
          </div>
          <ul>
            {partnerAccess &&
              partnerAccess.map((item) => {
                return (
                  <li
                    key={item.itemId}
                    className={styles.moduleList__row}
                    key={item.id}
                  >
                    <div className={styles.moduleList__item}>{item.name}</div>
                    <div className={styles.moduleList__check}>
                      <input
                        className={styles.moduleList_checkbox}
                        type="checkbox"
                        key={item.itemId}
                        value={item.itemId}
                        checked={item.isChecked}
                        onChange={this.handleAccessCheckbox}
                      />
                    </div>
                  </li>
                );
              })}
          </ul>
        </section>
        <button
          className={styles.salesPartnersAction}
          onClick={this.handleSaveButton}
        >
          {i18n["admin.salesPartners.saveChangesButton"]}
        </button>
      </section>
    );
  }

  renderModulesTableHeader() {
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.heading}>
        <div className={styles.row}>
          {this.renderHeaderCell(
            "module",
            i18n["admin.salesPartners.moduleTable.module"]
          )}
          {this.renderHeaderCell(
            "access",
            i18n["admin.salesPartners.moduleTable.access"]
          )}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

SalesPartners = connect(mapStateToProps, mapDispatchToProps)(SalesPartners);

export default CSSModules(SalesPartners, styles);
