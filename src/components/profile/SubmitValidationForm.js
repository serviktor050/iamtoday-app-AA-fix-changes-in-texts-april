import React, { Component } from "react";
import {
  Field,
  reduxForm,
  FormSection,
  submit,
  getFormValues,
  getFormSyncErrors,
  getFormAsyncErrors,
  getFormSubmitErrors,
  getFormError,
} from "redux-form";
import PropTypes from 'prop-types';
import * as R from "ramda";
import { connect } from "react-redux";
import CheckboxProfile from "../componentKit/CheckboxProfile";
import Timer from "../componentKit/Timer";
import InputProfile from "../componentKit/InputProfile";
import FieldFileInput from "../componentKit2/FieldFileInput";
import SelectComponent from "../componentKit/SelectComponent";
import InputCountMask from "../componentKit/InputCountMask";
import Insurance from "../profile/Insurance";
import cookie from "react-cookie";
import moment from "moment";
import { Link, browserHistory } from "react-router";
import { api, domen } from "../../config.js";
import InputDayPicker from "./InputDayPicker";
import { OKSDK } from "./oksdk.js";
import MobileDayPicker from "./MobileDayPicker";
import CSSModules from "react-css-modules";
import styles from "./submitValidationForm.css";
import ReactTooltip from "react-tooltip";
import BodyParams from "../profile/BodyParams";
import Modal from "boron-react-modal/FadeModal";
import { bindActionCreators } from "redux";
import * as actions from "../../actions";
import {
  cities,
  citiesUnipro,
  regionsData,
  countriesData,
  citiesRuData,
} from "../../utils/data";
import AddBlock from "../componentKit2/AddBlock";
import { dict } from "dict";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);

const contentStyle = {
  borderRadius: "18px",
  padding: "30px",
};

const FB = window.FB;
const getEndYear = () => {
  let arr = [];
  let i = 1950;
  while (i < 2020) {
    arr.push({
      value: i,
      label: i,
    });
    i++;
  }
  return arr;
};
const endYearArr = getEndYear();

const options = [
  { label: "Самоаское время UTC−11", value: -11 },
  { label: "Гавайско-Алеутское время UTC−10", value: -10 },
  { label: "Аляскинское время UTC−9", value: -9 },
  { label: "Тихоокеанское время UTC-8", value: -8 },
  { label: "Горное время UTC−7", value: -7 },
  { label: "Центральноамериканское время UTC−6", value: -6 },
  { label: "Североамериканское восточное время UTC−5", value: -5 },
  { label: "Атлантическое время UTC-4", value: -4 },
  { label: "Аргентинское время UTC-3", value: -3 },
  { label: "Азорские острова", value: -1 },
  { label: "Среднее время по Гринвичу UTC", value: 0 },
  { label: "Центральноевропейское время UTC+1", value: 1 },
  { label: "Калининград UTC+2", value: 2 },
  { label: "Московское время UTC+3", value: 3 },
  { label: "Ижевск, Самара UTC+4", value: 4 },
  { label: "Екатеринбург UTC+5", value: 5 },
  { label: "Новосибирск UTC+6", value: 6 },
  { label: "Красноярск UTC+7", value: 7 },
  { label: "Иркутск UTC+8", value: 8 },
  { label: "Якустк UTC+9", value: 9 },
  { label: "Владивосток UTC+10", value: 10 },
  { label: "Соломоновы острова UTC+11", value: 11 },
];

const regions = regionsData.map((item) => {
  return {
    label: item,
    value: item,
  };
});
const countries = countriesData.map((item) => {
  return {
    label: item,
    value: item,
  };
});
const citiesRu = citiesRuData.map((item) => {
  return {
    label: item,
    value: item,
  };
});

/**
 *  Компонент SubmitValidationForm.
 *  Используется для вывода формы на странице анкета
 *
 */
