import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./education.css";
import { dict } from "dict";
import { connect } from "react-redux";
import classNames from "classnames/bind";
import { Link } from "react-router";
import {
  citiesRuData,
  countriesData,
  countriesDataEn,
  regionsData,
} from "utils/data";
import { Field, FormSection, FieldArray, reduxForm, submit } from "redux-form";
import InputProfile from "../../../../components/componentKit/InputProfile";
import { Breadcrumb } from "../../../../components/common/Breadcrumb";
import MobileDayPicker from "../../../../components/profile/MobileDayPicker";
import InputDayPicker from "../../../../components/profile/InputDayPicker";
import SelectComponent from "../../../../components/componentKit/SelectComponent";
import CheckboxProfile from "./CheckboxProfile";
import AddBlock from "../../../../components/componentKit2/AddBlock";
import FieldFileInput from "../../../../components/componentKit2/FieldFileInput";
import Modal from "boron-react-modal/FadeModal";
import { validateContacts } from "../../../Mlm/MlmRegistration/validation";
import * as selectors from "../../selectors";

const cx = classNames.bind(styles);

const getEndYear = () => {
  let arr = [];
  let i = 1950;
  while (i <= 2020) {
    arr.push({
      value: i,
      label: i,
    });
    i++;
  }
  return arr;
};

const endYearArr = getEndYear();

class Education extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isChecked: {},
    };

    this.handleCheck = this.handleCheck.bind(this);
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
    const { data, status } = this.props;
    let Checked = {};
    data
      ? data.map((item, index) => {
          Checked[`${index}.verificationStatus`] = Boolean(
            item.verificationStatus === 2
          );
        })
      : null;
    this.setState({ isChecked: Checked });
  }

  componentDidUpdate(prevProps) {
    if (this.props.data !== prevProps.data) {
      const { data, status } = this.props;
      let Checked = {};
      data
        ? data.map((item, index) => {
            Checked[`${index}.verificationStatus`] = Boolean(
              item.verificationStatus === 2
            );
          })
        : null;
      this.setState({ isChecked: Checked });
    }
  }

  render() {
    const { lang, data, status } = this.props;
    const Label = () => (
      <div className={styles.note}>{dict[lang]["admin.haserror"]}</div>
    );
    return (
      <div>
        {data ? (
          data.map((item, index) => {
            return (
              <FormSection name={`userInfoEducations`}>
                <div key={index} className={styles.group}>
                  <div className={styles.input}>
                    <Field
                      cls={styles.inputColor}
                      name={`${index}.university`}
                      val={item.university}
                      placeholder={dict[lang]["admin.profiles.university"]}
                      component={InputProfile}
                    />
                  </div>

                  <div className={styles.gridCell12}>
                    <div className={styles.pr15}>
                      <div className={styles.input}>
                        <Field
                          cls={styles.inputColor}
                          name={`${index}.specialty`}
                          val={item.specialty}
                          placeholder={dict[lang]["admin.profiles.specialty"]}
                          component={InputProfile}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.gridCell12}>
                    <div className={styles.pl15}>
                      <div className="select">
                        <Field
                          name={`${index}.endYear`}
                          val={item.endYear ? item.endYear : 'no'}
                          placeholder={dict[lang]["admin.profiles.yearEnd"]}
                          options={endYearArr}
                          component={SelectComponent}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.inputPlusCheckbox}>
                    <div className={styles.input70}>
                      <Field
                        cls={styles.inputColor}
                        name={`${index}.diplomaNumber`}
                        val={item.diplomaNumber}
                        placeholder={dict[lang]["admin.profiles.diplomNumber"]}
                        component={InputProfile}
                      />
                    </div>

                    <div className={styles.checkboxWrapper}>
                      <Field
                        className={styles.checkbox}
                        name={`${index}.verificationStatus`}
                        component={CheckboxProfile}
                        value={status}
                        checker={
                          this.state.isChecked[`${index}.verificationStatus`]
                        }
                        normalize={v => v ? '1' : '0'}
                        onChange={this.handleCheck}
                        titleComponent={Label}
                      />
                    </div>
                  </div>
                </div>
              </FormSection>
            );
          })
        ) : (
          <FormSection name={`userInfoEducations`}>
            <div className={styles.group}>
              <div className={styles.input}>
                <Field
                  cls={styles.inputColor}
                  name={`university`}
                  placeholder={dict[lang]["admin.profiles.university"]}
                  component={InputProfile}
                />
              </div>

              <div className={styles.gridCell12}>
                <div className={styles.pr15}>
                  <div className={styles.input}>
                    <Field
                      cls={styles.inputColor}
                      name={`specialty`}
                      placeholder={dict[lang]["admin.profiles.specialty"]}
                      component={InputProfile}
                    />
                  </div>
                </div>
              </div>
              <div className={styles.gridCell12}>
                <div className={styles.pl15}>
                  <div className="select">
                    <Field
                      name={`endYear`}
                      placeholder={dict[lang]["admin.profiles.yearEnd"]}
                      options={endYearArr}
                      val={null}
                      component={SelectComponent}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.inputPlusCheckbox}>
                <div className={styles.input70}>
                  <Field
                    cls={styles.inputColor}
                    name={`diplomaNumber`}
                    placeholder={dict[lang]["admin.profiles.diplomNumber"]}
                    component={InputProfile}
                  />
                </div>

                <div className={styles.checkboxWrapper}>
                  <Field
                    className={styles.checkbox}
                    name={`verificationStatus`}
                    value={status}
                    component={CheckboxProfile}
                    titleComponent={Label}
                  />
                </div>
              </div>
            </div>
          </FormSection>
        )}
      </div>
    );
  }
}

export default CSSModules(Education, styles);
