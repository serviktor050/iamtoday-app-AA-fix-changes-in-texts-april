import PropTypes from 'prop-types';
import React, { Component } from "react";
import {
  Field,
  reduxForm,
  FormSection,
  submit,
  getFormValues,
} from "redux-form";
import { connect } from "react-redux";
import CSSModules from "react-css-modules";
import InputProfile from "../componentKit/InputProfile";
import SelectComponent from "../componentKit/SelectComponent";
import CheckboxProfile from "../componentKit/CheckboxProfile";
import MobileDayPicker from "./MobileDayPicker";
import InputDayPicker from "./InputDayPicker";
import { Link, browserHistory } from "react-router";
import styles from "./contactsValidationForm.css";
import { regionsData, countriesData, countriesDataEn, citiesRuData, REGISTRATION_INSTRUCTION_TUTOR, } from "../../utils/data";
import moment from "moment";
import Modal from "boron-react-modal/FadeModal";
import cookie from "react-cookie";
import { OKSDK } from "./oksdk.js";
import { api, domen, host } from "../../config.js";
import { dict } from "dict";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import classNames from "classnames/bind";
import ProfileTabs from 'modules/Profile/Tabs';
import AddBlock from "../componentKit2/AddBlock";
import * as R from "ramda";

import { specialties } from 'modules/utils';

const cx = classNames.bind(styles);

