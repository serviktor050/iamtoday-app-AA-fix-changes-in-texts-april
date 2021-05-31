import React, { Component } from "react";
import CSSModules from "react-css-modules";
import styles from "./footerADProfile.css";
import InputProfile from "../../../../components/componentKit/InputProfile";
import { Field } from "redux-form";
import { dict } from "dict";

class FooterNewProfile extends Component {
  render() {
    const { lang, doSubmit, message, status } = this.props;
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
            {status !== 0 ? <button
              type={"button"}
              className={styles.btnRed}
              onClick={doSubmit}
              value={0}
            >
              <span className={styles.btnText}>{"Заблокировать"}</span>
            </button> : <button
              type={"button"}
              className={styles.btnGreen}
              onClick={doSubmit}
              value={2}
            >
              <span className={styles.btnText}>{"Разблокировать"}</span>
            </button>}
          </div>
          <div className={styles.btn}>
            <button
              type={"button"}
              className={styles.btnBlue}
              onClick={doSubmit}
              value={status}
            >
              <span className={styles.btnText}>{"Сохранить изменения"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CSSModules(FooterNewProfile, styles);
