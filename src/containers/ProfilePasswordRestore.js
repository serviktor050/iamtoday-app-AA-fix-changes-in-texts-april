import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import * as actions from '../actions'
import RestoreValidationForm from '../components/profile/RestoreValidationForm'
import { SubmissionError } from 'redux-form'
import { api, domen } from '../config.js'
import Modal from 'boron-react-modal/FadeModal'
import CSSModules from 'react-css-modules'
import styles from './profilePasswordForget.css'
import { Helmet } from "react-helmet";
import { title, fav16, fav32 } from 'utils/helmet';
import { dict } from 'dict';
import cookie from 'react-cookie';

const isAlfa = domen.isAlfa;
let contentStyle = {
  borderRadius: '18px',
  padding: '30px',
  textAlign: 'center'
}

const modalStyle = {
  maxWidth: "300px"
}
/**
 *  Контейнер ProfilePasswordRestore.
 *  Используется для отображения страницы 'Восстановление пароля' (/restore/create)
 *
 */
class ProfilePasswordRestore extends Component {
  /**
   * @memberof ProfilePasswordRestore
   * @prop {object} propTypes - the props that are passed to this component
   * @prop {object} propTypes.location Объект роутера
   *
   * */
  state = { errorText: '' }

  static propTypes = {
    location: PropTypes.object.isRequired,
  }
  componentWillMount() {
    if (window.mobilecheck()) {
      contentStyle.width = '300px'
    }
  }

  render() {
    const { token } = this.props.location.query;
    const { sign } = this.props;
    const lang = cookie.load('AA.lang') || dict.default;
    return (
      <div className={styles.layoutLogin}>
        <Helmet>
          <link rel="stylesheet" href="/assets/css/unipro.css" />
          <title>{title}</title>
          <link rel="icon" type="image/png" href={fav16} sizes="32x32" />
          <link rel="icon" type="image/png" href={fav32} sizes="16x16" />
          <meta name="apple-mobile-web-app-title" content={title} />
          <meta name="application-name" content={title} />
        </Helmet>
        <RestoreValidationForm sign={sign} onSubmit={data => {
          const payload = {
            token,
            password: data.password
          }

          this.refs.loadingModal.show()
          return fetch(`${api}/user/user-approveRestorePassword`, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(payload)
          })
            .then(response => response.json())
            .then(json => {
              this.refs.loadingModal.hide()
              if (json.errorCode === 1 && json.data) {
                if (json.data.resultCode === 1) {
                  this.refs.successModal.show()
                } else {
                  this.setState({ errorText: json.data.resultText })
                  this.refs.failModal.show()
                }
              } else {
                throw new SubmissionError({
                  password: '',
                  _error: dict[lang]['regs.smthWrong']
                })
              }
            })
        }} />

        <Modal ref='successModal' className={styles.modal} modalStyle={modalStyle} contentStyle={contentStyle}>
          <h2 className={styles.title}>{dict[lang]['regs.passChanged']}</h2>
          <Link to='/'>
            <button type='submit' className={styles.btnPrimary}>
              {dict[lang]['regs.logIn']}
            </button>
          </Link>
        </Modal>

        <Modal ref='loadingModal' contentStyle={contentStyle} backdrop={false}>
          <div className={styles.entryHeader}>
            <h2 className={styles.entryTitleCenter}>{dict[lang]['regs.loading']}</h2>
          </div>
          <div className={styles.textCenter}>
            <div className={styles.loaderMain}></div>
          </div>
        </Modal>


        <Modal ref='failModal' className={styles.modal} modalStyle={modalStyle} contentStyle={contentStyle}>
          <h2>{this.state.errorText}</h2>

        </Modal>
      </div>
    )
  }
}
const mapStateToProps = state => {
  const { sign, lang } = state;
  return { sign, lang }
};

const mapDispatchToProps = dispatch => ({
  showError: bindActionCreators(actions.createProfile, dispatch),
  setToken: bindActionCreators(actions.setToken, dispatch)
});

ProfilePasswordRestore = connect(
  mapStateToProps, mapDispatchToProps
)(ProfilePasswordRestore)

export default CSSModules(ProfilePasswordRestore, styles)
