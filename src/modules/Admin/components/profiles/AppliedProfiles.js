import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from 'prop-types';
import { dict } from "dict";
import CSSModules from "react-css-modules";
import classNames from "classnames/bind";
import styles from "./newProfiles.css";
import * as selectors from "../../selectors";
import * as ducks from '../../ducks';
import { Breadcrumb } from "../../../../components/common/Breadcrumb";
import AdminLayout from "../AdminLayout";
import Loader from "../../../../components/componentKit/Loader";
import NoUser from "./NoUser";
import ActiveProfile from "./ActiveProfile";
import { isDataNotFetched } from "../../../utils/utils.js";

const cx = classNames.bind(styles);

const page = "profiles-applied";

const status = 4;

const VERIFICATION_MESSAGE_ACCEPT = `Проверка Ваших документов завершена - все в полном порядке! Вы можете начать обучение в онлайн-школе прямо сейчас.`;
const VERIFICATION_MESSAGE_DECLINED = `Здравствуйте! К сожалению, Ваши документы не прошли верификацию.`;

/**
 *  Компонент AppliedProfiles.
 *  Используется для отображения страницы админки
 *
 */
class AppliedProfiles extends Component {
  /**
   * @memberof AppliedProfiles
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {string} propTypes.token Токен
   * @prop {object} propTypes.userInfo Данные о юзере
   *
   *
   * */
  static propTypes = {
    token: PropTypes.string,
    userInfo: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);

    this.state = {
      usersList: [],
      isLoad: true,
      activeProfile: null,
      verificationStatus: null,
      take: 10,
      skip: 0,
      filter: '',
    };

