import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { browserHistory } from 'react-router'
import * as actions from '../actions'
import { SubmissionError } from 'redux-form'
import ContactsValidationForm from '../components/profile/ContactsValidationForm'
import SubmitValidationForm from '../components/profile/SubmitValidationForm'
import LoadingView from '../components/componentKit/LoadingView'
import MobileLeftMenu from '../components/componentKit2/MobileLeftMenu'
import cookie from 'react-cookie'
import Modal from 'boron-react-modal/FadeModal'
import moment from 'moment'
import { api, domen } from '../config.js'
import CSSModules from 'react-css-modules'
import styles from './profileCreate.css'
import HeaderTask from '../components/componentKit2/HeaderTask'
import Menu from '../components/todayTask/Menu'
import { changeChatType, clearRenderChat, setAuth, setTypeId, PRIVATE_CHAT_ID } from '../actions'
import { Link } from 'react-router'
import { submit } from 'redux-form'
import { dict } from 'dict';

let contentStyle = {
  borderRadius: '18px',
  padding: '30px'
}
/**
 *  Компонент ProfileCreate.
 *  Используется для отображения страницы 'Профиль' (/profile)
 *
 */
class ProfileCreate extends Component {
  /**
   * @memberof ProfileCreate
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {string} propTypes.token Токен
   * @prop {object} propTypes.userInfo Данные о юзере
   * @prop {object} propTypes.profileFields Заполненные данные профиля
   * @prop {object} propTypes.profileData Данные профиля
   * @prop {array} propTypes.bodyParams Данные параметров тела
   * @prop {object} propTypes.insurance Данные по страховке
   * @prop {string} propTypes.selectedProfile Выбранные профиль
   * @prop {boolean} propTypes.isFetching Индикатор загрузки
   *
   * */

