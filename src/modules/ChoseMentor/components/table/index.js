import React, { Component } from "react";
import style from "../../style.css";
import classNames from "classnames/bind";
import { createUserName, isDataNotFetched } from "../../../Admin/utils";
import * as ducks from '../../ducks';
import * as selectors from '../../selectors';
import { dict } from "dict";
import {Field, reduxForm, submit} from "redux-form";
import SelectComponent from "components/componentKit/SelectComponent";
import { connect } from "react-redux";
import { compose } from "redux";
import * as R from "ramda";
import ReactPaginate from 'react-paginate';
import Loader from "../../../../components/componentKit/Loader";

const cx = classNames.bind(style);

const ITEMS_PER_PAGE = 10;

const titleHeaderTable = [
  "Специалист",
  "Регион",
  "Сертификат",
  "Французкий диплом Anti-Age",
];

const initialFilterState = {
  modularSchool: "",
  expertSchool: "",
  specialties: "",
  diplomaFr: "",
  city: "",
  fio: "",
};

const selectStyles = {
  option: (provided, state) => ({
    ...provided,
    fontSize: '12px',
    lineHeight: '15px',
    color: state.isSelected ? "#ffffff" :'#4DA2D6',
    padding: '5px',
    width: '250px',
  }),
  menu: (provided, state) => {
    return ({
    ...provided,
    zIndex: "999 !important",
    top: 'calc(100% + 10px)',
    width: '250px',
  })},
  control: (provided) => {
    return {
      ...provided,
      '&:hover': {
        border: 'none',
        outline: 'none',
      },
      minHeight: '15px',
      maxHeight: '15px',
      padding: '0px 0px 0px 10px',
      border: 'none',
      boxShadow: 'none',
      borderRadius: "5px",
      backgroundColor: "white",
      fontSize: '12px',
      lineHeight: '15px',
      color: '#4DA2D6',
      alingItems: 'initial',
      justifyContent: 'start',
      overflow: 'initial',
    };
  },
  singleValue: provided => ({
    // ...provided,
    margin: '0px 2px',
    fontWeight: 'normal',
  }),
  placeholder: provided => ({
    fontSize: '12px',
    fontWeight: 'normal',
  }),
  indicatorSeparator: (provided) => {
    return {
      ...provided,
      display: 'none',
    }
  },
  input: provided => ({
    ...provided,
    fontSize: '12px',
    lineHeight: '15px',
    color: '#4DA2D6',
    margin: '0px',
    padding: '0px',
    // display: 'none',
  }),
  container: provided => ({
    ...provided,
    maxHeight: '15px',
  }),
  dropdownIndicator: provided => ({
    ...provided,
    width: '10px',
    height: '15px',
    alignItems: 'center',
    padding: '0px',
    color: '#4DA2D6',
    '&:hover': {
      color: '#4DA2D6',
    }
  }),
  valueContainer: provided => ({
    ...provided,
    padding: '0px',
    flex: '1',
  }),
  indicatorsContainer: provided => ({
    display: 'flex',
    flexShrink: '0',
    boxSizing: 'border-box',
    marginLeft: '5px',
    color: '#4DA2D6',
  }),
}

const TableHeader = ({ titleHeaderTable }) => {
  const titles = titleHeaderTable.map((item, i) => (
    <div key={i} className={cx("ratingTable__head", "ratingTable__sort")}>
      {item}
    </div>
  ));

  return (
    <div className={cx("ratingTable__heading")}>
      <div className={cx("ratingTable__row")}>{titles}</div>
    </div>
  );
};

