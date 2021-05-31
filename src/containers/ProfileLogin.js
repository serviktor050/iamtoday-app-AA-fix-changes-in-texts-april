import PropTypes from "prop-types";
import React, { Component } from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actions from "../actions";
import LoginValidationFormWrapper from "../components/profile/LoginValidationFormWrapper";
import { browserHistory } from "react-router";
import cookie from "react-cookie";
import { api, domen } from "../config.js";
import Modal from "boron-react-modal/FadeModal";
import CSSModules from "react-css-modules";
import styles from "./ProfileLogin.css";
import { Helmet } from "react-helmet";

let contentStyle = {
  borderRadius: "18px",
  padding: "30px",
};
/**
 *  Компонент ProfileLogin.
 *  Используется для отображения страницы 'Логин' (/)
 *
 */
class ProfileLogin extends Component {
  /**
   * @memberof ProfileLogin
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {func} propTypes.setToken Установка токена
   *
   * */
  static propTypes = {
    /**
     * Функция для выбора дня
     * @memberof ProfileLogin
     * @param {string} token - Токен
     */
    setToken: PropTypes.func.isRequired,
  };
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.margin = "100px";
      contentStyle.width = "300px";
    }
  }

  render() {
    const { setToken, sign, setAuth, setSimpleRegs, setUserProfile, lang } =
      this.props;
    return (
      <React.Fragment>
        <Helmet>
          <link rel="stylesheet" href="/assets/css/unipro.css" />
        </Helmet>
        <LoginValidationFormWrapper
          lang={lang}
          setToken={setToken}
          setAuth={setAuth}
          setSimpleRegs={setSimpleRegs}
          setUserProfile={setUserProfile}
        />
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  profile: state.profile,
  sign: state.sign,
  lang: state.lang,
});

const mapDispatchToProps = (dispatch) => ({
  showError: bindActionCreators(actions.createProfile, dispatch),
  setToken: bindActionCreators(actions.setToken, dispatch),
  setAuth: bindActionCreators(actions.setAuth, dispatch),
  setSimpleRegs: bindActionCreators(actions.setSimpleRegs, dispatch),
  setUserProfile: bindActionCreators(actions.setUserProfile, dispatch),
});

ProfileLogin = connect(mapStateToProps, mapDispatchToProps)(ProfileLogin);

export default CSSModules(ProfileLogin, styles);
