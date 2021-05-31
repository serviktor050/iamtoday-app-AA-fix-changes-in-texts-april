import React, { Component } from "react";
import { connect } from "react-redux";
import classNames from "classnames/bind";
import { Link } from "react-router";
import { dict } from "dict";
import {
  citiesRuData,
  countriesData,
  countriesDataEn,
  regionsData, 
  REGISTRATION_INSTRUCTION_STUDENT 
} from "utils/data";
import { Field, reduxForm, submit } from "redux-form";
import InputProfile from "components/componentKit/InputProfile";
import { Breadcrumb } from "components/common/Breadcrumb";
import MobileDayPicker from "components/profile/MobileDayPicker";
import InputDayPicker from "components/profile/InputDayPicker";
import SelectComponent from "components/componentKit/SelectComponent";
import CheckboxProfile from "modules/Admin/components/profiles/CheckboxProfile";
import AddBlock from "components/componentKit2/AddBlock";
import FieldFileInput from "components/componentKit2/FieldFileInput";
import Modal from "boron-react-modal/FadeModal";
import { validateContacts } from "./validation";
import * as selectors from "../selectors";
import * as ducks from "../ducks";
import CSSModules from "react-css-modules";
import styles from "./styles.css";
import ReactCrop from "react-image-crop";
import cookie from "react-cookie";
import { api, domen, host } from "../../../config.js";


const cx = classNames.bind(styles);

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