const TableRow = ({ data, i18n, handleClick }) => {
  return (
    <div key={`structureTable${data.id}`} className={cx("ratingTable__row")}>
      <div className={cx("ratingTable__cell")}>
        <div className={cx("ratingTable__cell-fio")}>
          <img
            src={data.userInfo.photo}
            alt="user-ava"
            className={cx("userAvaMini")}
          />
          <div>
            <p className={cx('ratingTable__cell-fio-text')}>
              {createUserName({
                lastName: data.userInfo.lastName,
                firstName: data.userInfo.firstName,
                middleName: data.userInfo.middleName,
              })}
            </p>
            <p className={cx('ratingTable__cell-fio-specialties')}>{data.specialties}</p>
          </div>
        </div>
      </div>
      <div className={cx("ratingTable__cell")}>
        <div className={cx("ratingTable__cell-location")}>
          <p>{data.userInfo.city}</p>
        </div>
      </div>
      <div className={cx("ratingTable__cell")}>
        <div className={cx("ratingTable__cell-certificates")}>
          <p>{data.certificates}</p>
        </div>
      </div>
      <div className={cx("ratingTable__cell")}>
        <div className={cx("ratingTable__cell-diploma")}>
          <p>
            {data.diplomaFr
              ? i18n["mentoring.tutors-list.has-diploma"]
              : i18n["mentoring.tutors-list.no-diploma"]}
          </p>
          <button
            className={cx("ratingTable__btn-details")}
            onClick={() => handleClick(data.userId)}
          >
            {i18n["mentoring.tutors-list.details"]}
          </button>
        </div>
      </div>
    </div>
  );
};

const TableBody = ({ mentorList, i18n, handleClick }) => {
  const rows = mentorList.map((item) => (
    <TableRow data={item} i18n={i18n} handleClick={handleClick} />
  ));
  return <div className={cx("ratingTable__body")}>{rows}</div>;
};

class TutorsTable extends Component {
  state = {
    currentPage: 0,
    isFilterVisible: false,
    filter: initialFilterState,
  }

  async componentDidMount() {
    const { dispatch } = this.props;
    let tutorsPayload = {
      ...this.state.filters,
      take: ITEMS_PER_PAGE,
      skip: 0,
    };

    await dispatch(ducks.getTutorsList(tutorsPayload));
    await dispatch(ducks.getTutorsFilter({}));
  }

  toggleFilters = _ => this.setState(({ isFilterVisible }) =>
    ({
      isFilterVisible: !isFilterVisible,
      filters: initialFilterState,
    }),
    _ => !this.state.isFilterVisible && this.props.dispatch(ducks.getTutorsList({...this.state.filters, take: 10, skip: ITEMS_PER_PAGE * this.state.currentPage}))
  );

  handlePageChange = ({ selected: page }) => {
    this.props.dispatch(ducks.getTutorsList({
      ...this.state.filters,
      take: ITEMS_PER_PAGE,
      skip: page * ITEMS_PER_PAGE
    },
      _ => this.setState({ currentPage: page })));
  };

  handleFilterChange = filterName => ({ value }) =>
    this.setState(({ filters }) => ({ filters: {...filters, [filterName]: value }}), _ => this.props.dispatch(ducks.getTutorsList({...this.state.filters, take: 10, skip: 10 * this.state.currentPage})));