    this.renderBody = this.renderBody.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.setFilter = this.setFilter.bind(this);
    this.toggleVerificationStatus = this.toggleVerificationStatus.bind(this);
    this.takeMore = this.takeMore.bind(this);
  }

  toggleVerificationStatus(value) {
    this.setState({ verificationStatus: Number(value) });
  }

  compareData(user, formData) {
    let userInfoEducations = [];
    let userInfoWorks = [];
    let userInfoDocuments = [];
    if (formData.userInfoEducations.length) {
      for (let index = 0; index < user.userInfoEducations.length; index++) {
        const item = formData.userInfoEducations[index];
        if (item) {
          userInfoEducations.push({
            id: user.userInfoEducations[index].id,
            university: item.university
              ? item.university
              : user.userInfoEducations[index].university,
            specialty: item.specialty
              ? item.specialty
              : user.userInfoEducations[index].specialty,
            endYear: item.endYear
              ? item.endYear
              : user.userInfoEducations[index].endYear,
            diplomaNumber: item.diplomaNumber
              ? item.diplomaNumber
              : user.userInfoEducations[index].diplomaNumber,
            verificationStatus:
              status === 2
                ? item.verificationStatus === "1"
                  ? 2
                  : typeof item.verificationStatus === "string"
                  ? 0
                  : user.userInfoEducations[index].verificationStatus
                : status,
          });
        } else {
          userInfoEducations.push(user.userInfoEducations[index]);
        }
      }
    } else {
      userInfoEducations = user.userInfoEducations ? user.userInfoEducations.slice() : null;
    }
    if (formData.userInfoWorks.length) {
      for (let index = 0; index < user.userInfoWorks.length; index++) {
        const item = formData.userInfoWorks[index];
        if (item) {
          userInfoWorks.push({
            id: user.userInfoWorks[index].id,
            firmName: item.firmName
              ? item.firmName
              : user.userInfoWorks[index].firmName,
            startDate: item.startDate
              ? item.startDate + "T00:00:00"
              : user.userInfoWorks[index].startDate,
            endDate: item.endDate
              ? item.endDate + "T00:00:00"
              : user.userInfoWorks[index].endDate,
            isCurrent: item.isCurrent
              ? item.isCurrent
              : user.userInfoWorks[index].isCurrent,
            position: item.position
              ? item.position
              : user.userInfoWorks[index].position,
            verificationStatus:
              status === 2
                ? item.verificationStatus === "1"
                  ? 2
                  : typeof item.verificationStatus === "string"
                  ? 0
                  : user.userInfoWorks[index].verificationStatus
                : status,
          });
        } else {
          userInfoWorks.push(user.userInfoWorks[index]);
        }
      }
    } else {
      userInfoWorks = user.userInfoWorks ? user.userInfoWorks.slice() : null;
    }
    if (formData.userInfoDocuments.length) {
      for (let index = 0; index < user.userInfoDocuments.length; index++) {
        const item = formData.userInfoDocuments[index];
        if (item) {
          userInfoDocuments.push({
            id: user.userInfoDocuments[index].id,
            documentName: user.userInfoDocuments[index].documentName,
            fileName: user.userInfoDocuments[index].fileName,
            fileId: user.userInfoDocuments[index].fileId,
            url: user.userInfoDocuments[index].url,
            verificationStatus:
              status === 2
                ? item.verificationStatus === "1"
                  ? 2
                  : typeof item.verificationStatus === "string"
                  ? 0
                  : user.userInfoDocuments[index].verificationStatus
                : status,
          });
        } else {
          userInfoDocuments.push(user.userInfoDocuments[index]);
        }
      }
    } else {
      userInfoDocuments = user.userInfoDocuments ? user.userInfoDocuments.slice() : null;
    }
    return { userInfoEducations, userInfoWorks, userInfoDocuments };
  }

  createUserData(user, fields) {
    user.userInfoEducations = fields.userInfoEducations;
    user.userInfoWorks = fields.userInfoWorks;
    user.userInfoDocuments = fields.userInfoDocuments;
    return user;
  }

  async handleSubmit(formData) {
    const { userInfo, dispatch } = this.props;
    const postData = await this.createPostData(formData);
    const user = this.state.activeProfile;
    const userFields = this.compareData(user, postData);
    let userData = this.createUserData(user, userFields);
    userData.managerName = userInfo.data.firstName;
    userData.userId = `${userData.id}`;
    userData.message =
      this.state.verificationStatus === 2
        ? VERIFICATION_MESSAGE_DECLINED + ` ${postData.verificationMessage}`
        : VERIFICATION_MESSAGE_ACCEPT;
    userData.verificationMessage =
      this.state.verificationStatus === 2
        ? VERIFICATION_MESSAGE_DECLINED + ` ${postData.verificationMessage}`
        : VERIFICATION_MESSAGE_ACCEPT;
    userData.verificationStatus = this.state.verificationStatus;
    console.log(userData);

    dispatch(ducks.verifyUser(userData))
    this.setState({ take: 10, skip: 0, usersList: [], activeProfile: null });
    dispatch(ducks.clearFilter());
    setTimeout(() => {
      this.takeMore();
    }, 1000)
  }

  createPostData(fromData) {
    const verificationStatus = 0;
    return {
      userInfoEducations: fromData.userInfoEducations || [],
      userInfoWorks: fromData.userInfoWorks || [],
      verificationStatus: verificationStatus,
      userInfoDocuments: fromData.userInfoDocuments || [],
      verificationMessage: fromData.verificationMessage || "",
    };
  }

  componentDidMount() {
    this.takeMore();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.profiles !== this.props.profiles) {
      const { profiles } = this.props;
      if (isDataNotFetched(profiles)) {
        return
      }
      this.setState((state) => ({ usersList: [...state.usersList, ...profiles.data] }))
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(ducks.clearFilter());
  }

  setFilter(e) {
    const { dispatch } = this.props;
    const text = e.currentTarget.value;
    if (text.length > 2) {
      this.setState({ filter: text })
      dispatch(ducks.filterProfiles({ userFilterText: text, verificationStatus: status }))
      return
    }
    dispatch(ducks.clearFilter());
    this.setState({ filter: '' })
  }

  takeMore() {
    const { dispatch } = this.props;
    const { take, skip } = this.state;
    dispatch(ducks.getProfiles({ 
      take: take,
      skip: skip,
      verificationStatus: status,  
    })).then(() => {
      this.setState((state) => ({ skip: state.skip + state.take }))
    })
  }

  renderHeader() {
    const { lang } = this.props;
    const i18n = dict[lang];
    const items = [
      i18n["admin.main"],
      i18n["admin.profiles"],
      i18n["admin.profiles.applied"],
    ];
    const links = ["/admin/profiles", "/admin/profiles"];
    return (
      <div className={cx(styles.profileHeader)}>
        <h2 className={styles.profileHeader__title}>Принятые анкеты</h2>
        <Breadcrumb items={items} links={links} />
      </div>
    );
  }

  renderUser(item) {
    const data = item.updateTs.split("T")[0].split("-");
    return (
      <li
        key={item.id}
        className={
          this.state.activeProfile && this.state.activeProfile.id === item.id
            ? styles.profileItem_active
            : styles.profilesItem
        }
        onClick={() => this.setState({ activeProfile: item })}
      >
        <span>{`${item.id} - ${item.lastName} ${item.firstName.slice(0, 1)}.${item.middleName.slice(0, 1)}.`}</span>
        <span className={styles.profilesItem__date}>{`${data[2]}.${
          data[1]
        }.${data[0].slice(2, 4)}`}</span>
      </li>
    );
  }

  renderBody() {
    const { lang, profiles, filteredProfiles } = this.props;
    const { take, skip } = this.state;
    const isNotAllProfiles = profiles ? profiles.itemsCounter > skip : true; 
    const isFilterActive = !isDataNotFetched(filteredProfiles) && Array.isArray(filteredProfiles.data)
    return (
      <div>
        {!(!isDataNotFetched(profiles) || this.state.usersList.length > 0) ? (
          <Loader />
        ) : (
          <div className={styles.profilesBody}>
            <div className={styles.profilesBody__leftBlock}>
              <div className={styles.search__wrapper}>
                <input
                  placeholder="Поиск по ID или ФИО"
                  className={styles.search}
                  onChange={this.setFilter}
                />
              </div>
              <div className={styles.profilesList}>
                <ul>
                  {isFilterActive ? filteredProfiles.data.map((item) => this.renderUser(item))
                  : this.state.filter ? <Loader /> : this.state.usersList.map((item) => this.renderUser(item))}
                  {isDataNotFetched(profiles) && <Loader />}
                </ul>
                {isNotAllProfiles && !isFilterActive && !this.state.filter && <button className={styles.buttonShowMore} onClick={this.takeMore} >{'Показать еще'}</button>}
              </div>
            </div>
            <div className={styles.profilesBody__mainBlock}>
              {this.state.activeProfile ? (
                <div className={styles.activeProfile}>
                  <ActiveProfile
                    user={this.state.activeProfile}
                    lang={lang}
                    status={4}
                    onSubmit={this.handleSubmit}
                    toggleVerificationStatus={this.toggleVerificationStatus}
                  />
                </div>
              ) : (
                <NoUser />
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  render() {
    const { location } = this.props;
    return (
      <AdminLayout page={page} location={location}>
        <div className={cx(styles.profiles)}>
          {this.renderHeader()}
          {this.renderBody()}
        </div>
      </AdminLayout>
    );
  }
}

const mapStateToProps = (state) => {
  const { userInfo, } = state;

  return {
    userInfo,
    lang: state.lang,
    profiles: selectors.selectProfiles(state),
    filteredProfiles: selectors.selectFilteredProfiles(state),
  };
};

const mapDispatchToProps = (dispatch) => {
  return { dispatch };
};

AppliedProfiles = connect(mapStateToProps, mapDispatchToProps)(AppliedProfiles);

export default CSSModules(AppliedProfiles, styles);