class SubmitValidationForm extends Component {
  /**
   * @memberof  SubmitValidationForm
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {object} propTypes.initialValues Заполненные параметры с сервера
   * @prop {bool} propTypes.isBabyFeeding Есть ли блок кормление грудью
   * @prop {object} propTypes.userInfo Данные пользователя
   * @prop {object} propTypes.prevSeasons Блок Программа текущего сезона
   *
   * */

  static propTypes = {
    initialValues: PropTypes.object.isRequired,
    isBabyFeeding: PropTypes.bool,
    userInfo: PropTypes.object.isRequired,
    prevSeasons: PropTypes.array.isRequired,
  };

  state = {
    item: "one",
    workTeam: "",
    timezone: null,
    height: "",
    educationsYear: null,
    agreedDocs: false,
    hideProfile: false,
    /**
     * @memberof  SubmitValidationForm
     * Показать блок с предыдущими сезонами
     * */
    programsShow: false,
  };

  componentDidMount() {
    const { userInfo, initialValues, profileData } = this.props;
    // const select = document.querySelector('.heightSelect')
    // const button = select.querySelector('button')
    // const divs = select.querySelectorAll('div')
    // divs[4].style.lineHeight = '43px'
    // button.style.display = 'none'

    // NotVerified = 0,
    //   Pending = 1,
    //   Rejected = 2,
    //   Resended = 3,
    //   Approved = 4
    this.onCancelValidationForm = this.onCancelValidationForm.bind(this);
    if (profileData && profileData.verificationStatus) {
      this.setState({
        hideProfile: true,
      });
    }
    let timezone = null;

    document.body.addEventListener("click", (e) => {
      if (this.state.programsShow) {
        this.setState({ programsShow: false });
      }
    });
    function initGoolge() {
      window.gapi.load("auth2", () => {
        window.gapi.auth2
          .init({
            client_id:
              "902885252188-5e5idu7tcva354cu3tnn30pdvq12gvn7.apps.googleusercontent.com",
            scope: "profile",
          })
          .then((res, err) => {
            let auth2 = window.gapi.auth2.getAuthInstance();
          });
      });
    }
    //initGoolge()
  }

  onclickVk() {
    window.VK.Auth.login(getit);
    let self = this;
    function getit(response) {
      window.VK.Api.call(
        "users.get",
        { user_ids: response.session.user.id, fields: "photo_200", v: 5.73 },
        (r) => {
          const photo = r.response[0].photo_200;
          self.refs.avatar.src = photo;
          const photoPayload = {
            authToken: cookie.load("token"),
            data: { photo },
          };
          self.updatePhoto(photoPayload);
          self.socialNetUserCreate(1, response.session.user.id);
        }
      );
    }
  }

  onClickGoogle() {
    const auth2 = window.gapi.auth2.getAuthInstance();
    const options = {
      prompt: "",
    };
    auth2.signIn(options).then((res, err) => {
      if (err) {
        console.log(err);
      }
      const basicProfile = res.getBasicProfile();
      const photo = basicProfile.getImageUrl();
      this.refs.avatar.src = photo;
      const photoPayload = {
        authToken: cookie.load("token"),
        data: { photo },
      };
      return this.updatePhoto(photoPayload);
      /*res.profileObj = {
        googleId: basicProfile.getId(),
        imageUrl: basicProfile.getImageUrl(),
        email: basicProfile.getEmail(),
        name: basicProfile.getName(),
        givenName: basicProfile.getGivenName(),
        familyName: basicProfile.getFamilyName()
      }*/
    });
  }