const contentStyle = {
  borderRadius: "18px",
  padding: "30px",
};

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
const countriesEn = countriesDataEn.map((item) => {
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

const FB = window.FB;
class ContactsValidationForm extends Component {
  state = {
    gender: null,
    region: null,
    country: null,
    city: null,
    agreed: false,
    lang: "ru",
    crop: {
      aspect: 1 / 1,
      height: 200,
    },
    loadedPhoto: null,
    loadedPhotoName: null,
    isLoadedPhoto: false,
    isCropperOn: false,
    croppedImageUrl: null,
    categories: [],
  };

  componentDidMount() {
    const { profileData, lang } = this.props;
    const gender = {
      male: dict[lang]["profile.male"],
      female: dict[lang]["profile.female"],
    };
    this.setState({
      gender: {
        label: gender[profileData.gender],
        value: profileData.gender || "",
      },
      region: { label: profileData.region, value: profileData.region },
      country: { label: profileData.country, value: profileData.country || "" },
      city: { label: profileData.city, value: profileData.city },
      lang: {
        label: dict[lang][`language.option.${profileData.lang || "ru"}`],
        value: profileData.lang || "ru",
      },
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
    });
  }

  loadPhoto(input) {
    const { target } = input;

    if (target.files && target.files[0]) {
      var reader = new FileReader();
      this.setState({ loadedPhotoName: target.files[0].name });
      reader.onload = (e) => {
        this.refs.avatar.src = e.target.result;
        this.setState({
          loadedPhoto: reader.result,
          isCropperOn: true,
        });
      };
      reader.readAsDataURL(target.files[0]);
    }
  }

  async makeClientCrop(crop) {
    if (this.imageRef && crop.width && crop.height) {
      const imageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl: imageUrl });
      console.log("imageUrl:", imageUrl);
    }
  }

  getCroppedImg(image, crop) {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = Math.ceil(crop.width * scaleX);
    canvas.height = Math.ceil(crop.height * scaleY);
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return canvas
      .toDataURL("image/jpeg")
      .replace(/data:image\/\w+;base64,/, "");
  }

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  savePhoto() {
    const { loadedPhotoName, croppedImageUrl } = this.state;
    this.setState({ isCropperOn: false });

    const payload = {
      authToken: cookie.load("token"),
      data: {
        name: loadedPhotoName,
        content: croppedImageUrl,
      },
    };
    console.log("payload: ", payload);

    return fetch(`${api}/data/avatar-file-upload`, {
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
              photo: `${host}/${json.data.url}`,
            },
          };
          return this.updatePhoto(photoPayload);
        }
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

  submit(e) {
    const { onSubmit, valid, valuesData, dispatch } = this.props;
    dispatch(submit("contactsValidation"));
    if (!valid) {
      return this.refs.submitFailModal.show();
    } else {
      onSubmit(valuesData, "origin");
    }
  }

  showInstructionModal = ()=> {
    this.refs.instructionModal.show();
  }

  render() {
    const {
      initialValues,
      profileData,
      valuesData,
      isAdvanceVisible,
      onSubmit,
      handleSubmit,
      valid,
      userInfo,
      lang,
    } = this.props;
    const { loadedPhoto, crop, isCropperOn, isLoadedPhoto } = this.state;
    let { gender, enabledSocialNetworks } = userInfo.data;
    const AgreedLabel = () => (
      <div className={styles.note}>
        {dict[lang]["regs.agreed.1"]}
        <Link to="/offer" target="_blank" className={styles.noteLink}>
          {dict[lang]["regs.agreed.2"]}
        </Link>
      </div>
    );
    let renderSmm = {};

    if (enabledSocialNetworks && enabledSocialNetworks.length) {
      enabledSocialNetworks.forEach((item, idx) => {
        renderSmm[item] = true;
      });
    }

    const i18n = dict[lang];

    return (
      <div>
        <form>
          <div className={styles.stageBoxBigPadding}>
            <ProfileTabs />
            <div className={styles.stageBoxInner}>
              <div className={cx(styles.mlmRegistrationHeader)}>
                <h2 className={cx(styles.title)}>{i18n["profile.title"]}</h2>
              {isAdvanceVisible && <span>
                <span className={cx("mlmRegistrationHeader__step")}>
                  {`${i18n["mlm.mlmRegistration.step1"]}`}
                </span>
                <span className={cx("mlmRegistrationHeader__stepOf")}>
                  &nbsp;{`/ 3`}
                </span>
              </span>}
              </div>
              <div className={styles.info}>
                <div className={cx("info-icon")}></div>
                <div className={cx("info-text")}>
                  <span className={cx("info-text-bold")}>
                    {i18n["mlm.mlmRegistration.info.title"]}
                  </span>
                  <span>{i18n["mlm.mlmRegistration.info"]}</span>
                </div>
                <button type="button" className={cx("info-btn")} onClick={this.showInstructionModal}>
                  {i18n["mlm.mlmRegistration.info.see-instruction"]}
                </button>
              </div>

              <div className={styles.h2}>
                {dict[lang]["profile.infoAboutYou"]}
              </div>

              <div className={styles.grid}>
                <div className={styles.gridCell33}>
                  <div className={styles.input}>
                    <Field
                      cls={styles.inputColor}
                      name="lastName"
                      placeholder={dict[lang]["profile.lastName"]}
                      component={InputProfile}
                    />
                  </div>
                </div>
                <div className={styles.gridCell33}>
                  <div className={styles.input}>
                    <Field
                      cls={styles.inputColor}
                      name="firstName"
                      placeholder={dict[lang]["profile.firstName"]}
                      component={InputProfile}
                    />
                  </div>
                </div>
                <div className={styles.gridCell33}>
                  <div className={styles.input}>
                    <Field
                      cls={styles.inputColor}
                      name="middleName"
                      placeholder={dict[lang]["profile.middleName"]}
                      component={InputProfile}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.grid}>
                <div className={styles.gridCell33}>
                  <div className="select">
                    <Field
                      name="gender"
                      placeholder={dict[lang]["profile.selectGender"]}
                      val={this.state.gender}
                      options={[
                        { label: dict[lang]["profile.male"], value: "male" },
                        { label: dict[lang]["profile.female"], value: "female" },
                      ]}
                      component={SelectComponent}
                    />
                  </div>
                </div>

                <div className={styles.gridCell33}>
                  <div data-tip className={styles.input}>
                    {window.mobileAndTabletcheck() ? (
                      <Field
                        name="birthday"
                        value={profileData.birthday}
                        placeholder={dict[lang]["profile.birthday"]}
                        id="birthday"
                        lang={lang}
                        component={MobileDayPicker}
                      />
                    ) : (
                      <Field
                        name="birthday"
                        value={profileData.birthday}
                        placeholder={dict[lang]["profile.birthday"]}
                        lang={lang}
                        component={InputDayPicker}
                      />
                    )}
                  </div>
                </div>
              </div>

              <hr className={cx("bigHr")} />
              <h3>{i18n["mlm.mlmRegistration.student-location.title"]}</h3>
              <br />

              <div className={styles.grid}>
                <div className={styles.gridCell33}>
                  <div className="select">
                    <Field
                      name="country"
                      placeholder={dict[lang]["profile.selectCountries"]}
                      val={this.state.country}
                      options={lang === "ru" ? countries : countriesEn}
                      onChange={(country) => {
                        this.setState({ country });
                      }}
                      component={SelectComponent}
                    />
                  </div>
                </div>
                <div className={styles.gridCell33}>
                  {this.state.country &&
                  this.state.country.value &&
                  this.state.country.value.trim() == "Россия" ? (
                    <div className="select">
                      <Field
                        name="region"
                        placeholder={dict[lang]["profile.selectRegion"]}
                        val={this.state.region}
                        options={regions}
                        onChange={(region) => this.setState({ region })}
                        component={SelectComponent}
                      />
                    </div>
                  ) : (
                    <div className={styles.input}>
                      <Field
                        cls={styles.inputColor}
                        name="region"
                        placeholder={dict[lang]["profile.selectRegion"]}
                        component={InputProfile}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.gridCell33}>
                  {this.state.country &&
                  this.state.country.value &&
                  this.state.country.value.trim() === "Россия" ? (
                    <div className="select">
                      <Field
                        name="city"
                        placeholder={dict[lang]["profile.selectCity"]}
                        val={this.state.city}
                        options={citiesRu}
                        onChange={(city) => {
                          this.setState({ city });
                        }}
                        component={SelectComponent}
                      />
                    </div>
                  ) : (
                    <div className={styles.input}>
                      <Field
                        cls={styles.inputColor}
                        name="city"
                        placeholder={dict[lang]["profile.selectCity"]}
                        component={InputProfile}
                      />
                    </div>
                  )}
                </div>
                <div className={styles.gridCell33}>
                  <div className="select">
                    <Field
                      name="lang"
                      placeholder={dict[lang]["profile.selectLang"]}
                      val={this.state.lang}
                      options={[
                        { label: dict[lang]["language.option.ru"], value: "ru" },
                        { label: dict[lang]["language.option.en"], value: "en" },
                      ]}
                      component={SelectComponent}
                    />
                  </div>
                </div>
              </div>

              <hr className={cx("bigHr")} />
              <h3>{i18n["profile.phoneEmailInfo"]}</h3>
              <br />

              <div className={styles.grid}>
                <div className={styles.gridCell33}>
                  <div className={styles.input}>
                    <div className={styles.inputFieldWrap}>
                      <Field
                        name="phone"
                        type="tel"
                        placeholder={dict[lang]["profile.yourTel"]}
                        tooltip={
                          <div>
                            <p>{dict[lang]["profile.example"]}</p>
                            <p>+7 xxx xxx xx xx</p>
                          </div>
                        }
                        component={InputProfile}
                        cls={styles.inputColor}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.gridCell33}>
                  <div data-tip data-for="email" className={styles.input}>
                    <Field
                      cls={styles.inputColor}
                      name="email"
                      type="email"
                      disabled={!!profileData.email}
                      placeholder={dict[lang]["profile.yourEmail"]}
                      component={InputProfile}
                    />
                  </div>
                </div>
              </div>
              <br />
              <h3>{i18n["profile.uploadYourPhoto"]}</h3>
              <br />

              <div className={styles.grid}>
                <div className={styles.avatarBlock}>
                  <div className={styles.avatarContent}>
                    <div className={styles.avatarWrap}>
                      <div className={styles.avatarProfile}>
                        <label className={styles.avatarUpload} htmlFor="avatar">
                          <input
                            id="avatar"
                            type="file"
                            ref="avaInput"
                            accept="image/*"
                            onChange={(input) => this.loadPhoto(input)}
                            className={styles.uploadFileInput}
                          />
                        </label>

                        {isCropperOn && (
                          <ReactCrop
                            imageStyle={{ height: "260px" }}
                            src={loadedPhoto}
                            crop={crop}
                            onImageLoaded={this.onImageLoaded}
                            onChange={(newCrop) =>
                              this.setState({ crop: newCrop })
                            }
                            onComplete={(crop) => this.makeClientCrop(crop)}
                          />
                        )}

                        <div className={styles.avatarImgWrap}>
                          {!initialValues.photo ? (
                            <span className={styles.avatarText}>
                              {dict[lang]["profile.loadFile"]}
                            </span>
                          ) : null}

                          <img
                            className={styles.avatarImg}
                            ref="avatar"
                            src={
                              userInfo.data.photo
                                ? userInfo.data.photo
                                : initialValues.photo
                            }
                            alt=""
                          />
                        </div>
                      </div>
                    </div>
                    <div className={styles.avatarInfo}>
                      <div className={styles.avatarDesc}>
                        {dict[lang]["profile.setPhoto"]}
                      </div>
                      <div className={styles.avatarInfoItem}>
                        <div className={styles.avatarInfoText}>
                          {dict[lang]["profile.format"]}
                        </div>
                        <div className={styles.avatarInfoValue}>
                          {" "}
                          jpg, png, webp, gif
                        </div>
                      </div>
                      <div className={styles.avatarInfoItem}>
                        <div className={styles.avatarInfoText}>
                          {dict[lang]["profile.size"]}
                        </div>
                        <div className={styles.avatarInfoValue}>
                          {dict[lang]["profile.noMore"]}
                        </div>
                      </div>

                      <button
                        type="button"
                        className={styles.btnLoad}
                        onClick={(e) => {
                          //this.setState({ loadedPhoto: null })

                          this.setState({ isCropperOn: false });
                          this.refs.avaInput.click();
                        }}
                      >
                        {dict[lang]["profile.loadFile"]}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.checkbox}>
                <Field
                  className=""
                  name="agreed"
                  id="agreed"
                  value={this.state.agreed}
                  // checker={this.state.agreed}
                  component={CheckboxProfile}
                  titleComponent={AgreedLabel}
                  onChange={(agreed) => {
                    this.setState({
                      agreed,
                    });
                  }}
                />
              </div>

              <button
                type="button"
                className={styles.btnSaveData}
                onClick={(e) => {
                  this.savePhoto();
                  this.submit(e, true);
                }}
              >
                {dict[lang]["profile.saveData"]}
              </button>

              <Modal ref="submitFailModal" contentStyle={contentStyle}>
                <h2>{dict[lang]["profile.someFieldsWrong"]}</h2>
                <br />
                <div className={styles.btnPrimaryCenter} onClick={() => this.refs.submitFailModal.hide()}>
                  {dict[lang]["regs.continue"]}
                </div>
              </Modal>

              <Modal 
                ref="instructionModal"
                contentStyle={{ height: "100%" }}
                modalStyle={{ width: "70%", height: "70%"}}>
                    <iframe            
                    src={REGISTRATION_INSTRUCTION_TUTOR}                   
                    height="100%"
                    width="100%"
                    frameBorder="0"
                    allowFullScreen />          
              </Modal>
            </div>
          </div>

          <div className={styles.stageBoxBigPadding}>
            <div className={styles.stageBoxInner}>
              <h2 className={cx(styles.title)}>{i18n["profile.specialty.title"]}</h2>
              <div className={cx('info_blue')}>{i18n['profile.specialty.info']}</div>
              <AddBlock
                text={dict[lang]["profile.specialty.addSpecialty"]}
                name={`customUserFields.workPosition`}
                content={(user, index) => {
                  const classGroup =
                    R.path(['customUserFields', "workPosition", index], profileData) &&
                    profileData.customUserFields.workPosition[index].verificationStatus == 2
                      ? styles.groupDanger
                      : styles.group;
                  const value = valuesData ? valuesData.customUserFields.workPosition[index] : profileData.customUserFields.workPosition.split(', ')[index]
                  return (
                    <div key={index} className={classGroup}>
                      <div className="select">
                        <Field
                          name={`customUserFields.workPosition.${index}`}
                          placeholder={dict[lang]["profile.specialty.placeholder"]}
                          val={valuesData ? value : {label: value, value}}
                          options={specialties.map(item => ({ label: item, value: item }))}
                          component={SelectComponent}
                        />
                      </div>
                    </div>
                  );
                }}
              ></AddBlock>

              <div className={styles.checkbox}>
                <Field
                  className=""
                  name="agreed"
                  id='agreed'
                  value={this.state.agreed}
                  checker={valuesData ? valuesData.agreed : null}
                  component={CheckboxProfile}
                  titleComponent={AgreedLabel}
                  onChange={(agreed) => { this.setState({ agreed }) }}
                />
              </div>
              
              <button
                type="button"
                className={styles.btnSaveData}
                onClick={(e) => {
                  this.savePhoto();
                  this.submit(e, true);
                }}
              >
                {dict[lang]["profile.saveData"]}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const validate = (data, props) => {
  const errors = {};
  const lang = props.lang;

  switch (true) {
    case !data.firstName:
      errors.firstName = dict[lang]["profile.fieldCanNotEmpty"];
      break;
    // case data.fullName.length < 3:
    //   errors.fullName = 'Имя должно быть длиннее 3 символов'
    //   break
    case data.firstName.length > 100:
      errors.firstName = dict[lang]["profile.nameMustLess"];
      break;
    default:
      break;
  }

  console.log(data);

  if (!data.lastName) {
    errors.lastName = dict[lang]["profile.fieldCanNotEmpty"];
  }

  if (!data.lastName.length > 100) {
    errors.lastName = dict[lang]["profile.clastNameMustLess"];
  }

  if (!data.middleName) {
    errors.middleName = dict[lang]["profile.fieldCanNotEmpty"];
  }

  if (!data.middleName.length > 100) {
    errors.middleName = dict[lang]["profile.middleNameMustLess"];
  }

  if (!data.gender) {
    errors.gender = dict[lang]["profile.fieldCanNotEmpty"];
  }

  if (!data.country) {
    errors.country = dict[lang]["profile.fieldCanNotEmpty"];
  }

  if (!data.city) {
    errors.city = dict[lang]["profile.fieldCanNotEmpty"];
  }

  // if (!data.region) {
  //   errors.region = 'Регион должнен быть заполнен'
  // }

  if (data.customUserFields && data.customUserFields.workPosition && !data.customUserFields.workPosition.length) {
    errors.customUserFields.workPosition = dict[lang]["profile.fieldCanNotEmpty"];
  }

  switch (true) {
    case !data.phone:
      errors.phone = dict[lang]["profile.fieldCanNotEmpty"];
      break;
    case data.phone.length < 6:
      errors.phone = dict[lang]["profile.telMustMore"];
      break;
    case data.phone.length > 30:
      errors.phone = dict[lang]["profile.telMustLess"];
      break;
    case !/^[+\s0-9]{6,20}$/.test(data.phone):
      errors.phone = dict[lang]["profile.telMustContain"];
      break;
    default:
      break;
  }

  switch (true) {
    case !data.email:
      errors.email = "Email должен быть заполнен";
      break;
    case !/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i.test(
      data.email
    ):
      errors.email = "Email заполнен неправильно, проверьте его еще раз";
      break;
    default:
      break;
  }

  // if(moment().diff(moment(data.birthday), 'years') < 18){
  //   errors.birthday = 'До 18 лет участие запрещено'
  // }

  if (!data.birthday) {
    errors.birthday = dict[lang]["profile.fieldCanNotEmpty"];
  }

  if (!data.agreed && props.profileData.isFirstEdit) {
    errors.agreed = dict[lang]["profile.needPermission"];
  }
  return errors;
};

ContactsValidationForm = reduxForm({
  form: "contactsValidation",
  validate,
})(ContactsValidationForm);

const mapDispatchToProps = (dispatch) => ({
  // setCheckIns: bindActionCreators(actions.setCheckIns, dispatch),
  // toggleForm: bindActionCreators(actions.toggleForm, dispatch),
  dispatch,
});

const mapStateToProps = (state) => {
  const { profileFields, selectedTaskDay, userInfo, sign, lang } = state;
  const valuesData = getFormValues("contactsValidation")(state);

  return {
    lang,
    sign,
    selectedTaskDay,
    profileFields,
    valuesData,
    userInfo,
  };
};

ContactsValidationForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(ContactsValidationForm);

export default CSSModules(ContactsValidationForm, styles);