  render() {
    const { lang, tutorsList } = this.props;
    const i18n = dict[lang];
    const {isFilterVisible} = this.state

    const cities = this.props.filterData
      ? [{label: 'Все', value: ''}, ...this.props.filterData.cityList.map(value => ({ value, label: value}))] : [];
    const expertSchools = this.props.filterData
      ? [{label: 'Все', value: ''}, ...this.props.filterData.expertSchoolList.map(({ Key, Value }) => ({ value: Key, label: Value}))] : [];
    const specialties = this.props.filterData
      ? [{label: 'Все', value: ''}, ...this.props.filterData.specialtiesList.map(value => ({ value, label: value}))] : [];
    const modularSchools = this.props.filterData
      ? [{label: 'Все', value: ''}, ...this.props.filterData.modularSchoolList.map(({ Key, Value }) => ({ value: Key, label: Value}))] : [];

    const diploms = [{label: 'Все', value: ''}, {label: "Есть", value: 'true'}, {label: "Нет", value: 'false'}];
    const Select = props => <Field {...props} component={SelectComponent} />
    const getValue = filter => xs => xs.find(({ value }) => value === R.path([filter], this.state.filters));

    const currentInfoAboutPage = _ => `${this.state.currentPage + 1} ${i18n['mlm.of']} ${Math.ceil(Number(tutorsList.data.itemsCounter / ITEMS_PER_PAGE))}`;

    return (
        <div>
        <div className={cx("ratingTableWrapper")}>
        <div className={cx("ratingTable__filters")}>
          <div className={cx("ratingTable__mainFilters")}>
            <button className={cx("ratingTable__btn-moreFilters")} onClick={this.toggleFilters}>
              {i18n[`mentoring.tutors-list.${isFilterVisible ? 'remove-all-filters' : 'filters'}`]}
            </button>
            <div className={cx('ratingTable__inputWrapper')}>
              <input className={cx('ratingTable__input')} placeholder={i18n['mlm.mentorship.tutor-table.fio-filter.placeholder']} type="text" onChange={({target}) => this.handleFilterChange("fio")(target)} />
            </div>
            {!isDataNotFetched(tutorsList) && tutorsList.data && tutorsList.data.itemsCounter > 1 && 
              <div className={cx('ratingTable__topPagination-container')} >
                <div className={cx('ratingTable__topPaginationWrapper')}>
                  <ReactPaginate 
                    pageCount={Number(tutorsList.data.itemsCounter / ITEMS_PER_PAGE)}
                    subContainerClassName={'pages pagination'}
                    onPageChange={this.handlePageChange}
                    forcePage={this.state.currentPage}
                    containerClassName={cx('ratingTable__topPagination')}
                    breakLabel={<p>{`Страница ${this.state.currentPage + 1}`}</p>}
                    breakClassName={cx('ratingTable__topBreaker')}
                    activeClassName={cx('ratingTable__currentPage-topActive')}
                    marginPagesDisplayed={-1}
                    pageRangeDisplayed={-1}
                    previousLinkClassName={cx('ratingTable__link-move')}
                    previousLabel={'<'}
                    nextLinkClassName={cx('ratingTable__link-hide')}
                    nextLabel={''}
                  />
                  <p className={cx('ratingTable__topBreaker')}>{`Страница ${this.state.currentPage + 1}`}</p>
                  <ReactPaginate 
                    pageCount={Number(tutorsList.data.itemsCounter / ITEMS_PER_PAGE)}
                    subContainerClassName={'pages pagination'}
                    onPageChange={this.handlePageChange}
                    forcePage={this.state.currentPage}
                    containerClassName={cx('ratingTable__topPagination')}
                    breakLabel={<p>{`Страница ${this.state.currentPage + 1}`}</p>}
                    breakClassName={cx('ratingTable__topBreaker')}
                    activeClassName={cx('ratingTable__currentPage-topActive')}
                    marginPagesDisplayed={-1}
                    pageRangeDisplayed={-1}
                    previousLinkClassName={cx('ratingTable__link-hide')}
                    previousLabel={''}
                    nextLinkClassName={cx('ratingTable__link-move')}
                    nextLabel={'>'}
                  />
                </div>
                <p className={cx('ratingTable__greyText')}>
                  {currentInfoAboutPage()}
                </p>
              </div>}
          </div>
          {!this.state.isFilterVisible ? null : (
            <div className={cx("ratingTable__moreFilters")}>
              <label className={cx('ratingTable__lable')}>
                {`${i18n['mlm.mentorship.rating-table.filters.city']}:`}
                <Select
                  customClass={cx('ratingTable__select')}
                  customStyles={selectStyles}
                  onChange={this.handleFilterChange("city")}
                  val={getValue("city")(cities)}
                  placeholder={'Город'}
                  isPlaceholder={false}
                  options={cities} name="cities"
                />
              </label>
              <label className={cx('ratingTable__lable')}>
                {`${i18n['mlm.mentorship.rating-table.filters.speciality']}:`}
                <Select
                  customClass={cx('ratingTable__select')}
                  customStyles={selectStyles}
                  onChange={this.handleFilterChange("specialties")}
                  val={getValue("specialties")(specialties)}
                  placeholder={'Специальность'}
                  isPlaceholder={false}
                  options={specialties} name="specialties" 
                />
              </label>
              <label className={cx('ratingTable__lable')}>
                {`${i18n['mlm.mentorship.rating-table.filters.fr-diplome']}:`}
                <Select
                  customClass={cx('ratingTable__select')}
                  customStyles={selectStyles}
                  onChange={this.handleFilterChange("diplomaFr")}
                  val={getValue("diplomaFr")(diploms)}
                  placeholder={'Наличие'}
                  isPlaceholder={false}
                  options={diploms} name="diplomaFr" 
                />
              </label>
              <label className={cx('ratingTable__lable')}>
                {`${i18n['mlm.mentorship.rating-table.filters.modular-school']}:`}
                <Select
                  customClass={cx('ratingTable__select')}
                  customStyles={selectStyles}
                  onChange={this.handleFilterChange("modularSchool")}
                  val={getValue("modularSchool")(modularSchools)}
                  placeholder={'Модульная школа'}
                  isPlaceholder={false}
                  options={modularSchools} name="modularSchools" 
                />
              </label>
              <label className={cx('ratingTable__lable')}>
                {`${i18n['mlm.mentorship.rating-table.filters.expert-school']}:`}
                <Select
                  customClass={cx('ratingTable__select')}
                  customStyles={selectStyles}
                  onChange={this.handleFilterChange("expertSchool")}
                  val={getValue("expertSchool")(expertSchools)}
                  placeholder={'Экспертная школа'}
                  isPlaceholder={false}
                  options={expertSchools} name="expertSchools" 
                />
              </label>
            </div>
          )}
        </div>
        {!isDataNotFetched(tutorsList) ? <div>
          <div className={cx("ratingTable")}>
          <TableHeader titleHeaderTable={titleHeaderTable} />
          <TableBody
            mentorList={tutorsList.data.users}
            i18n={i18n}
            handleClick={this.props.handleClick}
          />
        </div>
        {tutorsList.data && tutorsList.data.itemsCounter > 1 && 
          <div className={cx('ratingTable__container-wrapper')}>
            <ReactPaginate 
              pageCount={Number(tutorsList.data.itemsCounter / ITEMS_PER_PAGE)}
              subContainerClassName={cx('___')}
              onPageChange={this.handlePageChange}
              forcePage={this.state.currentPage}
              containerClassName={cx('ratingTable__container')}
              breakLabel={'...'}
              breakClassName={'break-me'}
              activeClassName={cx('ratingTable__link-active')}
              activeLinkClassName={cx('ratingTable__link-active')}
              marginPagesDisplayed={2}
              pageRangeDisplayed={5}
              pageClassName={cx('ratingTable__link-wrapper')}
              pageLinkClassName={cx('ratingTable__link')}
              previousLinkClassName={cx('ratingTable__link-move')}
              nextLinkClassName={cx('ratingTable__link-move')}
              previousLabel={'<'}
              nextLabel={'>'}
            />
            <p className={cx('ratingTable__bottomPageInfo')}>{currentInfoAboutPage()}</p>
          </div>}
        </div> : <Loader />}
      </div>
    </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    userInfo: selectors.userInfo(state),
    lang: state.lang,
    tutorsList: selectors.selectTutorsList(state),
    filterData: selectors.selectTutorsFilterData(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

const TableMentor = reduxForm({form: 'chooseMentorForm'})(TutorsTable);

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  TableMentor
);