const regions = regionsData.map((item) => {
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

class MlmRegistrationForm extends Component {
  state = {
    gender: null,
    region: null,
    country: null,
    city: null,
  };

  constructor(props, context, state) {
    super(props, context);
    this.state = {
      ...state,
      expanded: false,
      crop: {
        aspect: 1 / 1,
        height: 200,
      },
      loadedPhoto: null,
      loadedPhotoName: null,
      isLoadedPhoto: false,
      isCropperOn: false,
      croppedImageUrl: null,
      uploadedPhotoUrl: null,
      agreedCheck: false,
    };
    this.doSubmit = this.doSubmit.bind(this);
  }

  componentDidMount() {}

  doSubmit() {
    const { valid, dispatch } = this.props;
    dispatch(submit("mlmRegistration"));
    if (!valid) {
      this.refs.validationFailModal.show();
    }
  }

  isSelectedCountryRussia = () =>
    this.state.country &&
    this.state.country.value &&
    this.state.country.value.trim() === "Россия";

  loadPhoto = (input) => {
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
  };

  makeClientCrop = async (crop) => {
    if (this.imageRef && crop.width && crop.height) {
      const imageUrl = await this.getCroppedImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl: imageUrl });
    }
  };

  getCroppedImg = (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return canvas
      .toDataURL("image/jpeg")
      .replace(/data:image\/\w+;base64,/, "");
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  savePhoto = () => {
    const { loadedPhotoName, croppedImageUrl } = this.state;
    const { dispatch } = this.props;
    this.setState({ isCropperOn: false });

    const payload = {
      authToken: cookie.load("token"),
      data: {
        name: loadedPhotoName,
        content: croppedImageUrl,
      },
    };
    console.log("payload: ", payload);

    fetch(`${api}/data/avatar-file-upload`, {
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
          // const photoPayload = {
          //   authToken: cookie.load("token"),
          //   data: {
          //     //photo: `${host}/files/${json.data.uid}.${json.data.extension}`.replace(/api\//, '')
          //     photo: `${host}${json.data.url}`,
          //   },
          // };
          // return this.updatePhoto(photoPayload);
          // console.log(`${host}${json.data.url}`)
          this.setState({ uploadedPhotoUrl: `${host}/${json.data.url}` });
          dispatch(ducks.setUserPhoto(`${host}/${json.data.url}`));
        }
      });
  };

  updatePhoto = (photoPayload) => {
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
  };
  showInstructionModal = ()=> {
    this.refs.instructionModal.show();
  }

  renderHeader() {
    const { lang } = this.props;
    const i18n = dict[lang];
    const items = [
      i18n["breadcrumb.main"],
      i18n["mlm.breadcrumb.mlm"],
      i18n["mlm.breadcrumb.mlmRegistration"],
    ];
    const links = ["/", "/mlm"];
    return (
      <div className={cx(styles.mlmRegistrationHeader)}>
        <h2 className={cx(styles.title)}>
          {i18n["mlm.mlmRegistration.title"]}
        </h2>
        {/* <Breadcrumb items={items} links={links} /> */}
        {/* <hr /> */}
        {this.state.expanded && <span>
          <span className={cx("mlmRegistrationHeader__step")}>
            {`${i18n["mlm.mlmRegistration.step1"]}`}
          </span>
          <span className={cx("mlmRegistrationHeader__stepOf")}>
            &nbsp;{`/ 3`}
          </span>
        </span>}
      </div>
    );
  }

  render() {
    const { lang, handleSubmit } = this.props;
    const i18n = dict[lang];
    return (
      <form onSubmit={handleSubmit}>
        <div className={cx("mlmRegistration")}>
          {this.renderHeader()}
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

          {this.renderShortContacts()}
          {this.state.expanded && this.renderContacts()}
        </div>
        {this.state.expanded && (
          <div>
            <div className={cx("mlmRegistration")}>
              {this.renderEducationAnWork()}
            </div>
            <div className={cx("mlmRegistration")}>
              {this.renderDocuments()}
              <div className={cx("footer-actions")}>
                {this.renderSubmitBtn(
                  i18n["mlm.mlmRegistration.action.register"]
                )}
                <div className={cx("info-blue")}>
                  <span>
                    <div className={cx("expand-regForm-i")}>i</div>
                    {i18n["mlm.mlmRegistration.documents.info"]}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <Modal
          ref="validationFailModal"
          contentStyle={{ borderRadius: "18px", padding: "30px" }}
        >
          <h2>{dict[lang]["profile.someFieldsWrong"]}</h2>
          <br />
          <div
            className={styles.btnPrimaryCenter}
            onClick={() => this.refs.validationFailModal.hide()}
          >
            {dict[lang]["regs.continue"]}
          </div>
        </Modal>
        <Modal
          ref="instructionModal"
          contentStyle={{ height: "100%"}}
          modalStyle={{ width: "70%", height: "70%"}}>
              <iframe            
                src={REGISTRATION_INSTRUCTION_STUDENT}                   
                height="100%"
                width="100%"            
                frameBorder="0"
                allowFullScreen />
        </Modal>
      </form>
    );
  }

  renderSubmitBtn(title) {
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <button
        type={"button"}
        className={styles.btnAddVerify}
        onClick={this.doSubmit}
      >
        {title}
      </button>
    );
  }

  renderShortContacts = () => {
    const { lang } = this.props;
    const i18n = dict[lang];
    const AgreedLabel = () => (
      <div className={styles.note}>
        {dict[lang]["regs.partner.agreed.1"]}
        <Link to="/offer" target="_blank" className={styles.noteLink}>
          {dict[lang]["regs.agreed.2"]}
        </Link>
      </div>
    );
    return (
      <div className={cx("contactInfo")}>
        <br />
        <h3>{i18n["mlm.mlmRegistration.student-contacts.title"]}</h3>
        <br />
        <div className={styles.grid}>
          <div className={styles.gridCell33}>
            <div className={styles.input}>
              <Field
                cls={styles.inputColor}
                required
                name="lastName"
                placeholder={dict[lang]["partnerInfo.lastName"]}
                component={InputProfile}
              />
            </div>
          </div>
          <div className={styles.gridCell33}>
            <div className={styles.input}>
              <Field
                required
                cls={styles.inputColor}
                name="firstName"
                placeholder={dict[lang]["partnerInfo.firstName"]}
                component={InputProfile}
              />
            </div>
          </div>
          <div className={styles.gridCell33}>
            <div className={styles.input}>
              <Field
                cls={styles.inputColor}
                required
                name="middleName"
                placeholder={dict[lang]["partnerInfo.middleName"]}
                component={InputProfile}
              />
            </div>
          </div>
          <div className={styles.gridCell33}>
            <div className={styles.input}>
              <Field
                required
                cls={styles.inputColor}
                name="email"
                placeholder={dict[lang]["profile.partnerEmail"]}
                component={InputProfile}
              />
            </div>
          </div>
        </div>
        <div className={styles.checkbox}>
          <Field
            className="blue"
            name="agreed"
            value={this.state.agreed}
            component={CheckboxProfile}
            checker={this.state.agreedCheck}
            titleComponent={AgreedLabel}
            onChange={(agreed) => {
              this.setState({
                agreed,
                agreedCheck: !this.state.agreedCheck,
              });
            }}
          />
        </div>
        <div className={cx("contactInfo__action-wrapper")}>
          {this.renderSubmitBtn(
            i18n["mlm.mlmRegistration.action.register-student"]
          )}
        </div>
        <div
          className={cx("expand-regForm")}
          style={{ marginBottom: this.state.expanded ? "30px" : "0" }}
        >
          <div className={cx("expand-regForm-text")}>
            <div className={cx("expand-regForm-i")}>i</div>
            <span>{i18n["mlm.mlmRegistration.info.expand"]}</span>
          </div>
          <div
            className={cx(
              "expand-regForm-button",
              this.state.expanded ? "expand-regForm-button-expanded" : null
            )}
          >
            <button
              type={"button"}
              className={styles.btnAddVerify}
              onClick={() => {
                this.setState({ expanded: !this.state.expanded });
              }}
            >
             {this.state.expanded ? i18n["mlm.mlmRegistration.minimize"] : i18n["mlm.mlmRegistration.expand"]}
            </button>
          </div>
        </div>
      </div>
    );
  };

  renderContacts = () => {
    const { userInfo, lang } = this.props;
    const initialValues = userInfo.data;
    const { loadedPhoto, crop, isCropperOn, isLoadedPhoto } = this.state;
    const i18n = dict[lang];
    const AgreedLabel = () => (
      <div className={styles.note}>
        {dict[lang]["regs.partner.agreed.1"]}
        <Link to="/offer" target="_blank" className={styles.noteLink}>
          {dict[lang]["regs.agreed.2"]}
        </Link>
      </div>
    );
    return (
      <div className={cx("contactInfo")}>
        <div className={styles.grid}>
          <div className={styles.gridCell33}>
            <div className="select">
              <Field
                name="gender"
                placeholder={dict[lang]["partnerInfo.gender"]}
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
                  placeholder={dict[lang]["profile.birthday"]}
                  id="partnerBirthday"
                  lang={lang}
                  component={MobileDayPicker}
                />
              ) : (
                <Field
                  name="birthday"
                  placeholder={dict[lang]["profile.birthday"]}
                  lang={lang}
                  component={InputDayPicker}
                />
              )}
            </div>
          </div>
        </div>
        <hr />
        <h3>{i18n["mlm.mlmRegistration.student-location.title"]}</h3>
        <br />
        <div className={styles.grid}>
          <div className={styles.gridCell33}>
            <div className="select">
              <Field
                name="country"
                val={this.state.country}
                placeholder={dict[lang]["partnerInfo.country"]}
                options={lang === "ru" ? countries : countriesEn}
                onChange={(country) => {
                  this.setState({ country });
                }}
                component={SelectComponent}
              />
            </div>
          </div>
          <div className={styles.gridCell33}>
            {this.isSelectedCountryRussia() ? (
              <div className="select">
                <Field
                  name="region"
                  placeholder={dict[lang]["partnerInfo.region"]}
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
                  placeholder={dict[lang]["partnerInfo.region"]}
                  component={InputProfile}
                />
              </div>
            )}
          </div>
          <div className={styles.gridCell33}>
            {this.isSelectedCountryRussia() ? (
              <div className="select">
                <Field
                  name="city"
                  placeholder={dict[lang]["partnerInfo.city"]}
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
                  placeholder={dict[lang]["partnerInfo.city"]}
                  component={InputProfile}
                />
              </div>
            )}
          </div>
        </div>
        <hr />
        <h3>{i18n["mlm.mlmRegistration.student-phone.title"]}</h3>
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
        </div>
        <br />
        <h3>{i18n["mlm.mlmRegistration.student-photo.title"]}</h3>
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
                      onChange={(newCrop) => this.setState({ crop: newCrop })}
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
                        loadedPhoto
                          ? loadedPhoto
                          : "../../../../assets/img/png/ava-big-main.png"
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
            className="blue"
            name="agreed"
            value={this.state.agreed}
            component={CheckboxProfile}
            checker={this.state.agreedCheck}
            titleComponent={AgreedLabel}
            onChange={(agreed) => {
              this.setState({
                agreed,
                agreedCheck: !this.state.agreedCheck,
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
      </div>
    );
  };

  renderEducationAnWork() {
    const { lang } = this.props;
    const i18n = dict[lang];
    return (
      <div className={cx("educationAnWorkInfo")}>
        <div className={cx(styles.mlmRegistrationHeader)}>
          <h2 className={cx(styles.title)}>
            {i18n["mlm.mlmRegistration.doctor-verification"]}
          </h2>
          <span className={cx("mlmRegistrationHeader__step")}>
            {`${i18n["mlm.mlmRegistration.step2"]}`}
          </span>
          <span className={cx("mlmRegistrationHeader__stepOf")}>
            &nbsp;{`/ 3`}
          </span>
        </div>

        <br />
        <h3>{i18n["mlm.mlmRegistration.education.title"]}</h3>
        <br />
        <AddBlock
          text={dict[lang]["profile.additionalEdu"]}
          name="partnerInfoEducations"
          content={(user, index) => {
            return (
              <div key={index} className={styles.group}>
                <div className={styles.input}>
                  <Field
                    cls={styles.inputColor}
                    name={`${user}.university`}
                    placeholder={dict[lang]["admin.profiles.university"]}
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
                        val={"no"}
                        placeholder={dict[lang]["profile.yearEnd"]}
                        options={endYearArr}
                        component={SelectComponent}
                      />
                      {/*<svg className={styles.svgIconAccordion}>*/}
                      {/*<use xlinkHref="#ico-arrow-accordion"/>*/}
                      {/*</svg>*/}
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
          name="partnerInfoWorks"
          content={(user, index) => {
            return (
              <div key={index} className={styles.group}>
                <div className={styles.input}>
                  <Field
                    cls={styles.inputColor}
                    name={`${user}.firmName`}
                    placeholder={dict[lang]["profile.workCurrent"]}
                    component={InputProfile}
                  />
                </div>

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
      </div>
    );
  }

  renderDocuments() {
    const { lang } = this.props;
    const i18n = dict[lang];
    const ContractLabel = () => (
      <div className={styles.note}>
        {dict[lang]["profile.partner.agreedContract.1"]}
        <Link
          to="/offer?contract=true"
          target="_blank"
          className={styles.noteLink}
        >
          {dict[lang]["profile.agreedContract.2"]}
        </Link>
      </div>
    );
    return (
      <div className={cx("documentsInfo")}>
        <div className={cx(styles.mlmRegistrationHeader)}>
          <h2 className={cx(styles.title)}>
            {i18n["mlm.mlmRegistration.documents.title"]}
          </h2>
          <span className={cx("mlmRegistrationHeader__step")}>
            {`${i18n["mlm.mlmRegistration.step3"]}`}
          </span>
          <span className={cx("mlmRegistrationHeader__stepOf")}>
            &nbsp;{`/ 3`}
          </span>
        </div>
        <div className={cx("info-blue")}>
          <span>
            <div className={cx("expand-regForm-i")}>i</div>
            {i18n["mlm.mlmRegistration.documents.info"]}
          </span>
        </div>
        <br />
        <br />
        <AddBlock
          text={dict[lang]["profile.addDoc"]}
          name="partnerInfoDocuments"
          content={(user, index) => {
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
              <div key={index} className={styles.group}>
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
            className="blue"
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
      </div>
    );
  }
}

const validate = (data, props) => {
  const errors = {};
  const lang = props.lang;

  validateContacts(data, lang, errors);
  if (!data.agreedDocs) {
    errors.agreedDocs = dict[lang]["profile.permContract"];
  }
  return errors;
};

MlmRegistrationForm = reduxForm({
  form: "mlmRegistration",
  validate: validate,
})(MlmRegistrationForm);

const mapStateToProps = (state) => {
  const { profileFields, selectedTaskDay, userInfo, sign, lang } = state;

  return {
    sign,
    selectedTaskDay,
    profileFields,
    userInfo: selectors.userInfo(state),
    registration: selectors.selectMlmRegistration(state),
    lang: state.lang,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

MlmRegistrationForm = connect(
  mapStateToProps,
  mapDispatchToProps
)(MlmRegistrationForm);

export default CSSModules(MlmRegistrationForm, styles);
