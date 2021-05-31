import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./footerNewProfile.css";
import InputProfile from "../../../../components/componentKit/InputProfile";
import { Field } from "redux-form";
import { dict } from "dict";

class FooterNewProfile extends Component {
  render() {
    const { lang, message, doSubmit } = this.props;
    const i18n = dict[lang];
    return (
      <div className={styles.footer}>
        <Field
          cls={styles.inputColor}
          name={`verificationMessage`}
          placeholder={message ? message : "Сообщение техподдержки"}
          component={InputProfile}
        />
        <div className={styles.actions}>
        <div className={styles.btn}>
          <button
            type={"button"}
            className={styles.btnRed}
            value={2}
            onClick={doSubmit}
          >
            <span className={styles.btnText}>{'Отклонить'}</span>
          </button>
        </div>
        <div className={styles.btn}>
          <button
            type={"button"}
            className={styles.btnBlue}
            onClick={doSubmit}
            value={4}
          >
            <span className={styles.btnText}>{'Принять'}</span>
          </button>
        </div>
        </div>
      </div>
    );
  }
}

export default CSSModules(FooterNewProfile, styles);
