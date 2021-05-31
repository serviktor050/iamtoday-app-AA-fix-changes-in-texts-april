import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./activeProfile.css";
import {
  Field,
  reduxForm,
  FormSection,
  touch,
  reset,
  isDirty,
  submit,
  getFormValues,
  formValues,
} from "redux-form";
import { dict } from "dict";
import CheckboxProfile from "./CheckboxProfile";
import MobileDayPicker from "../../../../components/profile/MobileDayPicker";
import InputDayPicker from "../../../../components/profile/InputDayPicker";
import Education from "./Education";
import Work from "./Work";
import classNames from "classnames/bind";
import { api } from "../../../../config.js";
import cookie from "react-cookie";
import { connect } from "react-redux";
import FooterNewProfile from "./FooterNewProfile";
import FooterADProfile from "./FooterADProfile";

const cx = classNames.bind(styles);

const name = "activeProfile";

class ActiveProfile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      lang: "ru",
      user: this.props.user,
      isChecked: {},
    };

    this.doSubmit = this.doSubmit.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
  }

  doSubmit(e) {
    const { dispatch, toggleVerificationStatus } = this.props;
    toggleVerificationStatus(e.currentTarget.value)
    dispatch(submit(name));
  }

  handleCheck(e) {
    const name = e.currentTarget.name.split(".").slice(1).join(".");
    this.setState({
      isChecked: {
        ...this.state.isChecked,
        [name]: !this.state.isChecked[name],
      },
    });
  }

  componentDidMount() {
    const { user } = this.props;
    const data = user.userInfoDocuments;
    let Checked = {};
    data
      ? data.map((item, index) => {
          return (Checked[`${index}.verificationStatus`] = Boolean(
            item.verificationStatus === 2
          ));
        })
      : null;
    this.setState({ isChecked: Checked });
  }

  componentDidUpdate(prevProps) {
    if (this.props.user !== prevProps.user) {
      const { user } = this.props;
      const data = user.userInfoDocuments;
      let Checked = {};
      data
        ? data.map((item, index) => {
            return (Checked[`${index}.verificationStatus`] = Boolean(
              item.verificationStatus === 2
            ));
          })
        : null;
      this.setState({ isChecked: Checked });
    }
  }

  render() {
    const { user, lang, status, onSubmit } = this.props;
    const i18n = dict[lang];
    const ErrorLabel = () => (
      <div className={styles.note}>{dict[lang]["admin.haserror"]}</div>
    );
    return (
      <div className={styles.profileBody}>
        <div className={styles.mainInfo}>
          <img
            src={
              user.photo
                ? user.photo
                : "../../assets/img/png/ava-big-main.png"
            }
            alt="Фотография пользователя"
            className={styles.userAvatar}
          />
          <table className={styles.userInfoList}>
            <tbody>
              <tr className={styles.userInfoList_item}>
                <td>Уровень</td>
                <td>{user.paidState}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>ID</td>
                <td>{user.id}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Имя</td>
                <td>{user.firstName}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Фамилия</td>
                <td>{user.lastName}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Отчество</td>
                <td>{user.middleName}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Пол</td>
                <td>{user.gender === "male" ? "Мужской" : "Женский"}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Страна</td>
                <td>{user.country}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Регион</td>
                <td>{user.region}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Город</td>
                <td>{user.city}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Таймзона</td>
                <td>{user.timezone ? user.timezone : 0}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Телефон</td>
                <td>
                  <a href={`tel:${user.phone}`}>{user.phone}</a>
                </td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Почта</td>
                <td>
                  <a href={`mailto:${user.email}`}>{user.email}</a>
                </td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Дата рождения</td>
                <td>
                  {user.birthday.split("T")[0].split("-").reverse().join(".")}
                </td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Опыт работы в AntiAge</td>
                <td>{user.customUserFields.workSeniority}</td>
              </tr>
              <tr className={styles.userInfoList_item}>
                <td>Дата активности</td>
                <td>{`${user.updateTs
                  .split("T")[0]
                  .split("-")
                  .reverse()
                  .join(".")}, ${user.updateTs.split("T")[1].slice(0, 5)}`}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <form onSubmit={onSubmit}>
          <div className={styles.education}>
            <div className={cx("educationAnWorkInfo")}>
              <h3>{i18n["admin.profiles.education"]}</h3>
              <br />
              <div>
                <Education
                  lang={lang}
                  data={user.userInfoEducations}
                  status={status}
                />
              </div>
            </div>
          </div>

          <div className={styles.education}>
            <div className={cx("educationAnWorkInfo")}>
              <h3>{i18n["admin.profiles.work"]}</h3>
              <br />
              <div>
                <Work lang={lang} data={user.userInfoWorks} status={status} />
              </div>
            </div>
          </div>

          <div className={styles.education}>
            <div className={cx("educationAnWorkInfo")}>
              <h3>{i18n["admin.profiles.documents"]}</h3>
              <br />
              <FormSection name={`userInfoDocuments`}>
                {user.userInfoDocuments ? (
                  user.userInfoDocuments.map((item, index) => {
                    return (
                      <div className={styles.document_item}>
                        <div className={cx(styles.document_wrapper)}>
                          {/* values.userInfoDocuments[index] ?  */}
                          <div className={styles.document_icon}></div>
                          <a
                            href={`${api}/data/photo-file-get?fileId=${
                              item.fileId
                            }&authToken=${cookie.load("token")}`}
                            target="_blank"
                            className={styles.document_name}
                          >
                            {item.documentName}
                          </a>
                        </div>
                        <div className={styles.checkboxWrapper}>
                          <Field
                            className={styles.checkbox}
                            name={`${index}.verificationStatus`}
                            value={status}
                            checker={
                              this.state.isChecked[
                                `${index}.verificationStatus`
                              ]
                            }
                            normalize={v => v ? '1' : '0'}
                            onChange={this.handleCheck}
                            component={CheckboxProfile}
                            titleComponent={ErrorLabel}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <span>Нет загруженных документов</span>
                )}
              </FormSection>
            </div>
          </div>

          {status === 1 && (
            <FooterNewProfile message={user.message} doSubmit={this.doSubmit} status={status} />
          )}
          {status !== 1 && <FooterADProfile doSubmit={this.doSubmit} status={status} />}
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { form } = state;

  return {
    form,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
  };
};

ActiveProfile = connect(mapStateToProps, mapDispatchToProps)(ActiveProfile);

ActiveProfile = reduxForm({
  form: name,
})(ActiveProfile);

export default CSSModules(ActiveProfile, styles);