  updatePhoto(photoPayload) {
    return fetch(`${api}/user/user-update`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(photoPayload),
    })
      .then((response) => response.json())
      .then((json) => {
        this.props.dispatch({ type: "SET_PHOTO", data: json.data.photo });
      });
  }

  socialNetUserCreate(socialNetType, userIdOrToken, soc) {
    let payload = {
      authToken: cookie.load("token"),
      data: {
        socialNetType: socialNetType,
        userId: userIdOrToken,
        token: userIdOrToken,
      },
    };
    if (soc === "FB") {
      delete payload.data.userId;
    }

    return fetch(`${api}/user/socialNetUser-create`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((json) => {});
    //if (json && json.data) {
  }

  componentWillMount() {
    let { dispatch, profileData, injuriesEx } = this.props,
      {
        birthday,
        babyBirthday,
        babyCount,
        didSports,
        lastBabyFeedMonth,
        injuryItems,
        diseases,
        injuriesExist,
      } = profileData;

    if (window.mobilecheck()) {
      contentStyle.margin = "100px";
      contentStyle.width = "300px";
    }
    //dispatch({ type: 'IS_INJURIES', injuriesExist: injuriesExist})
  }

  loadPhoto(input) {
    const { target } = input;
    if (target.files && target.files[0]) {
      var reader = new FileReader();

      reader.onload = (e) => {
        this.refs.avatar.src = e.target.result;

        const payload = {
          authToken: cookie.load("token"),
          data: {
            name: target.files[0].name,
            content: reader.result.replace(/data:image\/\w+;base64,/, ""),
          },
        };

        return fetch(`${api}/data/file-upload`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify(payload),
        })
          .then((response) => response.json())
          .then((json) => {
            if (json.errorCode === 1 && json.data) {
              const photoPayload = {
                authToken: cookie.load("token"),
                data: {
                  photo: `https://api.todayme.ru/files/${json.data.uid}.${json.data.extension}`.replace(
                    /api\//,
                    ""
                  ),
                },
              };

              return this.updatePhoto(photoPayload);
            }
          });
      };

      reader.readAsDataURL(target.files[0]);
    }
  }

  onChangeHeight(event, index, value) {
    this.setState({ height: value });
  }

  onProgramsShow() {
    return;
    if (this.state.programsShow) {
      this.setState({ programsShow: false });
    } else {
      this.setState({ programsShow: true });
    }
  }

  select = ({ name, value }) => {
    this.setState({
      [name]: value,
    });
  };

  submit(e, verify) {
    const { onSubmit, valid, valuesData, dispatch, profileData } = this.props;

    if (verify) {
      dispatch(submit("submitValidation"));
      dispatch(submit("contactsValidation"));
      if (!valid || profileData.isFirstEdit) {
        return this.refs.submitFailModal.show();
      }
    }
    onSubmit(valuesData, verify, "origin", () => {
      if (verify) {
        this.setState({ hideProfile: true });
      }
    });
  }

  onCancelValidationForm() {
    this.setState({
      hideProfile: true,
    });
  }

  renderResult() {
    const { userInfo, profileData, toggleVisible, lang } = this.props;
    let title = dict[lang]["profile.ty"];
    let desc = dict[lang]["profile.dataWillCheck"];

    if (userInfo.data.verificationStatus == 2) {
      title = dict[lang]["profile.docsNotSuccess"];
      desc = dict[lang]["profile.answerSupport"];
    }
    if (userInfo.data.verificationStatus == 4) {
      title = dict[lang]["profile.statusSuccess"];
      desc = "";
    }

    return (
      <div className={styles.profileSuccess}>
        <div
          className={
            userInfo.data.verificationStatus == 2 ? styles.profileTextDanger : 
              userInfo.data.verificationStatus == 4 ? styles.profileText : styles.profileTextWaiting
          }
        >
          {title}
        </div>
        <div className={styles.profileNote}>{desc}</div>
        {profileData.verificationMessage && (
          <div className={styles.profileNote}>
            {profileData.verificationMessage}
          </div>
        )}
        <div className={styles.profileSuccessBtns}>
          <button
            className={styles.btnSide}
            onClick={() => {
              toggleVisible();
              this.setState({ hideProfile: false });
            }}
          >
            {dict[lang]["profile.changeVerificationForm"]}
          </button>
        </div>
      </div>
    );
  }

  render() {
    const {
      error,
      valid,
      handleSubmit,
      isBabyFeeding,
      bodyMeasure,
      setCheckIns,
      toggleForm,
      dispatch,
      onSubmit,
      initialValues,
      userInfo,
      profileData,
      profileFields,
      prevSeasons,
      lang,
    } = this.props;
    let {
      firstName,
      lastName,
      email,
      gender,
      enabledSocialNetworks,
      workTeamNames,
      workTeamMembers,
      workTeamInfo,
    } = userInfo.data;
    const { injuryItems, diseases } = profileFields;

    const {
      workRelation,
      relativeWorkerName,
      workCard,
    } = profileData.customUserFields;
    let fullNameItems, passportItems, birthdayIns;
    const { verificationStatus } = profileData;
    const isAlfa = domen.isAlfa;
    const isTele2Lk = domen.isTele2;
    const isUnipro = domen.isUnipro;
    const isEls = domen.isEls;

    const i18n = dict[lang];

    const AgreedLabel = () => (
      <div className={styles.note}>
        {dict[lang]["regs.agreed.1"]}
        <Link to="/offer" target="_blank" className={styles.noteLink}>
          {dict[lang]["regs.agreed.2"]}
        </Link>
      </div>
    );
    const ContractLabel = () => (
      <div className={styles.note}>
        {dict[lang]["profile.agreedContract.1"]}
        <Link
          to="/offer?contract=true"
          target="_blank"
          className={styles.noteLink}
        >
          {dict[lang]["profile.agreedContract.2"]}
        </Link>
      </div>
    );

    let renderSmm = {};
    if (workTeamNames) {
      workTeamNames = workTeamNames.map((item, idx) => {
        return {
          label: item,
          value: item,
        };
      });
    }

    if (enabledSocialNetworks && enabledSocialNetworks.length) {
      enabledSocialNetworks.forEach((item, idx) => {
        renderSmm[item] = true;
      });
    }

    if (profileData.insurance) {
      fullNameItems = profileData.insurance.fullNameItems;
      passportItems = profileData.insurance.passportItems;
      birthdayIns = profileData.insurance.birthday;
    }

    const sportsPast = [
      { text: "Да", val: true, name: "yes" },
      { text: "Нет", val: false, name: "no" },
    ];

    const injuriesExist = [
      { text: "Есть", val: true, name: "yes2" },
      { text: "Нет", val: false, name: "no2" },
    ];

    const childsItems = [
      { text: "0", name: "zero" },
      { text: "1", name: "one" },
      { text: "2", name: "two" },
      { text: ">3", name: "third" },
    ];

    return (
      <form>
        <div className={styles.stageBoxBigPadding}>
          <div className={styles.stageBoxInner}>
            <div className={cx(styles.mlmRegistrationHeader)}>
              <h2 className={cx(styles.title)}>
                {i18n["profile.verifyDoctor"]}
              </h2>
              {!this.state.hideProfile && (
                <span>
                  <span className={cx("mlmRegistrationHeader__step")}>
                    {`${i18n["mlm.mlmRegistration.step2"]}`}
                  </span>
                  <span className={cx("mlmRegistrationHeader__stepOf")}>
                    &nbsp;{`/ 3`}
                  </span>
                </span>
              )}
            </div>

            {this.state.hideProfile && <hr className={styles.hr2} />}

            {!this.state.hideProfile && (
              <div className={styles.h2}>{dict[lang]["regs.eduAndWork"]}</div>
            )}

            <div className={this.state.hideProfile ? styles.hide : styles.form}>
              <br />
              <h3>{i18n["mlm.mlmRegistration.education.title"]}</h3>
              <br />
              <AddBlock
                text={dict[lang]["profile.additionalEdu"]}
                name="userInfoEducations"
                content={(user, index) => {
                  const classGroup =
                    R.path(["userInfoEducations", index], profileData) &&
                    profileData.userInfoEducations[index].verificationStatus ==
                      2
                      ? styles.groupDanger
                      : styles.group;
                  return (
                    <div key={index} className={classGroup}>
                      <div className={styles.input}>
                        <Field
                          cls={styles.inputColor}
                          name={`${user}.university`}
                          placeholder={dict[lang]["profile.university"]}
                          component={InputProfile}
                        />
                      </div>

                      <div className={styles.gridCell66}>
                        <div className={styles.pr15}>
                          <div className={styles.input}>
                            <Field
                              cls={styles.inputColor}
                              name={`${user}.specialty`}
                              placeholder={dict[lang]["profile.specialty"]}
                              component={InputProfile}
                            />
                          </div>
                        </div>
                      </div>

                      <div className={styles.grid}>
                        <div className={styles.gridCell33}>
                          <div className="select">
                            <Field
                              name={`${user}.endYear`}
                              val={
                                R.path(
                                  ["userInfoEducations", index],
                                  profileData
                                )
                                  ? profileData.userInfoEducations[index]
                                      .endYear
                                  : "no"
                              }
                              placeholder={dict[lang]["profile.yearEnd"]}
                              options={endYearArr}
                              component={SelectComponent}
                            />
                          </div>
                        </div>

                        <div className={styles.gridCell33}>
                          <div className={styles.input}>
                            <Field
                              cls={styles.inputColor}
                              name={`${user}.diplomaNumber`}
                              placeholder={dict[lang]["profile.diplomNumber"]}
                              component={InputProfile}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }}
              ></AddBlock>

              <hr className={cx("bigHr")} />
              <h3>{i18n["mlm.mlmRegistration.work.title"]}</h3>
              <br />
              <AddBlock
                text={dict[lang]["profile.additionalWork"]}
                name="userInfoWorks"
                content={(user, index) => {
                  const classGroup =
                    R.path(["userInfoWorks", index], profileData) &&
                    profileData.userInfoWorks[index].verificationStatus == 2
                      ? styles.groupDanger
                      : styles.group;
                  return (
                    <div key={index} className={classGroup}>
                      <div className={styles.input}>
                        <Field
                          cls={styles.inputColor}
                          name={`${user}.firmName`}
                          placeholder={dict[lang]["profile.workCurrent"]}
                          component={InputProfile}
                        />
                      </div>

                      <div className={styles.grid}>
                        <div className={styles.gridCell33}>
                          <div className={styles.input}>
                            {window.mobileAndTabletcheck() ? (
                              <Field
                                name={`${user}.startDate`}
                                lang={lang}
                                placeholder={dict[lang]["profile.expFrom"]}
                                id="work-from"
                                component={MobileDayPicker}
                              />
                            ) : (
                              <Field
                                name={`${user}.startDate`}
                                lang={lang}
                                placeholder={dict[lang]["profile.expFrom"]}
                                component={InputDayPicker}
                              />
                            )}
                          </div>
                        </div>

                        <div className={styles.gridCell33}>
                          <div className={styles.input}>
                            {window.mobileAndTabletcheck() ? (
                              <Field
                                name={`${user}.endDate`}
                                lang={lang}
                                placeholder={dict[lang]["profile.expTo"]}
                                id="work-to"
                                component={MobileDayPicker}
                              />
                            ) : (
                              <Field
                                name={`${user}.endDate`}
                                lang={lang}
                                placeholder={dict[lang]["profile.expTo"]}
                                component={InputDayPicker}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.input}>
                        <Field
                          cls={styles.inputColor}
                          name={`${user}.position`}
                          placeholder={dict[lang]["profile.position"]}
                          component={InputProfile}
                        />
                      </div>
                    </div>
                  );
                }}
              ></AddBlock>

              <hr className={cx("bigHr")} />
              <h3>{i18n["mlm.mlmRegistration.atniage.title"]}</h3>
              <br />
              <div className={styles.input}>
                <Field
                  cls={styles.inputColor}
                  name="workSeniority"
                  placeholder={dict[lang]["profile.antiAgeExp"]}
                  component={InputProfile}
                />
              </div>
              <button
                type="button"
                className={styles.btnSaveData}
                onClick={() => {
                  this.submit();
                }}
              >
                {dict[lang]["profile.saveData"]}
              </button>
            </div>

            {this.state.hideProfile && this.renderResult()}
          </div>
        </div>

        {!this.state.hideProfile && (
          <div className={styles.stageBoxBigPadding}>
            <div className={styles.stageBoxInner}>
              <div className={cx(styles.mlmRegistrationHeader)}>
                <h2 className={cx(styles.title)}>
                  {i18n["profile.documents"]}
                </h2>
                {!this.state.hideProfile && (
                  <span>
                    <span className={cx("mlmRegistrationHeader__step")}>
                      {`${i18n["mlm.mlmRegistration.step3"]}`}
                    </span>
                    <span className={cx("mlmRegistrationHeader__stepOf")}>
                      &nbsp;{`/ 3`}
                    </span>
                  </span>
                )}
              </div>

              <div className={cx("info-blue")}>
                <div className={cx("expand-regForm-i")}>i</div>
                <span>{i18n["mlm.mlmRegistration.documents.info"]}</span>
              </div>

              <br />
              <br />

              <AddBlock
                text={dict[lang]["profile.addDoc"]}
                name="userInfoDocuments"
                content={(user, index) => {
                  const classGroup =
                    R.path(["userInfoDocuments", index], profileData) &&
                    profileData.userInfoDocuments[index].verificationStatus == 2
                      ? styles.groupDanger
                      : styles.group;
                  let placeholder = dict[lang]["profile.docName"];
                  let customName = null;
                  let disabled = false;
                  if (!index) {
                    placeholder = dict[lang]["profile.diplomScan"];
                    customName = dict[lang]["profile.diplomScan"];
                    disabled = true;
                  }
                  if (index === 1) {
                    placeholder = dict[lang]["profile.diplomScanSpeciality"];
                    customName = dict[lang]["profile.diplomScanSpeciality"];
                    disabled = true;
                  }
                  if (index === 2) {
                    placeholder = dict[lang]["profile.passScan"];
                    customName = dict[lang]["profile.passScan"];
                    disabled = true;
                  }
                  return (
                    <div key={index} className={classGroup}>
                      <div className={styles.input}>
                        <Field
                          cls={styles.inputColor}
                          name={`${user}`}
                          placeholder={placeholder}
                          customName={customName}
                          component={FieldFileInput}
                          disabled={disabled}
                          lang={lang}
                        />
                        <svg className={styles.svgIconFile}>
                          <use xlinkHref="#file" />
                        </svg>
                      </div>
                    </div>
                  );
                }}
              ></AddBlock>

              <div className={styles.checkbox}>
                <Field
                  className=""
                  name="agreedDocs"
                  id="agreedDocs"
                  value={this.state.agreedDocs}
                  component={CheckboxProfile}
                  titleComponent={ContractLabel}
                  onChange={(agreedDocs) => {
                    this.setState({
                      agreedDocs,
                    });
                  }}
                />
              </div>

              <div className={cx("footer-actions")}>
                <div className={styles.profileBtnsSave}>
                  {verificationStatus > 0 && (
                    <button
                      type="button"
                      className={styles.btnAddVerify}
                      style={{
                        marginTop: "0px",
                        width: "fit-content",
                        alignSelf: "initial",
                        padding: "19px 10px",
                      }}
                      onClick={this.onCancelValidationForm}
                    >
                      {dict[lang]["profile.cancel"]}
                    </button>
                  )}

                  <button
                    type="button"
                    className={styles.btnSaveData}
                    style={{
                      marginTop: "0px",
                      width: "fit-content",
                      alignSelf: "initial",
                    }}
                    onClick={(e) => {
                      this.submit(e, true);
                    }}
                  >
                    {dict[lang]["profile.saveAndVerify"]}
                  </button>
                </div>

                <div className={cx("info-blue")}>
                  <div className={cx("expand-regForm-i")}>i</div>
                  <span>{i18n["profile.needVerify"]}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/*  <BodyParams bodyMeasures={bodyMeasure}/>*/}

        <Modal ref="loadingModal" contentStyle={contentStyle} backdrop={false}>
          <div className={styles.entryHeader}>
            <h2 className={styles.entryTitleCenter}>
              {dict[lang]["regs.loading"]}
            </h2>
          </div>
          <div className={styles.textCenter}>
            <div className={styles.loaderMain}></div>
          </div>
        </Modal>
        <Modal ref="failValidationModal" contentStyle={contentStyle}>
          <h2>Данные могут содержать только цифры с точкой</h2>
          <br />
          <div
            className={styles.btnAction}
            onClick={() => this.refs.failValidationModal.hide()}
          >
            {dict[lang]["regs.loading"]}Продолжить
          </div>
        </Modal>
        <Modal ref="failValidationEmptyModal" contentStyle={contentStyle}>
          <h2>{dict[lang]["regs.loading"]}Некоторые данные не заполнены!</h2>
          <br />
          <div
            className={styles.btnAction}
            onClick={() => this.refs.failValidationEmptyModal.hide()}
          >
            {dict[lang]["regs.loading"]}Продолжить
          </div>
        </Modal>
        <Modal ref="failModal" contentStyle={contentStyle}>
          <h2>{dict[lang]["regs.smthWrong"]}</h2>
          <br />
          <div
            className={styles.btnAction}
            onClick={() => this.refs.failModal.hide()}
          >
            {dict[lang]["regs.continue"]}
          </div>
        </Modal>
        <Modal ref="submitFailModal" contentStyle={contentStyle}>
          <h3>{dict[lang]["profile.someFieldsIncorrect"]}</h3>
          <h3>{dict[lang]["profile.checkProfile"]}</h3>
          <br />
          <div
            className={styles.btnPrimaryCenter}
            onClick={() => this.refs.submitFailModal.hide()}
          >
            {dict[lang]["regs.continue"]}
          </div>
        </Modal>
        <Modal ref="successModal" contentStyle={contentStyle}>
          <div className={styles.profileText}>{dict[lang]["profile.ty"]}</div>
          <div className={styles.profileNote}>
            {dict[lang]["profile.dataWillCheck"]}
          </div>
          <br />

          <div className={styles.profileSuccessBtns}>
            <div className={styles.pr15}>
              <button className={styles.btnAdd} onClick={() => {}}>
                {dict[lang]["profile.toMainPage"]}
              </button>
            </div>

            <div className={styles.pl15}>
              <button
                className={styles.btnSide}
                onClick={() => {
                  this.refs.successModal.hide();
                }}
              >
                {dict[lang]["regs.continue"]}
              </button>
            </div>
          </div>
        </Modal>
      </form>
    );
  }
}

const validate = (values, props) => {
  const errors = {};
  const lang = props.lang;

  if (!values.userInfoEducations || !values.userInfoEducations.length) {
  } else {
    const userInfoEducationsArrayErrors = [];
    const userInfoWorksArrayErrors = [];
    const userInfoDocumentsArrayErrors = [];

    if (values.userInfoEducations) {
      values.userInfoEducations.forEach((member, memberIndex) => {
        const userInfoEducationsErrors = {};
        if (!member || !member.university) {
          userInfoEducationsErrors.university =
            dict[lang]["profile.fieldCanNotEmpty"];
          userInfoEducationsArrayErrors[memberIndex] = userInfoEducationsErrors;
        }
        if (!member || !member.specialty) {
          userInfoEducationsErrors.specialty =
            dict[lang]["profile.fieldCanNotEmpty"];
          userInfoEducationsArrayErrors[memberIndex] = userInfoEducationsErrors;
        }
        if (!member || !member.endYear) {
          userInfoEducationsErrors.endYear =
            dict[lang]["profile.fieldCanNotEmpty"];
          userInfoEducationsArrayErrors[memberIndex] = userInfoEducationsErrors;
        }
        if (!member || !member.diplomaNumber) {
          userInfoEducationsErrors.diplomaNumber =
            dict[lang]["profile.fieldCanNotEmpty"];
          userInfoEducationsArrayErrors[memberIndex] = userInfoEducationsErrors;
        }
      });
    }

    if (values.userInfoWorks) {
      values.userInfoWorks.forEach((member, memberIndex) => {
        const userInfoWorksErrors = {};
        if (!member || !member.firmName) {
          userInfoWorksErrors.firmName = dict[lang]["profile.fieldCanNotEmpty"];
          userInfoWorksArrayErrors[memberIndex] = userInfoWorksErrors;
        }
        if (!member || !member.startDate) {
          userInfoWorksErrors.startDate =
            dict[lang]["profile.fieldCanNotEmpty"];
          userInfoWorksArrayErrors[memberIndex] = userInfoWorksErrors;
        }
        if (!member || !member.endDate) {
          userInfoWorksErrors.endDate = dict[lang]["profile.fieldCanNotEmpty"];
          userInfoWorksArrayErrors[memberIndex] = userInfoWorksErrors;
        }
        if (!member || !member.position) {
          userInfoWorksErrors.position = dict[lang]["profile.fieldCanNotEmpty"];
          userInfoWorksArrayErrors[memberIndex] = userInfoWorksErrors;
        }
      });
    }

    // values.userInfoDocuments.forEach((member, memberIndex) => {
    //   console.log(member)
    //   console.log(memberIndex)
    //   const userInfoDocumentsErrors = {};
    //
    //   if (!member || member.documentName !== 'passport') {
    //     userInfoDocumentsErrors.firmName = 'Загрузите пасспорт';
    //     userInfoDocumentsArrayErrors[memberIndex] = userInfoDocumentsErrors;
    //   }
    //   if (!member || member.documentName !== 'diplom') {
    //     userInfoDocumentsErrors.firmName = 'Загрузите диплом';
    //     userInfoDocumentsArrayErrors[memberIndex] = userInfoDocumentsErrors;
    //   }
    // });

    if (values.userInfoDocuments && values.userInfoDocuments.length) {
      const userInfoDocuments = values.userInfoDocuments.filter(
        (item) => item.url
      );

      if (userInfoDocuments.length < 3) {
        let count = userInfoDocuments.length;
        while (count < 3) {
          userInfoDocumentsArrayErrors[count] = dict[lang]["profile.loadDoc"];
          count++;
        }
      }
    }
    if (!values.agreedDocs) {
      errors.agreedDocs = dict[lang]["profile.permContract"];
    }

    if (userInfoEducationsArrayErrors.length) {
      errors.userInfoEducations = userInfoEducationsArrayErrors;
    }
    if (userInfoWorksArrayErrors.length) {
      errors.userInfoWorks = userInfoWorksArrayErrors;
    }

    if (userInfoDocumentsArrayErrors.length) {
      errors.userInfoDocuments = userInfoDocumentsArrayErrors;
    }
  }
  return errors;
};

SubmitValidationForm = reduxForm({
  form: "submitValidation",
  validate,
})(SubmitValidationForm);

const mapDispatchToProps = (dispatch) => ({
  setCheckIns: bindActionCreators(actions.setCheckIns, dispatch),
  toggleForm: bindActionCreators(actions.toggleForm, dispatch),
  dispatch,
});

const mapStateToProps = (state) => {
  const {
    bodyParams,
    injuriesHidden,
    profileFields,
    selectedTaskDay,
    sportsPast,
    isBabyFeeding,
    userInfo,
    sign,
    lang,
  } = state;

  const valuesData = getFormValues("submitValidation")(state);
  const formSyncErrors = getFormSyncErrors("submitValidation")(state);
  const formAsyncErrors = getFormAsyncErrors("submitValidation")(state);
  const submitErrors = getFormSubmitErrors("submitValidation")(state);
  //const formError = getFormError('submitValidation')(state);
  return {
    bodyParams,
    sign,
    injuriesHidden,
    sportsPast,
    selectedTaskDay,
    profileFields,
    isBabyFeeding,
    userInfo,
    valuesData,
    formSyncErrors,
    formAsyncErrors,
    submitErrors,
    lang,
  };
};

SubmitValidationForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitValidationForm);

export default CSSModules(SubmitValidationForm, styles);