  static propTypes = {
    token: PropTypes.string,
    userInfo: PropTypes.object.isRequired,
    profileFields: PropTypes.object.isRequired,
    profileData: PropTypes.object.isRequired,
    bodyParams: PropTypes.array,
    insurance: PropTypes.object,
    selectedProfile: PropTypes.string.isRequired,
    isFetching: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  state = {
    isFirstEdit: true,
    isAdvanceVisible: false,
  }

  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.margin = '80px'
      contentStyle.width = '340px'
    }

  }

  componentDidUpdate() {
    const { profileData, dispatch, location } = this.props
    if (profileData && profileData.isFirstEdit) {
      dispatch({ type: 'IS_READY_TO_TASKS', isReadyToTasks: true })
    }
  }

  componentDidMount() {
    const { dispatch, selectedProfile, fetchTaskDayIfNeeded, selectedTaskDay, location, profileData } = this.props
    dispatch(actions.fetchProfileIfNeeded(selectedProfile));
    dispatch(actions.fetchTaskDayIfNeeded(selectedTaskDay));
    dispatch({type: 'SET_MENU_LIST', page: 'profile'});

    this.setState({
      isFirstEdit: profileData ? profileData.isFirstEdit : false
    })

		const url = location.pathname.slice(1);
		this.sengLogPageView(url)
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.selectedProfile !== this.props.selectedProfile) {
      const { dispatch, selectedProfile } = nextProps
      dispatch(actions.fetchProfileIfNeeded(selectedProfile))
    }
    if (nextProps.profileData.isFirstEdit !== this.props.profileData.isFirstEdit) {
      this.setState({
        isFirstEdit: nextProps.profileData ? nextProps.profileData.isFirstEdit : false
      })
    }


    if (nextProps.selectedTaskDay !== this.props.selectedTaskDay) {
      const { fetchTaskDayIfNeeded, selectedTaskDay, fetchChat } = nextProps
      this.props.dispatch(actions.fetchTaskDayIfNeeded(selectedTaskDay))
    }
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(actions.receiveProfile('reactjs', { data: [{ insurance: {}, bodyMeasures: [] }] }))
  }

  toggleVisible = () => {
    this.setState({ isAdvanceVisible: !this.state.isAdvanceVisible })
  }

	sengLogPageView(url, params) {
		const payload = {
			authToken: cookie.load('token'),
			data: {
				url,
				parameters: params ? params : null
			}
		};
		return fetch(`${api}/data/log-pageView`, {
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			method: 'POST',
			body: JSON.stringify(payload)
		})
			.then(response => {
				return response.json()
			})
			.catch(console.error)
	}

  onSubmitContacts(data, isOrigin){
    if (isOrigin !== 'origin'){
      return;
    }
    console.log(data);
    const country = data.country.value ? data.country.value.trim() : data.country.trim();
    const city = data.city.value ? data.city.value.trim() : data.city.trim();
    const region = data.region.value ? data.region.value.trim() : data.region.trim();
    const payload = {
      verificationStatus: 0,
      firstName: data.firstName,
      lastName: data.lastName,
      middleName: data.middleName,
      gender: data.gender.value,
      region: region,
      phone: data.phone.trim(),
      city: city,
      country: country,
      birthday: data.birthday,
      email: data.email.trim(),
      lang: data.lang.value,
      customUserFields: {
        workPosition: data.customUserFields.workPosition.map(item => item.value).join(', '),
      }
    };
    this.onSubmit(payload);
  }

  onSubmitVerify(data, verify, isOrigin, cb) {
    if (isOrigin !== 'origin'){
      return;
    }
    data.verificationStatus = 0;
    if (verify) {
      data.verificationStatus = 1;
    }

    const userInfoEducations = data.userInfoEducations.map((item) => {
      item.endYear = item.endYear ? item.endYear.value : '';
      return item;
    });

    let userInfoDocuments = [];

    if (data.userInfoDocuments && Object.keys(data.userInfoDocuments).length && Object.keys(data.userInfoDocuments[Object.keys(data.userInfoDocuments)[0]]).length) {
      Object.keys(data.userInfoDocuments).map((key) => {
          userInfoDocuments.push(data.userInfoDocuments[key]);
      })
    }


    const payload = {
      userInfoEducations,
      userInfoWorks: Object.keys(data.userInfoWorks[Object.keys(data.userInfoWorks)[0]]).length ? data.userInfoWorks : [],
      customUserFields: {
        workSeniority: data.workSeniority,
      },
      verificationStatus: data.verificationStatus,
      userInfoDocuments
    };
    this.onSubmit(payload, cb, verify);
  }

  onSubmit(data, cb, verify){
    const { profileFields, profileData, token, dispatch, selectedProfile, userInfo, lang } = this.props;


    this.refs.loadingModal.show();


    const payload = {
      authToken: token ? token : cookie.load('token'),
      data
    };

    return fetch(`${api}/user/user-update`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(payload)
    })
      .then(response => response.json())
      .then(user => {
        this.refs.loadingModal.hide()

        if (!user.data) {
          if (user.errorCode === 131) {
            this.refs.errorModal.show()
          } else {
            //throw new SubmissionError({_error: 'Что-то пошло не так, попробуйте снова.'})
          }

        } else {
          if (cb) {
            cb();
          }
          if (this.state.isFirstEdit) {
            this.setState({
              isFirstEdit: false
            })
          }
          if (verify) {
            this.refs.successVerifyModal.show();
          } else {
            this.refs.successModal.show();
            if (data.lang && (lang !== data.lang)) {
              setTimeout(() => {
                window.location.reload();
              }, 1000)
            }
          }
          dispatch(actions.fetchProfileIfNeeded(selectedProfile));
        }
      })
  }


  render() {

    let { lang, profileData, insurance, selectedProfile, bodyParams, token, isFetching, showMobileLeftMenu, hideLeftMenu, showLeftMenu,
       isReadyToTasks, isBabyFeeding, dispatch, setAuth, profileFields, userInfo, taskDayData } = this.props
    const isEmpty = !profileData || !profileData.email
    const insuranceIsEmpty = !insurance
    const { firstName, lastName, program, photo, gender } = userInfo.data
    const { isLoad } = taskDayData
    const isAlfa = domen.isAlfa
    const isTele2Lk = domen.isTele2
    const isUnipro = domen.isUnipro
    let calendar, id
      if(taskDayData.dayData){
        calendar= taskDayData.dayData.calendar
        id= taskDayData.dayData.id
    }


    if (profileData && profileData.userInfoEducations && profileData.userInfoEducations.length) {
      profileData.userInfoEducations = profileData.userInfoEducations.map((item) => {
        if (!item.endYear || typeof item.endYear.label === 'undefined') {
          item.endYear = {
            label: item.endYear || '',
            value: item.endYear || ''
          }
        }

        return item;
      });
    }

    return (
      <div className={isAlfa ? styles.layoutAlfa : styles.layout}>
        {isEmpty
          ? (isFetching
            ? <LoadingView isUnipro={isUnipro} isTele2Lk={isTele2Lk} isAlfa={isAlfa} title={dict[lang]['regs.loading']}/>
            : <LoadingView isUnipro={isUnipro} isTele2Lk={isTele2Lk} isAlfa={isAlfa} title="Если вы видите это окно, значит мы делаем личный кабинет для вас удобнее! Напишите нам в чат тех поддержки (внизу справа)"/>)
          : <div  style={{ opacity: isFetching ? 0.5 : 1}}>

            { showMobileLeftMenu &&
            <MobileLeftMenu dayId={id} hideMenu={hideLeftMenu}/>
            }

          <HeaderTask
            program={program}
            showLeftMenu={showLeftMenu}
            fullName={firstName && lastName ? `${firstName} ${lastName}` : null}
            avatar={photo}
            setAuth={setAuth}
          />

          {showMobileLeftMenu &&
          <MobileLeftMenu dayId={id} hideMenu={hideLeftMenu} />
          }
            <div className={isAlfa ? styles.layoutInnerAlfa : styles.layoutInner}>
              <div className={styles.grid}>
                <div className={styles.gridCellLayoutMenu14Show}>
                  {/*enable left menu for isFirstEdit user. Uncommit when not needed*/}
                  {/*div className={this.state.isFirstEdit ? styles.gridCellLayoutMenu14 : styles.gridCellLayoutMenu14Show}>*/}
                  <div id="menu">

                  {/*enable left menu for isFirstEdit user. Uncommit when not needed*/} 
                  {/*div id="menu" className={this.state.isFirstEdit ? styles.gridLayoutMenuInner :styles.gridLayoutMenuInnerShow}>*/}

                    <Menu fullName={`${firstName} ${lastName}`} dayId={id} gender={gender} />

                  </div>
                </div>{/*gridCellLayoutMenu14*/}

                <div className={styles.gridCellLayoutContentPocket34}>

                  <ContactsValidationForm
                    profileData={profileData}
                    onSubmit={this.onSubmitContacts.bind(this)}
                    initialValues={{
                      ...profileData,
                    }}
                    isAdvanceVisible={this.state.isAdvanceVisible}
                  />
                  <SubmitValidationForm
                    bodyMeasure={bodyParams}
                    profileData={profileData}
                    isReadyToTasks={isReadyToTasks}
                    feedDate={moment(profileData.lastBabyFeedMonth).format('YYYY-MM-DD')}
                    injuriesEx={profileData.injuriesExist}
                    isBabyFeed={profileData.isBabyFeeding}
                    prevSeasons={profileData.prevSeasons}
                    initialValues={{
                    ...profileData,
                    workSeniority: profileData.customUserFields && profileData.customUserFields.workSeniority || null
                    }}
                    onSubmit={this.onSubmitVerify.bind(this)}
                    toggleVisible={this.toggleVisible}
                  />

                </div>{/*gridCellLayoutContentPocket34*/}

              </div>{/*grid*/}
            </div>{/*layoutInner*/}

            <Modal ref='successModal' contentStyle={contentStyle}>
              <h2>{dict[lang]['profile.saved.1']}</h2>
              <br/>
              <h3>{dict[lang]['profile.saved.2']}</h3>
              <br/>
              <div className="divider" />
              <div className={styles.btnAction} onClick={() => {
                this.refs.successModal.hide()
                dispatch({ type: 'IS_READY_TO_TASKS', isReadyToTasks: true })
              }}>
                {dict[lang]['regs.continue']}
              </div>
            </Modal>

            <Modal ref='successVerifyModal' contentStyle={contentStyle}>
              <h2 className={styles.profileTextSuccess}>{dict[lang]['profile.savedVerify.1']}</h2>
              <h3 className={styles.profileNote}>{dict[lang]['profile.savedVerify.2']}</h3>
              <br/>

              <div className={styles.profileSuccessBtns}>
                <div className={styles.pr15}>
                  <button className={styles.btnAction} onClick={() => {
                    this.refs.successVerifyModal.hide()
                  }}>
                    {dict[lang]['regs.continue']}
                  </button>
                </div>
              </div>
            </Modal>

            <Modal ref='failBirthdayModal' contentStyle={contentStyle}>
              <h2>Дата вашего рождения не верна, проверьте формат даты</h2>
              <br/>
              <div className={styles.btnAction} onClick={() => {
                this.refs.failBirthdayModal.hide()
              }}>
                {dict[lang]['regs.continue']}
              </div>
            </Modal>



            <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
              <div className={styles.entryHeader}>
                <h2 className={styles.entryTitleCenter}>{dict[lang]['regs.loading']}</h2>
              </div>
              <div className={styles.textCenter}>
                <div className={styles.loaderMain}></div>
              </div>
            </Modal>

            {isReadyToTasks &&
              <ul className={styles.menuMobBottom}>
                  <li className={styles.menuMobBottomItem}>
                      <Link to={'/task'}  className={styles.menuMobBottomItemInner}>
                          <span className={styles.menuMobBottomIco}>
                            <svg className={styles.svgIcoBookMobile}>
                              <use xlinkHref="#ico-m-tasks"></use>
                            </svg>
                          </span>
                          <span className={styles.menuMobBottomTitle}>Задания</span>
                      </Link>
                  </li>
                  <li className={styles.menuMobBottomItem}>
                      <Link to={'/food'}  className={styles.menuMobBottomItemInner}>
                          <span className={styles.menuMobBottomIco}>
                            <svg className={styles.svgIcoFoodMobile}>
                              <use xlinkHref="#ico-m-food"></use>
                            </svg>
                          </span>
                          <span className={styles.menuMobBottomTitle}>Питание</span>
                      </Link>

                  </li>
                 <li className={styles.menuMobBottomItem}>
                      <Link to={'/chats/' + id}  className={styles.menuMobBottomItemInner}>
                          <span className={styles.menuMobBottomIco}>
                            <svg className={styles.svgIcoPhoto}>
                              <use xlinkHref="#ico-chat"></use>
                            </svg>
                          </span>
                          <span className={styles.menuMobBottomTitle}>Чат</span>
                      </Link>
                  </li>
                  <li className={styles.menuMobBottomItem}>
                      <Link to={'/reports'}  className={styles.menuMobBottomItemInner}>
                          <span className={styles.menuMobBottomIco}>
                            <svg className={styles.svgIcoBookMobile}>
                              <use xlinkHref="#ico-m-book"></use>
                            </svg>
                          </span>
                          <span className={styles.menuMobBottomTitle}>Зачеты</span>
                      </Link>
                  </li>
              </ul>
            }
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {

  const { selectedProfile, recivedProfile, userToken, birthday, isBabyFeeding, showMobileLeftMenu,
    babyBirthday, menuList, sign, babyFeed, isReadyToTasks, profileFields, sportsPast, userInfo, taskDayData, lang} = state

  const {
    isFetching,
    lastUpdated,
    profileData,
    insurance,
    bodyParams
  } = recivedProfile[selectedProfile] || {
    isFetching: true,
    profileData: {}
  }

  return {
    userInfo,
    lang,
    showMobileLeftMenu,
    sign,
    menuList,
    isBabyFeeding,
    taskDayData,
    selectedProfile,
    isFetching,
    lastUpdated,
    profileFields,
    profileData,
    insurance,
    bodyParams,
    birthday,
    babyBirthday,
    babyFeed,
    isReadyToTasks,
    sportsPast,
    isBabyFeed: isBabyFeeding,
    token: userToken.token
  }
}
const mapDispatchToProps = dispatch => ({
  setTypeId: bindActionCreators(setTypeId , dispatch),
  changeChatType: bindActionCreators(changeChatType , dispatch),
  clearRenderChat: bindActionCreators(clearRenderChat , dispatch),
  setAuth: bindActionCreators(setAuth , dispatch),
  showLeftMenu: bindActionCreators(
    () => dispatch({type: 'SHOW_LEFT_MENU', show: true}),
    dispatch
  ),
  hideLeftMenu: bindActionCreators(
    () => dispatch({type: 'SHOW_LEFT_MENU', show: false}),
    dispatch
  ),
  dispatch
})
ProfileCreate = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileCreate)

export default CSSModules(ProfileCreate, styles)
